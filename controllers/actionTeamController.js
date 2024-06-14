const actionTeamService = require('../services/actionTeamService');
const helper = require('../Helper/generateNotifications');

const MakeActionReport = async (req,res) => {
    try {
        const reportData = {
            reported_by: req.body.reported_by,
            report_description: req.body.report_description,
            question_one: req.body.question_one,
            question_two: req.body.question_two,
            question_three: req.body.question_three,
            question_four: req.body.question_four,
            question_five: req.body.question_five,
            resolution_description: req.body.resolution_description,
            user_report_id: parseInt(req.body.user_report_id, 10),
            action_team_id: req.params.userid
        }
        console.log('Received report data:', reportData);
        const actionReportID = await actionTeamService.MakeActionReport(reportData,req.files);
        console.log('CONTROLLER');
        console.log(actionReportID);
        const admins = await actionTeamService.getAdminUserID();
        console.log(admins);
        const messageTitle = 'New Action Report Submitted';
        const messageBody = `New action report (report number: ${actionReportID}) has been submitted.`;
        for (const admin of admins) {
            console.log(admin);
            const response = await helper.sendNotification(admin.user_id,messageTitle,messageBody);
            console.log(response);
        };
        console.log(response);
        return res.status(200).json({status: 'report submitted'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: 'error inserting'});
    }
};

const FetchAssignedTasks = async (req, res) => {
    try {
        const action_team_id = req.params.userid;
        const result = await actionTeamService.FetchAssignedTasks(action_team_id);
        // const data = await actionTeamService.fetchPushNotificationData(action_team_id);
        // const response = {
        //     result: result,
        //     is_report_deleted: data[0].is_report_deleted,
        //     deleted_report_id: data[0].deleted_report_id
        // };
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error' });
    }
};


module.exports = {
    MakeActionReport,
    FetchAssignedTasks
};