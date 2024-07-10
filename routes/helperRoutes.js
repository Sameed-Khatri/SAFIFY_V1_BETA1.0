const { Router } = require('express');
const router = Router();
const helperController = require('../controllers/helperController');
const authenticate = require('../middlewares/authenticateToken');

const rolesCombo = ['admin','user']

router.get('/hashPasswords', helperController.updatePasswords);
router.put('/revertPushNotification/:userid', helperController.revertPushNotification);
router.post('/sendDummyNotification', helperController.sendDummyNotification);
router.get('/getLocationsAndSubLocations', authenticate.authenticateToken, authenticate.authorizeRoles(...rolesCombo), helperController.getLocationsAndSubLocations);
router.get('/getIncidentTypesAndIncidentSubTypes', authenticate.authenticateToken, authenticate.authorizeRoles(...rolesCombo), helperController.getIncidetTypesAndIncidentSubTypes);


module.exports = router;
