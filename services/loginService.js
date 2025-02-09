const jwt = require('jsonwebtoken');
const loginModel = require('../models/loginModel')
const passwordSecurity = require('../middlewares/passwordSecurity');
const storeDeviceToken = require('../Helper/storeDeviceToken');
const notify = require('../Helper/generateNotifications');

const checkCredentials = async (user_id,user_pass,device_token) => {
    try {
        const user = await loginModel.checkCredentials(user_id);
        if(!user[0]) {
            throw new Error('Authentication failed');
        }
        
        const userData = user[0][0];
        if(!userData) {
            throw new Error('Incorrect User ID');
        };
        
        if(userData.login_attempts === 0) {
            const remainingTime = await loginModel.getRemainingTime(user_id);
            if(remainingTime < 3) {
                throw new Error(`Wait for ${3-remainingTime} minute(s) before attempting again`);
            } else if (remainingTime >=3) {
                await loginModel.updateLoginAttemptsAndTime(user_id, 0);
            }
        };

        const passwordHash = userData.user_pass;
        console.log('passowrd from frontend: ',user_pass);
        console.log('hashed password from DB: ',passwordHash);

        const ismatch = await passwordSecurity.verifyPassword(user_pass, passwordHash);
        console.log('passwords matched ? ',ismatch);
        if(!ismatch) {
            const checkLoginAttempts = await loginModel.checkLoginAttempts(user_id);
            if(checkLoginAttempts != 0) {
                await loginModel.updateLoginAttemptsAndTime(user_id, 1);
            };
            throw new Error('Wrong Password');
        };


        const notificationResponse = await notify.sendNotification(user_id,'empty','empty',true);
        if (notificationResponse === 'failure' || notificationResponse === null) {
            console.log('validating device token: ',notificationResponse);
            await updateLoginsAllowed(user_id,1);
        };
        

        const loginsAllowed = await checkLoginsAllowed(user_id);
        console.log("logins allowed: ", loginsAllowed);
        if(loginsAllowed === 0) {
            throw new Error('This Account is Already Logged in From Another Device');
        };

        const affectedRows = await storeDeviceToken.pushTokenDB(userData.user_id, userData.role_name, device_token);
        console.log(affectedRows);

        await loginModel.updateLoginAttemptsAndTime(user_id, 0);
        // const remainingTime = await loginModel.getRemainingTime(user_id);
        // if(remainingTime >= 3) {
            
        // };

        const token = jwt.sign({user_id: userData.user_id, role_name: userData.role_name, user_name: userData.user_name}, process.env.JWT_SECRET, { expiresIn: '24h' });
        console.log('token: '+ token);
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('token role name: ',decode);
        return token;
    } catch (error) {
        console.error('Error in authentication service: ', error);
        throw error;
    }
};

const checkLoginsAllowed = async (user_id) => {
    try {
        return await loginModel.checkLoginsAllowed(user_id);
    } catch (error) {
        console.error('Error service check logins allowed: ', error);
        throw error;
    }
};

const updateLoginsAllowed = async (user_id,flag) => {
    try {
        return await loginModel.updateLoginsAllowed(user_id,flag);
    } catch (error) {
        console.error('Error service update logins allowed: ', error);
        throw error;
    }
};

module.exports = {
    checkCredentials,
    checkLoginsAllowed,
    updateLoginsAllowed
};