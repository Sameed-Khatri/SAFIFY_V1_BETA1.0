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
  const logoPath = path.join(__dirname, '../assets/safify logo new.png'); // Adjust the path as needed

  doc.pipe(writeStream);

  // Add a title page
  const addTitlePage = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.toDateString()}`;

    doc.image(logoPath, doc.page.width - 150, 20, { width: 100 });
    doc.moveDown(4);
    doc.fontSize(30).text('User Reports', { align: 'center' }).moveDown(2);
    doc.fontSize(20).text(`Date: ${formattedDate}`, { align: 'center' }).moveDown(10);
    doc.addPage();
  };

  // Add a header with the logo on each page
  const addHeader = () => {
    doc.image(logoPath, doc.page.width - 150, 20, { width: 100 });
    doc.moveDown(2);
  };

  doc.on('pageAdded', addHeader);

  // Add title page first
  addTitlePage();

  for (const report of reports) {
    addHeader();

    doc.fontSize(18).text('Incident Report', { align: 'center' }).moveDown();

    doc.fontSize(12).text(`Report ID: ${report['Report ID']}`);
    doc.fontSize(12).text(`User ID: ${report['User ID']}`);
    doc.fontSize(12).text(`User Name: ${report['User Name']}`);
    doc.fontSize(12).text(`Report Completion Status: ${report['Report Completion Status']}`);
    doc.fontSize(12).text(`Report Description: ${report['Report Description']}`);
    doc.fontSize(12).text(`Reporting Date Time: ${report['Reporting Date Time']}`);
    doc.fontSize(12).text(`Reporting Location: ${report['Reporting Location']}`);
    doc.fontSize(12).text(`Reporting Sub Location: ${report['Reporting Sub Location']}`);
    doc.fontSize(12).text(`Incident Type: ${report['Incident Type']}`);
    doc.fontSize(12).text(`Incident Sub Type: ${report['Incident Sub Type']}`);
    doc.fontSize(12).text(`Incident Criticality: ${report['Incident Criticality']}`);

    // Fetch and embed the image
    if (report['Image']) {
      try {
        const imageBuffer = await fetchImage(report['Image']);
        doc.text('Image:').moveDown(0.5);
        doc.image(imageBuffer, {
          fit: [500, 300],
          align: 'center',
          valign: 'center'
        }).moveDown();
      } catch (error) {
        console.error('Error fetching image:', error);
        doc.text('Image could not be loaded.');
      }
    } else {
      doc.text('No image available.');
    }

    doc.addPage(); // Add a new page for each report
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

module.exports = generatePDF;
