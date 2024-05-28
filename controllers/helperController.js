const passwordHashDB = require('../Helper/hashPasswordsDB');
const revert = require('../Helper/revertPushNotification');

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
        return res.status(500).json({status: 'Internal Server Error'});
    }
};

module.exports = {
    updatePasswords,
    revertPushNotification
};