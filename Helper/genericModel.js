const db = require('../config/database');

const getLocationsAndSubLocations = async () => {
    try {
        const query = `CALL getLocationsAndSubLocations()`;
        const result = await db.query(query);
        console.log('check',result[0][0]);
        return result[0][0];
    } catch (error) {
        console.error('Error model fetching locations and sublocations: ', error);
        throw error;
    }
};

const getIncidetTypesAndIncidentSubTypes = async () => {
    try {
        const query = `CALL getIncidetTypesAndIncidentSubTypes()`;
        const result = await db.query(query);
        console.log(result[0][0]);
        return result[0][0];
    } catch (error) {
        console.error('Error model fetching incidet types and incident subtypes: ', error);
        throw error;
    }
};

module.exports = {
    getLocationsAndSubLocations,
    getIncidetTypesAndIncidentSubTypes
};