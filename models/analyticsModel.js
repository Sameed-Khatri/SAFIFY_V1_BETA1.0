const db = require('../config/database');

const fetchIncidentsReported = async () => {
    try {
        const query = `CALL getIncidentsReported()`;
        const result = await db.query(query);
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error model fetching reported incidents: ', error);
        throw error;
    }
};

const fetchIncidentsResolved = async () => {
    try {
        const query = `CALL getIncidentsResolved()`;
        const result = await db.query(query);
        return result;
    } catch (error) {
        console.error('Error model fetching resolved incidents: ', error);
        throw error;
    }
};

const fetchTotalIncidentsOnTypes = async () => {
    try {
        const query = `CALL getTotalIncidentsOnTypes()`;
        const result = await db.query(query);
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error model fetching incidents on types: ', error);
        throw error;
    }
};

const fetchTotalIncidentsOnSubTypes = async () => {
    try {
        const query = `CALL getTotalIncidentsOnSubTypes()`;
        const result = await db.query(query);
        return result;
    } catch (error) {
        console.error('Error model fetching incidents on sub types: ', error);
        throw error;
    }
};

const fetchTotalIncidentsOnLocations = async () => {
    try {
        const query = `CALL getTotalIncidentsOnLocations()`;
        const result = await db.query(query);
        return result;
    } catch (error) {
        console.error('Error model fetching incidents on locations: ', error);
        throw error;
    }
};

const fetchEfficiency = async () => {
    try {
        const query = `CALL getEfficiency()`;
        const result = await db.query(query);
        return result;
    } catch (error) {
        console.error('Error model fetching efficiency: ', error);
        throw error;
    }
};

module.exports = {
    fetchIncidentsReported,
    fetchIncidentsResolved,
    fetchTotalIncidentsOnTypes,
    fetchTotalIncidentsOnSubTypes,
    fetchTotalIncidentsOnLocations,
    fetchEfficiency
};