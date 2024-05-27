const db = require('../config/database');
const passwordSecurity = require('../middlewares/passwordSecurity');

const updatePasswords = async () => {
    try {
        const query = 'SELECT user_id, user_pass FROM users';
        const users = await db.query(query);
        console.log(users[0]);
        for (const user of users[0]) {
            const hashedPassword = await passwordSecurity.hashPassword(user.user_pass);
            await db.query('UPDATE users SET user_pass = ? WHERE user_id = ?', [hashedPassword, user.user_id]);
            console.log(user.user_id, user.user_pass);
            console.log(`Updated password for user_id: ${user.user_id}, ${hashedPassword}`);
            console.log();
        }
        console.log('All passwords updated successfully.');
        return true;
    } catch (error) {
        console.error('Failed to update passwords:', error);
        return false;
    }
};

module.exports = {
    updatePasswords
};