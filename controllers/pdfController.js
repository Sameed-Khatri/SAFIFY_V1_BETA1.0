const pdfService = require('../services/pdfService');

const generatePdfReport = async (req, res) => {
    try {
        const pdfBuffer = await pdfService.generatePdf();
        res.setHeader('Content-type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Internal Server Error', error: error.message });
    }
};

const generateActionReportPdf = async (req, res) => {
    try {
        const { year, month, date } = req.query;
        const pdfBuffer = await pdfService.generateActionReportPdf(year, month, date);
        res.setHeader('Content-type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    generatePdfReport,
    generateActionReportPdf
};
