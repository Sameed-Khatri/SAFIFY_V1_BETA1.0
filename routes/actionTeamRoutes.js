const { Router } = require('express');
const router = Router();
const actionTeamController = require('../controllers/actionTeamController');
const authenticate = require('../middlewares/authenticateToken');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() }).fields([
    { name: 'surrounding_image', maxCount: 1 },
    { name: 'proof_image', maxCount: 1 }
]);

const role = 'action_team';

//router.post('/dashboard/:userid/MakeActionReport', upload, authenticate.authenticateToken, authenticate.authorizeRoles(role),actionTeamController.MakeActionReport);
router.get('/dashboard/:userid/fetchAssignedTasks', authenticate.authenticateToken, authenticate.authorizeRoles(role), actionTeamController.FetchAssignedTasks);
router.post('/dashboard/:userid/MakeActionReport', upload, authenticate.authenticateToken, authenticate.authorizeRoles(role), actionTeamController.MakeActionReport);

module.exports = router;