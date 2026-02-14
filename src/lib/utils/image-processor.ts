import sharp from 'sharp';

export async function preprocessImage(
    buffer: Buffer,
    mimeType: string
): Promise<{ buffer: Buffer; mimeType: string }> {

    // Wenn es kein Bild ist (z.B. PDF), können wir es hier noch nicht verarbeiten
    // Später könnten wir hier PDF -> Image Konvertierung einbauen
    if (mimeType === 'application/pdf') {
        return { buffer, mimeType };
    }

    try {
        let pipeline = sharp(buffer);
        const metadata = await pipeline.metadata();

        // 1. Resize if too large (Max 2000px width/height)
        if ((metadata.width || 0) > 2000 || (metadata.height || 0) > 2000) {
            pipeline = pipeline.resize(2000, 2000, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // 2. Convert to JPEG and compress (Quality 80)
        // This significantly reduces base64 size for AI requests
        const processedBuffer = await pipeline
            .jpeg({ quality: 80 })
            .toBuffer();

        console.log(`📸 Image processed: Original ${buffer.length} bytes -> Processed ${processedBuffer.length} bytes`);

        return {
            buffer: processedBuffer,
            mimeType: 'image/jpeg'
        };
    } catch (error) {
        console.error('❌ Error processing image:', error);
        return { buffer, mimeType };
    }
}
