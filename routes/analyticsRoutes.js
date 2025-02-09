const { Router } = require('express');
const router = Router();
const analyticsController = require('../controllers/analyticsController');
const authenticate = require('../middlewares/authenticateToken');

const role = 'admin';

router.get('/fetchIncidentsReported', authenticate.authenticateToken, authenticate.authorizeRoles(role), analyticsController.fetchIncidentsReported);
router.get('/fetchIncidentsResolved', authenticate.authenticateToken, authenticate.authorizeRoles(role), analyticsController.fetchIncidentsResolved);
router.get('/fetchTotalIncidentsOnTypes', authenticate.authenticateToken, authenticate.authorizeRoles(role), analyticsController.fetchTotalIncidentsOnTypes);
router.get('/fetchTotalIncidentsOnSubTypes', authenticate.authenticateToken, authenticate.authorizeRoles(role), analyticsController.fetchTotalIncidentsOnSubTypes);
router.get('/fetchTotalIncidentsOnLocations', authenticate.authenticateToken, authenticate.authorizeRoles(role), analyticsController.fetchTotalIncidentsOnLocations);
router.get('/fetchEfficiency', authenticate.authenticateToken, authenticate.authorizeRoles(role), analyticsController.fetchEfficiency);
router.get('/fetchAllAnalytics', authenticate.authenticateToken, authenticate.authorizeRoles(role), analyticsController.fetchAllAnalytics);
router.get('/fetchUserMetrics', authenticate.authenticateToken, authenticate.authorizeRoles(role), analyticsController.fetchUserMetrics);

module.exports = router;