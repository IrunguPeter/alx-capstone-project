import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId, filename = 'PC-Build-Specs.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#1a1714', // Match the ink summary background
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Add a header
    pdf.setFillColor(26, 23, 20); // #1a1714
    pdf.rect(0, 0, pdfWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text('PARTPICKER 2026', 20, 20);
    pdf.setFontSize(10);
    pdf.text('RULE-BASED CURATION • BUILD VERIFIED', 20, 30);

    // Add the component image
    pdf.addImage(imgData, 'PNG', 10, 50, pdfWidth - 20, pdfHeight - 20);

    // Add a footer
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(8);
    pdf.text(`Generated on ${new Date().toLocaleDateString()} • Ref: PC-2026-X89`, 20, pdf.internal.pageSize.getHeight() - 10);

    pdf.save(filename);
  } catch (error) {
    console.error('PDF Export Error:', error);
  }
};
