const pdfModel = require('../models/pdfModel');
const htmlTemplate = require('../utils/htmlTemplatePDF');
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');

const fetchImage = async (url) => {
    try {
        const response = await axios({
            url,
            responseType: 'arraybuffer'
        });
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error(`Error fetching image from URL: ${url}`, error);
        return null;
    }
};

const compressImageBuffer = async (imageBuffer) => {
    try {
        const compressedImageBuffer = await sharp(imageBuffer)
            .resize(400) // Resize to 800px width
            .jpeg({ quality: 50 }) // Compress with JPEG quality 60
            .toBuffer();
        return `data:image/jpeg;base64,${compressedImageBuffer.toString('base64')}`;
    } catch (error) {
        console.error(`Error compressing image buffer`, error);
        return '';
    }
};

const getBase64Image = async (imgPath) => {
    if (imgPath.startsWith('http')) {
        // Handle remote images
        const imageBuffer = await fetchImage(imgPath);
        if (imageBuffer) {
            return await compressImageBuffer(imageBuffer);
        }
    } else {
        // Handle local images
        if (fs.existsSync(imgPath)) {
            const imageBuffer = fs.readFileSync(imgPath);
            return await compressImageBuffer(imageBuffer);
        } else {
            console.error(`Image not found: ${imgPath}`);
        }
    }
    return '';
};

const generatePdf = async (year = null, month = null, date = null) => {
    const data = await pdfModel.GetUserReportsPDF(year, month, date);
    const logoPath = path.resolve(__dirname, '../assets/Safify Logo Current.jpeg');
    const logoBase64 = await getBase64Image(logoPath); // Get base64-encoded logo image
    const currentDate = new Date().toLocaleString();

    // Prepare image URLs in base64 format
    for (const report of data) {
        if (report['Image']) {
            report['Image'] = await getBase64Image(report['Image']);
        }
    }

    const html = htmlTemplate.generateHtml(data, logoBase64, currentDate); // Generate HTML

    const options = {
        format: 'A4',
        orientation: 'portrait',
        type: 'pdf',
        quality: '75',
        timeout: 300000, // Increase timeout to 5 minutes
        phantomArgs: ['--web-security=no', '--local-url-access=false', '--ignore-ssl-errors=true'],
    };

    return new Promise((resolve, reject) => {
        pdf.create(html, options).toStream((err, stream) => {
            if (err) {
                return reject(err);
            }
            resolve(stream);
        });
    });
};

const generateActionReportPdf = async (year = null, month = null, date = null) => {
    const data = await pdfModel.fetchActionReportData(year, month, date);
    const logoPath = path.resolve(__dirname, '../assets/Safify Logo Current.jpeg');
    const logoBase64 = await getBase64Image(logoPath); // Get base64-encoded logo image
    const currentDate = new Date().toLocaleString();

    // Prepare image URLs in base64 format
    for (const report of data) {
        if (report['Surrounding Image']) {
            report['Surrounding Image'] = await getBase64Image(report['Surrounding Image']);
        }
        if (report['Proof Image']) {
            report['Proof Image'] = await getBase64Image(report['Proof Image']);
        }
    }

    const html = htmlTemplate.generateActionReportHtml(data, logoBase64, currentDate); // Generate HTML

    const options = {
        format: 'A4',
        orientation: 'portrait',
        type: 'pdf',
        quality: '75',
        timeout: 300000, // Increase timeout to 5 minutes
        phantomArgs: ['--web-security=no', '--local-url-access=false', '--ignore-ssl-errors=true'],
    };

    return new Promise((resolve, reject) => {
        pdf.create(html, options).toStream((err, stream) => {
            if (err) {
                return reject(err);
            }
            resolve(stream);
        });
    });
};

module.exports = {
    generatePdf,
    generateActionReportPdf
};
