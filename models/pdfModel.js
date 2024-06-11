const db = require('../config/database');

const GetUserReportsPDF = async (year = null, month = null, date = null) => {
    try {
        const query = `CALL GetUserReportsPDF(?, ?, ?)`;
        const [rows] = await db.query(query, [year, month, date]);
        return rows[0];
    } catch (error) {
        console.error('Error model fetching user report data: ', error);
        throw error;
    }
};

const fetchActionReportData = async (year = null, month = null, date = null) => {
    try {
        const query = `CALL GetActionReportsPDF(?, ?, ?)`;
        const [rows] = await db.query(query, [year, month, date]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching action report data: ', error);
        throw error;
    }
};

module.exports = {
    GetUserReportsPDF,
    fetchActionReportData
};
