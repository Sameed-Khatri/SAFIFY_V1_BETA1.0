const db = require('../config/database');

const checkCredentials = async (user_id) => {
    try {
        //console.log(user_id,user_pass);
        const query = `CALL CheckCredentials(?)`;
        const result = await db.query(query,[user_id]);
        //console.log('result model:',result);
        return result[0];
    } catch (error) {
        console.error('Error model checking credentials: ', error);
        throw error;
    }
};

module.exports = {
    checkCredentials
};