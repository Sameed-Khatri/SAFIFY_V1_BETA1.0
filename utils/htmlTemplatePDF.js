const generateHtml = (data, logoBase64, currentDate) => {
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Incident Reports</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .header-table { width: 98%; margin-bottom: 20px; }
            .header-table td { vertical-align: middle; }
            .header-table img { width: 150px; }
            .header-table .address { text-align: right; }
            .title-page-container { display: table; width: 100%; height: 100vh; }
            .title-page-content { display: table-cell; text-align: center; vertical-align: middle; }
            .title-page h1 { margin: 0; }
            .title-page p { margin: 10px 0 0 0; }
            .details, .inspection-details { width: 95%; margin: 0 auto; border-collapse: collapse; margin-top: 20px; }
            .details td, .details th, .inspection-details td, .inspection-details th { border: 1px solid black; padding: 8px; }
            .details th, .inspection-details th { text-align: left; background-color: #f2f2f2; }
            .image-table { width: 95%; margin: 20px auto; border-collapse: collapse; }
            .image-table td, .image-table th { border: 1px solid black; padding: 8px; text-align: center; }
            .image-table th { background-color: #f2f2f2; }
            .image-container img { width: 100%; height: auto; max-width: 250px; max-height: 250px; object-fit: contain; }
            h3 { margin-bottom: 0; font-size: 14px; }
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
        const imageHtml = report.Image ? `<img src="${report.Image}" class="image-container" alt="Incident Image" style="max-width: 250px; max-height: 250px;">` : 'No Image';
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
            </tr>
            <tr>
                <th>Incident Type</th>
                <td>${report['Incident Type']}</td>
            </tr>
            <tr>
                <th>Report Description</th>
                <td>${report['Report Description']}</td>
            </tr>
            <tr>
                <th>Incident Sub Type</th>
                <td>${report['Incident Sub Type']}</td>
            </tr>
            <tr>
                <th>Reporting Location</th>
                <td>${report['Reporting Location']}</td>
            </tr>
            <tr>
                <th>Reporting Sub Location</th>
                <td>${report['Reporting Sub Location']}</td>
            </tr>
            <tr>
                <th>Incident Criticality</th>
                <td>${report['Incident Criticality']}</td>
            </tr>
            <tr>
                <th>Report Completion Status</th>
                <td>${report['Report Completion Status']}</td>
            </tr>
        </table>
        <table class="image-table">
            <tr>
                <th>Incident Image</th>
            </tr>
            <tr>
                <td>${imageHtml}</td>
            </tr>
        </table>
        ${data.indexOf(report) < data.length - 1 ? '<div class="page-break"></div>' : ''}
        `;
    }

    html += `
    </body>
    </html>
    `;

    return html;
};


const generateActionReportHtml = (data, logoBase64, currentDate) => {
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Action Reports</title>
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
            .report-container { page-break-before: always; margin: 20px; }
            .details { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .details td, .details th { border: 1px solid black; padding: 8px; }
            .details th { text-align: left; background-color: #f2f2f2; }
            .image-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .image-table td, .image-table th { border: 1px solid black; padding: 8px; text-align: center; }
            .image-table th { background-color: #f2f2f2; }
            .image-container img { width: 100%; height: auto; max-width: 250px; max-height: 250px; object-fit: contain; }
            h3 { margin-bottom: 0; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="title-page-container">
            <div class="title-page-content">
                <h1>Action Reports</h1>
                <p>${currentDate}</p>
            </div>
        </div>
    `;

    for (const report of data) {
        const surroundingImageHtml = report['Surrounding Image'] ? `<img src="${report['Surrounding Image']}" class="image-container" alt="Surrounding Image" style="max-width: 250px; max-height: 250px;">` : 'No Image';
        const proofImageHtml = report['Proof Image'] ? `<img src="${report['Proof Image']}" class="image-container" alt="Proof Image" style="max-width: 250px; max-height: 250px;">` : 'No Image';
        html += `
        <div class="report-container">
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
                    <th>Action Report ID</th>
                    <td>${report['Action Report ID']}</td>
                </tr>
                <tr>
                    <th>Reported By</th>
                    <td>${report['Reported By']}</td>
                </tr>
                <tr>
                    <th>Report Description</th>
                    <td colspan="3">${report['Report Description']}</td>
                </tr>
                <tr>
                    <th>Problem Statement</th>
                    <td colspan="3">${report['Problem Statement']}</td>
                </tr>
                <tr>
                    <th>Question 2</th>
                    <td colspan="3">${report['Question 2']}</td>
                </tr>
                <tr>
                    <th>Question 3</th>
                    <td colspan="3">${report['Question 3']}</td>
                </tr>
                <tr>
                    <th>Question 4</th>
                    <td colspan="3">${report['Question 4']}</td>
                </tr>
                <tr>
                    <th>Root Cause</th>
                    <td colspan="3">${report['Root Cause']}</td>
                </tr>
                <tr>
                    <th>Resolution Description</th>
                    <td colspan="3">${report['Resolution Description']}</td>
                </tr>
                <tr>
                    <th>Action Team</th>
                    <td colspan="3">${report['Action Team']}</td>
                </tr>
                <tr>
                    <th>Reporting Date Time</th>
                    <td colspan="3">${report['Reporting Date Time']}</td>
                </tr>
                <tr>
                    <th>Incident Report ID</th>
                    <td colspan="3">${report['Incident Report ID']}</td>
                </tr>
                <tr>
                    <th>Incident Report Description</th>
                    <td colspan="3">${report['Incident Report Description']}</td>
                </tr>
            </table>
            <table class="image-table">
                <tr>
                    <th>Surrounding Image</th>
                    <th>Proof Image</th>
                </tr>
                <tr>
                    <td>${surroundingImageHtml}</td>
                    <td>${proofImageHtml}</td>
                </tr>
            </table>
        </div>
        ${data.indexOf(report) < data.length - 1 ? '<div class="page-break"></div>' : ''}
        `;
    }

    html += `
    </body>
    </html>
    `;

    return html;
};



module.exports = {
    generateHtml,
    generateActionReportHtml
};
