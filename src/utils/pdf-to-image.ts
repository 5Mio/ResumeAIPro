
let pdfjsLib: any = null;

export async function convertPdfToImage(file: File): Promise<File> {
    if (typeof window === 'undefined') {
        throw new Error('PDF conversion must be done on the client side');
    }

    if (!pdfjsLib) {
        try {
            // Load PDF.js from CDN to avoid Next.js build issues with top-level await
            const scriptSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            const workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

            await new Promise<void>((resolve, reject) => {
                if ((window as any).pdfjsLib) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = scriptSrc;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load PDF.js script'));
                document.head.appendChild(script);
            });

            pdfjsLib = (window as any).pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

        } catch (e: any) {
            console.error('Failed to load pdfjs-dist:', e);
            throw new Error(`PDF Library Error: ${e.message}`);
        }
    }

    const arrayBuffer = await file.arrayBuffer();

    // Load document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    // Get first page
    const page = await pdf.getPage(1);

    // Set scale for good quality (2.0 = 200% DPI usually good for OCR/Vision)
    const scale = 2.0;
    const viewport = page.getViewport({ scale });

    // Prepare canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (!context) throw new Error('Could not create canvas context');

    // Render PDF page into canvas context
    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };

    await page.render(renderContext).promise;

    // Convert canvas to image file
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                // Create a new File object
                const imageFile = new File(
                    [blob],
                    file.name.replace(/\.pdf$/i, '.png'),
                    { type: 'image/png', lastModified: Date.now() }
                );
                resolve(imageFile);
            } else {
                reject(new Error('Canvas to Blob conversion failed'));
            }
        }, 'image/png');
    });
}
