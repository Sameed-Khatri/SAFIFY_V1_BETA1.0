const loginService = require('../services/loginService');

const checkCredentials = async (req, res) => {
    try {
        const user_id=req.body.user_id;
        const user_pass=req.body.user_pass; 
        console.log(user_id,user_pass);
        const token = await loginService.checkCredentials(user_id,user_pass);
        return res.status(200).json({ status: 'Login successful', token});
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

module.exports = {
    checkCredentials
};