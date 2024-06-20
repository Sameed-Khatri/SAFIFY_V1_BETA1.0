const db = require('../config/database');

const checkCredentials = async (user_id) => {
    try {
        //console.log(user_id,user_pass);
        const query = `CALL CheckCredentials(?)`;
        const result = await db.query(query,[user_id]);
        //console.log('result model:',result[0][0]);
        return result[0];
    } catch (error) {
        console.error('Error model checking credentials: ', error);
        throw error;
    }
};

const checkLoginsAllowed = async (user_id) => {
    try {
        const query = `CALL checkLoginsAllowed(?)`;
        const result = await db.query(query, [user_id]);
        // console.log("result:",result);
        // console.log("result[0]:",result[0]);
        // console.log("result[0][0]:",result[0][0]);
        // console.log("result[0][0][0]:",result[0][0][0]);
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

module.exports = {
    checkCredentials,
    checkLoginsAllowed,
    updateLoginsAllowed
};