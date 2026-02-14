import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (elementId: string, filename: string = 'lebenslauf.pdf') => {
    const element = document.getElementById(elementId);

    if (!element) {
        throw new Error('Element not found');
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better quality
            useCORS: true, // Allow loading images from other domains
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');

        // Calculate PDF dimensions (A4)
        const pdfHelp = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdfHelp.internal.pageSize.getWidth();
        const pdfHeight = pdfHelp.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0; // Top align

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, (imgHeight * pdfWidth) / imgWidth);

        pdf.save(filename);
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};
