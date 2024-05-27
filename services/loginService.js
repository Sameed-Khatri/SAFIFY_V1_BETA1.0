const jwt = require('jsonwebtoken');
const loginModel = require('../models/loginModel')
const passwordSecurity = require('../middlewares/passwordSecurity');

const checkCredentials = async (user_id,user_pass) => {
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
        }
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

module.exports = {
    checkCredentials
};