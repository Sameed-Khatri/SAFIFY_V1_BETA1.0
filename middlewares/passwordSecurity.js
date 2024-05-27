const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
    }
};

const verifyPassword = async (password, hashPassword) => {
    try {
        const ismatch = await bcrypt.compare(password, hashPassword);
        return ismatch;
    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
};

module.exports = {
    hashPassword,
    verifyPassword
};