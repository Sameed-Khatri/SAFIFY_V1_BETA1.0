const db = require('../config/database');

const fetchAllSolutions = async () => {
    try {
        const query = `CALL fetchAllSolutions()`;
        const result = await db.query(query);
        return result;
    } catch (error) {
        console.error('Error fetching all solutions: ', error);
        throw error;
    }
};

module.exports = {
    fetchAllSolutions
};