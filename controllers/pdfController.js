const pdfService = require('../services/pdfService');

const generatePdfReport = async (req, res) => {
    try {
        const { year, month, date, flag } = req.query;
        const parsedFlag = Number(flag);
        let pdfBuffer = null;

        if (parsedFlag === 0) {
            pdfBuffer = await pdfService.generatePdf(year, month, date);
        } else if (parsedFlag === 1) {
            pdfBuffer = await pdfService.generateActionReportPdf(year, month, date);
        } else {
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
