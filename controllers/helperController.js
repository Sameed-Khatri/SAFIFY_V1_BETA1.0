const passwordHashDB = require('../Helper/hashPasswordsDB');

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

module.exports = {
    updatePasswords
};