const { Router } = require('express');
const router = Router();
const userReportController = require('../controllers/userReportController');
const authenticate = require('../middlewares/authenticateToken');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

const role = 'user';

router.post('/dashboard/:userid/MakeReport',upload, authenticate.authenticateToken, authenticate.authorizeRoles(role), userReportController.makeUserReport);
router.get('/dashboard/:userid/reports', authenticate.authenticateToken, authenticate.authorizeRoles(role), userReportController.fetchUserReports);
router.get('/dashboard/fetchsublocations', authenticate.authenticateToken, authenticate.authorizeRoles(role), userReportController.fetchSubLocations);
router.get('/dashboard/fetchlocations', authenticate.authenticateToken, authenticate.authorizeRoles(role), userReportController.fetchLocations);
router.get('/dashboard/fetchincidentType', authenticate.authenticateToken, authenticate.authorizeRoles(role), userReportController.fetchIncidentTypes);
router.get('/dashboard/fetchincidentsubType', authenticate.authenticateToken, authenticate.authorizeRoles(role), userReportController.fetchIncidentSubTypes);

module.exports = router;