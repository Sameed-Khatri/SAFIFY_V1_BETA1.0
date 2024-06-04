const db = require('../config/database');
const path = require('path');
const generatePDF = require('./pdfTemplate');
const fs = require('fs');
const { Router } = require('express');
const router = Router();

router.get('/reports', async (req, res) => {
    // const { date, month } = req.query;

    // Modify your SQL query as needed
    let sqlQuery = `SELECT user_report_id as 'Report ID', ur.user_id as 'User ID', user_name as 'User Name', status as 'Report Completion Status', 
                    image as 'Image', report_description as 'Report Description', date_time as 'Reporting Date Time', location_name as 'Reporting Location',
                    sub_location_name as 'Reporting Sub Location', incident_type_description as 'Incident Type', incident_subtype_description as 'Incident Sub Type', 
                    incident_criticality_level as 'Incident Criticality'
                    FROM user_report ur
                    JOIN sub_location sl ON ur.sub_location_id=sl.sub_location_id
                    JOIN incident_criticality ic ON ur.incident_criticality_id=ic.incident_criticality_id
                    JOIN incident_subtype ist ON ur.incident_subtype_id=ist.incident_subtype_id
                    JOIN location lt ON sl.location_id=lt.location_id
                    JOIN incident_type ict ON ist.incident_type_id=ict.incident_type_id
                    JOIN users u ON ur.user_id=u.user_id`;

    try {
        const [results] = await db.query(sqlQuery); // Use promise-based query
        const outputFilePath = path.join(__dirname, 'reports.pdf');
        await generatePDF(results, outputFilePath);

        res.download(outputFilePath, 'reports.pdf', (err) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                fs.unlinkSync(outputFilePath); // delete the file after download
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
