const actionTeamService = require('../services/actionTeamService');
const helper = require('../Helper/generateNotifications');
// const redisOperation = require('../middlewares/redisOperation');

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

        // const cacheKey1 = `actionReportsAll`;
        // await redisOperation.delCache(cacheKey1);

        // const cacheKey2 = `assignedTasksActionTeam:${req.params.userid}`;
        // await redisOperation.delCache(cacheKey2);

        return res.status(200).json({status: 'report submitted'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: 'error inserting', error: error.message});
    }
};

const FetchAssignedTasks = async (req, res) => {
    try {
        const action_team_id = req.params.userid;

        // Check cache first
        // const cacheKey = `assignedTasksActionTeam:${action_team_id}`;
        // const cachedData = await redisOperation.getCache(cacheKey);
        // if (cachedData) {
        //     console.log('data found in redis cache: ');
        //     return res.status(200).json(cachedData);
        // }

        const result = await actionTeamService.FetchAssignedTasks(action_team_id);

        // Set cache
        // console.log('setting data in redis cache');
        // await redisOperation.setCache(cacheKey, result);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};


module.exports = {
    MakeActionReport,
    FetchAssignedTasks
};