const db = require('../config/database');

const checkCredentials = async (user_id) => {
    try {
        const query = `CALL CheckCredentials(?)`;
        const result = await db.query(query,[user_id]);

        return result[0];
    } catch (error) {
        console.error('Error model checking credentials: ', error);

        if (error.sqlState === '45000') {
            throw new Error(error.sqlMessage);
        };
        
        throw error;
    }
};

const checkLoginsAllowed = async (user_id) => {
    try {
        const query = `CALL checkLoginsAllowed(?)`;
        const result = await db.query(query, [user_id]);

        return result[0][0][0].logins_allowed;
    } catch (error) {
        console.error('Error model checking logins allowed: ', error);
        throw error;
    }
};

const updateLoginsAllowed = async (user_id,flag) => {
    try {
        const query = `CALL updateLoginsAllowed(?,?)`;
        const result = await db.query(query, [user_id, flag]);
        return result;
    } catch (error) {
        console.error('Error model updating logins allowed: ', error);
        throw error;
    }
};

const updateLoginAttemptsAndTime = async (user_id, flag) => {
    try {
        const query = `CALL updateLoginAttempts(?, ?)`;
        const result = await db.query(query, [user_id, flag]);
        return result;
    } catch (error) {
        console.error('Error model update login attempts: ', error);
        throw error;
    }
};

const checkLoginAttempts = async (user_id) => {
    try {
        const query = `CALL checkLoginAttempts(?)`;
        const result = await db.query(query, [user_id]);
        console.log('login attempts: ',result[0][0][0].login_attempts);
        return result[0][0][0].login_attempts;
    } catch (error) {
        console.error('Error model check login attempts: ', error);
        throw error;
    }
};

const getRemainingTime = async (user_id) => {
    try {
        const query = `CALL getRemainingTime(?)`;
        const result = await db.query(query, [user_id]);
        console.log('remaining time: ',result[0][0][0].remainingTime);
        return result[0][0][0].remainingTime;
    } catch (error) {
        console.error('Error model get remaining time: ', error);
        throw error;
    }
};

module.exports = {
    checkCredentials,
    checkLoginsAllowed,
    updateLoginsAllowed,
    updateLoginAttemptsAndTime,
    checkLoginAttempts,
    getRemainingTime
};