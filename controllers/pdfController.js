const pdfService = require('../services/pdfService');
const FormData = require('form-data');
const { Readable } = require('stream');
// const archiver = require('archiver');
// const stream = require('stream');

const generatePdfReport = async (req, res) => {
    try {
        const { year, month, day, flag } = req.query;
        const parsedFlag = Number(flag);
        let pdfBuffer = null;

        if (parsedFlag === 0) {
            pdfBuffer = await pdfService.generatePdf(year, month, day);
        } else if (parsedFlag === 1) {
            pdfBuffer = await pdfService.generateActionReportPdf(year, month, day);
        } 
        // else if (parsedFlag === 2) {
        //     pdfBufferUserReport = await pdfService.generatePdf(year, month, day);
        //     pdfBufferActionReport = await pdfService.generateActionReportPdf(year, month, day);

        //     const form = new FormData();
        //     form.append('userReport', Readable.from(pdfBufferUserReport), {
        //         filename: 'UserReport.pdf',
        //         contentType: 'application/pdf'
        //     });
        //     form.append('actionReport', Readable.from(pdfBufferActionReport), {
        //         filename: 'ActionReport.pdf',
        //         contentType: 'application/pdf'
        //     });

        //     res.setHeader('Content-Type', `multipart/form-data; boundary=${form.getBoundary()}`);
        //     form.pipe(res);
        // } 
        else {
            return res.status(400).json({ status: 'Invalid flag value' });
        }

        res.setHeader('Content-type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Internal Server Error', error: error.message });
    }
};

const generateActionReportPdf = async (req, res) => {
    try {
        const { year, month, day } = req.query;
        const pdfBuffer = await pdfService.generateActionReportPdf(year, month, day);
        res.setHeader('Content-type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Internal Server Error', error: error.message });
    }
};


// const generatePdfReport = async (req, res) => {
//     try {
//         const { year, month, day, flag } = req.query;
//         const parsedFlag = Number(flag);
//         let pdfBufferUserReport = null;
//         let pdfBufferActionReport = null;

//         if (parsedFlag === 0) {
//             pdfBufferUserReport = await pdfService.generatePdf(year, month, day);
//             res.setHeader('Content-type', 'application/pdf');
//             res.send(pdfBufferUserReport);
//         } else if (parsedFlag === 1) {
//             pdfBufferActionReport = await pdfService.generateActionReportPdf(year, month, day);
//             res.setHeader('Content-type', 'application/pdf');
//             res.send(pdfBufferActionReport);
//         } else if (parsedFlag === 2) {
//             pdfBufferUserReport = await pdfService.generatePdf(year, month, day);
//             pdfBufferActionReport = await pdfService.generateActionReportPdf(year, month, day);
            
//             const archive = archiver('zip', {
//                 zlib: { level: 9 }
//             });

//             res.setHeader('Content-Type', 'application/zip');
//             res.setHeader('Content-Disposition', 'attachment; filename=reports.zip');

//             archive.on('error', (err) => {
//                 throw err;
//             });

//             archive.pipe(res);

//             // Append the PDF buffers to the archive
//             archive.append(pdfBufferUserReport, { name: 'userReport.pdf' });
//             archive.append(pdfBufferActionReport, { name: 'actionReport.pdf' });

//             await archive.finalize();
//         } else {
//             return res.status(400).json({ status: 'Invalid flag value' });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ status: 'Internal Server Error', error: error.message });
//     }
// };

module.exports = {
    generatePdfReport,
    generateActionReportPdf
};
