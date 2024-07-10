const helperModel = require('../Helper/genericModel');

const getLocationsAndSubLocations = async () => {
    try {
        const results = await helperModel.getLocationsAndSubLocations();
        const locations ={};

        results.forEach(row => {
            const {location_id, location_name, sub_location_id, sub_location_name} = row;
            
            if (!locations[location_id]) {
                locations[location_id] = {
                    location_id,
                    location_name,
                    sub_locations: []
                };
            };

            locations[location_id].sub_locations.push({
                sub_location_id,
                sub_location_name
            });
        });

        const response = {
            locations: Object.values(locations)
        };

        return response;
    } catch (error) {
        console.error('Error service fetching locations and sublocations: ', error);
        throw error;
    }
};

const getIncidetTypesAndIncidentSubTypes = async () => {
    try {
        const results = await helperModel.getIncidetTypesAndIncidentSubTypes();
        const incidentTypes = {};

        results.forEach(row => {
            const {incident_type_id, incident_type_description, incident_subtype_id, incident_subtype_description} = row;

            if(!incidentTypes[incident_type_id]) {
                incidentTypes[incident_type_id] = {
                    incident_type_id,
                    incident_type_description,
                    incident_subtypes: []
                };
            };

            incidentTypes[incident_type_id].incident_subtypes.push({
                incident_subtype_id,
                incident_subtype_description
            });
        });

        const response = {
            incidentTypes: Object.values(incidentTypes)
        };

        return response;
    } catch (error) {
        console.error('Error service fetching incidet types and incident subtypes: ', error);
        throw error;
    }
};

module.exports = {
    getLocationsAndSubLocations,
    getIncidetTypesAndIncidentSubTypes
};