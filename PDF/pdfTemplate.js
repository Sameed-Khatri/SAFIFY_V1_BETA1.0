const PDFDocument = require('pdfkit');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchImage(url) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer'
  });
  return response.data;
}

async function generatePDF(reports, outputFilePath) {
  const doc = new PDFDocument({ margin: 30 });
  const writeStream = fs.createWriteStream(outputFilePath);
  const logoPath = path.join(__dirname, '../assets/Safify Logo Current.jpeg'); // Adjust the path as needed

  doc.pipe(writeStream);

  // Add header
  const addHeader = () => {
    doc.image(logoPath, 30, 20, { width: 100 });
    doc.fontSize(12).text('Team Safify', 450, 20, { align: 'right' });
    doc.fontSize(10).text('Address Line 1', 450, 35, { align: 'right' });
    doc.fontSize(10).text('Address Line 2', 450, 50, { align: 'right' });
    doc.moveDown(2);
  };

  // Add title
  const addTitle = () => {
    doc.fontSize(18).text('Building Inspection Report', { align: 'center' }).moveDown(0.5);
    doc.fontSize(12).text('Prepared By: Safify Team', { align: 'center' }).moveDown(1);
    const currentDate = new Date();
    doc.fontSize(12).text(`Date: ${currentDate.toDateString()}`, { align: 'center' }).moveDown(2);
  };

  // Add report details in a table-like format
  const addReportDetails = async (report) => {
    doc.moveDown(1);

    // Add images
    const imageY = doc.y;
    try {
      const imageBuffer = await fetchImage(report['Image']);
      doc.image(imageBuffer, 400, imageY, {
        fit: [150, 150],
        align: 'center',
        valign: 'center'
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      doc.text('Image could not be loaded.', 400, imageY);
    }

    // Add details in a table-like format
    doc.moveTo(30, imageY).lineTo(570, imageY).stroke();
    doc.fontSize(12).fillColor('black');

    const details = [
      { label: 'Report ID', value: report['Report ID'] },
      { label: 'User ID', value: report['User ID'] },
      { label: 'User Name', value: report['User Name'] },
      { label: 'Report Completion Status', value: report['Report Completion Status'] },
      { label: 'Report Description', value: report['Report Description'] },
      { label: 'Reporting Date Time', value: new Date(report['Reporting Date Time']).toLocaleString() },
      { label: 'Reporting Location', value: report['Reporting Location'] },
      { label: 'Reporting Sub Location', value: report['Reporting Sub Location'] },
      { label: 'Incident Type', value: report['Incident Type'] },
      { label: 'Incident Sub Type', value: report['Incident Sub Type'] },
      { label: 'Incident Criticality', value: report['Incident Criticality'] },
    ];

    const startX = 30;
    const startY = imageY + 160;

    details.forEach((detail, index) => {
      const yPosition = startY + index * 20;
      doc.font('Helvetica-Bold').text(`${detail.label}: `, startX, yPosition, { continued: true })
        .font('Helvetica').text(detail.value);
    });

    doc.moveDown(3);
  };

  // Add footer with page numbers
  const addFooter = (pageNumber) => {
    doc.fontSize(10).text(`Page ${pageNumber}`, {
      align: 'center',
      baseline: 'bottom'
    });
  };

  // Generate the PDF
  addHeader();
  addTitle();

  let pageNumber = 1;
  for (const report of reports) {
    await addReportDetails(report);
    addFooter(pageNumber);
    pageNumber++;
    if (pageNumber <= reports.length) {
      doc.addPage();
      addHeader();
      addTitle();
    }
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

module.exports = generatePDF;
