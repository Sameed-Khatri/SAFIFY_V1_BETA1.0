const pdf = require('html-pdf');
const db = require('../config/database');
const fs = require('fs');
const { Router } = require('express');
const router = Router();
const path = require('path');
const axios = require('axios'); // For fetching images from URL
const sharp = require('sharp'); // For image compression

async function fetchData() {
    const [rows] = await db.query(`SELECT user_report_id as 'Report ID', ur.user_id as 'User ID', user_name as 'User Name', status as 'Report Completion Status', 
                    image as 'Image', report_description as 'Report Description', date_time as 'Reporting Date Time', location_name as 'Reporting Location',
                    sub_location_name as 'Reporting Sub Location', incident_type_description as 'Incident Type', incident_subtype_description as 'Incident Sub Type', 
                    incident_criticality_level as 'Incident Criticality'
                    FROM user_report ur
                    JOIN sub_location sl ON ur.sub_location_id=sl.sub_location_id
                    JOIN incident_criticality ic ON ur.incident_criticality_id=ic.incident_criticality_id
                    JOIN incident_subtype ist ON ur.incident_subtype_id=ist.incident_subtype_id
                    JOIN location lt ON sl.location_id=lt.location_id
                    JOIN incident_type ict ON ist.incident_type_id=ict.incident_type_id
                    JOIN users u ON ur.user_id=u.user_id`);
    return rows;
}

async function fetchImage(url) {
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
}

async function compressImageBuffer(imageBuffer) {
    try {
        const compressedImageBuffer = await sharp(imageBuffer)
            .resize(800) // Resize to 800px width
            .jpeg({ quality: 60 }) // Compress with JPEG quality 60
            .toBuffer();
        return `data:image/jpeg;base64,${compressedImageBuffer.toString('base64')}`;
    } catch (error) {
        console.error(`Error compressing image buffer`, error);
        return ''; // Return empty string if there's an error
    }
}

async function getBase64Image(imgPath) {
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
}

router.get('/report2', async (req, res) => {
    const data = await fetchData();
    const logoPath = path.resolve(__dirname, '../assets/Safify Logo Current.jpeg');
    const logoBase64 = await getBase64Image(logoPath);
    const currentDate = new Date().toLocaleString();

    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Incident Reports</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .header-table { width: 100%; margin-bottom: 20px; }
            .header-table td { vertical-align: middle; }
            .header-table img { width: 150px; }
            .header-table .address { text-align: right; }
            .title-page-container { display: table; width: 100%; height: 100vh; }
            .title-page-content { display: table-cell; text-align: center; vertical-align: middle; }
            .title-page h1 { margin: 0; }
            .title-page p { margin: 10px 0 0 0; }
            .details, .inspection-details { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .details td, .details th, .inspection-details td, .inspection-details th { border: 1px solid black; padding: 8px; }
            .details th, .inspection-details th { text-align: left; background-color: #f2f2f2; }
            .page-break { page-break-before: always; }
        </style>
    </head>
    <body>
        <div class="title-page-container">
            <div class="title-page-content">
                <h1>Incident Reports</h1>
                <p>${currentDate}</p>
            </div>
        </div>
        <div class="page-break"></div>
    `;

    for (const report of data) {
        const imageHtml = report.Image ? `<img src="${await getBase64Image(report.Image)}" alt="Incident Image" style="width: 100%; height: auto;">` : 'No Image';
        html += `
        <table class="header-table">
            <tr>
                <td><img src="${logoBase64}" alt="Company Logo"></td>
                <td class="address">
                    <strong>Team Safify</strong><br>
                    Sea View Road, Sky Towers<br>
                    20th Floor<br>
                    Karachi
                </td>
            </tr>
        </table>
        <table class="details">
            <tr>
                <th>Report ID</th>
                <td>${report['Report ID']}</td>
                <th>Incident Type</th>
                <td>${report['Incident Type']}</td>
                <th rowspan="6">
                    ${imageHtml}
                </th>
            </tr>
            <tr>
                <th>Report Description</th>
                <td>${report['Report Description']}</td>
                <th>Incident Sub Type</th>
                <td>${report['Incident Sub Type']}</td>
            </tr>
            <tr>
                <th>Reporting Location</th>
                <td>${report['Reporting Location']}</td>
                <th>Reporting Sub Location</th>
                <td>${report['Reporting Sub Location']}</td>
            </tr>
            <tr>
                <th>Incident Criticality</th>
                <td>${report['Incident Criticality']}</td>
                <th>Report Completion Status</th>
                <td>${report['Report Completion Status']}</td>
            </tr>
        </table>
        ${data.indexOf(report) < data.length - 1 ? '<div class="page-break"></div>' : ''}
        `;
    }

    html += `
    </body>
    </html>
    `;

    const options = {
        format: 'A4',
        orientation: 'portrait',
        type: 'pdf',
        quality: '75'
    };

    pdf.create(html, options).toStream((err, stream) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.setHeader('Content-type', 'application/pdf');
        stream.pipe(res);
    });
});

module.exports = router;
