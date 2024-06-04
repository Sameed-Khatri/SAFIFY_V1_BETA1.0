const jwt = require('jsonwebtoken');
const loginModel = require('../models/loginModel')
const passwordSecurity = require('../middlewares/passwordSecurity');
const storeDeviceToken = require('../Helper/storeDeviceToken')

const checkCredentials = async (user_id,user_pass,device_token) => {
    try {
        const user = await loginModel.checkCredentials(user_id,user_pass);
        if(!user) {
            throw new Error('Authentication failed');
        }
        const userData = user[0][0];
        const passwordHash = userData.user_pass;
        console.log('passowrd from frontend: ',user_pass);
        console.log('hashed password from DB: ',passwordHash);

        const ismatch = await passwordSecurity.verifyPassword(user_pass, passwordHash);
        console.log('passwords matched ? ',ismatch);
        if(!ismatch) {
            throw new Error('Wrong Password');
        };

        const loginsAllowed = await checkLoginsAllowed(user_id);
        if(loginsAllowed === 0) {
            throw new Error('This Account is Already Logged in From Another Device');
        };

        const affectedRows = await storeDeviceToken.pushTokenDB(userData.user_id, userData.role_name, device_token);
        console.log(affectedRows);

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