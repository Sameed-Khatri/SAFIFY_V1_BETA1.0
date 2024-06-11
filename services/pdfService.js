const pdfModel = require('../models/pdfModel');
const htmlTemplate = require('../utils/htmlTemplatePDF');
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

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
            .resize(400) // Resize to 400px width
            .jpeg({ quality: 50 }) // Compress with JPEG quality 50
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

const generatePdfWithPuppeteer = async (html) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    return pdfBuffer;
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
    const pdfBuffer = await generatePdfWithPuppeteer(html);
    return pdfBuffer;
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
    const pdfBuffer = await generatePdfWithPuppeteer(html);
    return pdfBuffer;
};

module.exports = {
    generatePdf,
    generateActionReportPdf
};
