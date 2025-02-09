const loginService = require('../services/loginService');

const checkCredentials = async (req, res) => {
    try {
        if (
            [req.body.user_id, req.body.user_pass].some(
                (value) => value == null || value.trim() === '' || value === undefined || value === '-'
            )
        ) {
            return res.status(400).json({ status: 'Bad Request', message: 'Incorrect field values' });
        };

        const user_id = req.body.user_id;
        const user_pass = req.body.user_pass;
        const device_token = req.body.device_token;
        console.log(user_id,user_pass, device_token);

        const token = await loginService.checkCredentials(user_id,user_pass,device_token);
        const result = await loginService.updateLoginsAllowed(user_id,0);
        console.log(result);

        return res.status(200).json({ status: 'Login successful', token});
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        if (
            [req.body.user_id].some(
                (value) => value == null || value.trim() === '' || value === undefined || value === '-'
            )
        ) {
            return res.status(400).json({ status: 'Bad Request', message: 'Incorrect field values' });
        };

        const user_id = req.body.user_id;
        
        const loginsAllowed = await loginService.updateLoginsAllowed(user_id,1);
        console.log(loginsAllowed);

        return res.status(200).json({ status: 'Logout successful'});
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

module.exports = {
    checkCredentials,
    logout
};