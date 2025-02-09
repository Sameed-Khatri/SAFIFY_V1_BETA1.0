const analyticsModel = require('../models/analyticsModel');

const fetchIncidentsReported = async () => {
    try {
        const result = await analyticsModel.fetchIncidentsReported();
        console.log(result[0][0]);
        const result2 = result[0][0];
        const incidentCount = result2[0].incidents_reported;
        console.log(incidentCount);
        return incidentCount;
    } catch (error) {
        console.error('Error service fetching reported incidents: ', error);
        throw error;
    }
};

const fetchIncidentsResolved = async () => {
    try {
        const result = await analyticsModel.fetchIncidentsResolved();
        const result2 = result[0][0];
        const incidentCount = result2[0].incidents_resolved;
        return incidentCount;
    } catch (error) {
        console.error('Error service fetching resolved incidents: ', error);
        throw error;
    }
};

const fetchTotalIncidentsOnTypes = async () => {
    try {
        const result = await analyticsModel.fetchTotalIncidentsOnTypes();
        const result2 = result[0][0];
        console.log(result2);
        return result2;
    } catch (error) {
        console.error('Error service fetching incidents on types: ', error);
        throw error;
    }
};

const fetchTotalIncidentsOnSubTypes = async () => {
    try {
        const result = await analyticsModel.fetchTotalIncidentsOnSubTypes();
        const result2 = result[0][0];
        return result2;
    } catch (error) {
        console.error('Error service fetching incidents on sub types: ', error);
        throw error;
    }
};

const fetchTotalIncidentsOnLocations = async () => {
    try {
        const result = await analyticsModel.fetchTotalIncidentsOnLocations();
        const result2 = result[0][0];
        return result2;
    } catch (error) {
        console.error('Error service fetching incidents on locations: ', error);
        throw error;
    }
};

const fetchEfficiency = async () => {
    try {
        const result = await analyticsModel.fetchEfficiency();
        const result2 = result[0][0];
        console.log(result2);
        const data = result2.map(entry => ({
            action_team_name: entry.action_team_name,
            efficiency_value: parseFloat(entry.efficiency_value).toFixed(2)
        }));
        return data;
    } catch (error) {
        console.error('Error service fetching efficiency: ', error);
        throw error;
    }
};

const fetchAllAnalytics = async () => {
    try {
        const incidentsReported = await fetchIncidentsReported();
        const incidentsResolved = await fetchIncidentsResolved();
        const totalIncidentsOnTypes = await fetchTotalIncidentsOnTypes();
        const totalIncidentsOnSubTypes = await fetchTotalIncidentsOnSubTypes();
        const totalIncidentsOnLocations = await fetchTotalIncidentsOnLocations();
        const efficiency = await fetchEfficiency();
        
        const response = {
            incidentsReported,
            incidentsResolved,
            totalIncidentsOnTypes,
            totalIncidentsOnSubTypes,
            totalIncidentsOnLocations,
            efficiency
        };
        
        return response;
    } catch (error) {
        console.error('Error service fetching all analytics: ', error);
        throw error;
    }
};

const fetchUserMetrics = async () => {
    try {
        return await analyticsModel.fetchUserMetrics();
    } catch (error) {
        console.error('Error service fetching user metrics: ', error);
        throw error;
    }
};

module.exports = {
    fetchIncidentsReported,
    fetchIncidentsResolved,
    fetchTotalIncidentsOnTypes,
    fetchTotalIncidentsOnSubTypes,
    fetchTotalIncidentsOnLocations,
    fetchEfficiency,
    fetchAllAnalytics,
    fetchUserMetrics
};