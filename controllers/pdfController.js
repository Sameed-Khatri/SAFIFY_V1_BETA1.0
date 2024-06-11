const pdfService = require('../services/pdfService');

const generatePdfReport = async (req, res) => {
    try {
        const pdfStream = await pdfService.generatePdf();
        res.setHeader('Content-type', 'application/pdf');
        pdfStream.pipe(res);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Internal Server Error' });
    }
};

const generateActionReportPdf = async (req, res) => {
    try {
        const { year, month, date } = req.query;
        const pdfStream = await pdfService.generateActionReportPdf(year, month, date);
        res.setHeader('Content-type', 'application/pdf');
        pdfStream.pipe(res);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Internal Server Error' });
    }
};

module.exports = {
    generatePdfReport,
    generateActionReportPdf
};
