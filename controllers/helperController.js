const passwordHashDB = require('../Helper/hashPasswordsDB');
const revert = require('../Helper/revertPushNotification');
const sendNotification = require('../Helper/generateNotifications');
const helperService = require('../services/helperService');
// const redisOperation = require('../middlewares/redisOperation');

const updatePasswords = async (req, res) => {
    try {
        const bool = await passwordHashDB.updatePasswords();
        if (!bool) {
            return res.status(500).json({ status: 'Internal server error false', error: error.message });
        }
        return res.status(200).json({ status: 'Passwords Hashed'}); 
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const revertPushNotification = async (req, res) => {
    try {
        const user_id = req.params.userid;
        const affectedRows = await revert.revertPushNotification(user_id);
        if(affectedRows != 1) {
            return res.status(404).json({ status: 'No Push Notification Reverted' });
        }
        return res.status(200).json({status: 'reverted push notification updates'});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error', error: error.message});
    }
};

const sendDummyNotification = async (req, res) => {
    try {
        messageTitle = 'Dummy Notification';
        messageBody = 'Dummy';
        const response = await sendNotification.sendNotification(req.body.user_id, messageTitle, messageBody);
        console.log(response);
        return res.status(200).json({status: 'dummy notification sent'});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error', error: error.message});
    }
};

const getLocationsAndSubLocations = async (req, res) => {
    try {
        const result = await helperService.getLocationsAndSubLocations();

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const getIncidetTypesAndIncidentSubTypes = async (req, res) => {
    try {
        const result = await helperService.getIncidetTypesAndIncidentSubTypes();
        
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

module.exports = {
    updatePasswords,
    revertPushNotification,
    sendDummyNotification,
    getLocationsAndSubLocations,
    getIncidetTypesAndIncidentSubTypes
};