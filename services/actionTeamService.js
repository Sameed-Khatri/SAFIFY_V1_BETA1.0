const actionTeamModel = require('../models/actionTeamModel');
const cloudinaryUtil = require('../middlewares/cloudinaryUtil');


const MakeActionReport = async (reportData,files) => {
    try {
        console.log('SERVICE')
        console.log('Received files:', files)
        console.log('Received report data:', reportData)
        const ID = await actionTeamModel.getActionTeamIdFromUserId(reportData.action_team_id);
        const action_team_id=ID.action_team_id;
        if(!action_team_id){
            throw new Error('Action team ID not found');
        }
        // const questions = [
        //     reportData.question_one,
        //     reportData.question_two,
        //     reportData.question_three,
        //     reportData.question_four,
        //     reportData.question_five
        // ];
    
        // const answeredQuestions = questions.filter(question => question && question.trim() !== '').length;
        // if (answeredQuestions < 3) {
        //     throw new Error('At least three questions should be answered.');
        // }
        if(reportData.question_one == '' && reportData.question_two == '' && reportData.question_three == '') {
            throw new Error('Question 1, 2, 3 should be answered.');
        }
        let q4,q5;
        if(reportData.question_four == '') {
            q4='null';
        } else {q4=reportData.question_four};
        if(reportData.question_five == '') {
            q5='null';
        } else {q5=reportData.question_five};

        let surroundingImageUrl = null;
        let proofImageUrl = null;
        if(files.surrounding_image && files.surrounding_image[0]){
            const uploadResult1 = await cloudinaryUtil.uploadImage(files.surrounding_image[0].buffer);
            surroundingImageUrl = uploadResult1.url;
        }
        if(files.proof_image && files.proof_image[0]){
            const uploadResult2 = await cloudinaryUtil.uploadImage(files.proof_image[0].buffer);
            proofImageUrl = uploadResult2.url;
        }
        console.log(proofImageUrl);
        console.log(surroundingImageUrl);
        const reportDetails = [
            reportData.reported_by,
            surroundingImageUrl,
            reportData.report_description,
            reportData.question_one,
            reportData.question_two,
            reportData.question_three,
            q4,
            q5,
            reportData.resolution_description,
            proofImageUrl,
            reportData.user_report_id,
            action_team_id
        ];
        console.log(reportDetails);
        const insertResult = await actionTeamModel.insertActionReport(reportDetails);
        return insertResult;
    } catch (error) {
        console.error('Error service inserting action report: ', error);
        throw error;
    }
};

const FetchAssignedTasks = async (action_team_id) => {
    try {
        const status='assigned';
        return await actionTeamModel.fetchAssignedTasks(action_team_id,status);
    } catch (error) {
        console.error('Error service fetching assigned tasks: ', error);
        throw error;
    }
};

const fetchPushNotificationData = async (user_id) => {
    try {
        return await actionTeamModel.fetchPushNotificationData(user_id);
    } catch (error) {
        console.error('Error service fetching push notification data: ', error);
        throw error;
    }
};

module.exports = {
    MakeActionReport,
    FetchAssignedTasks,
    fetchPushNotificationData
};


