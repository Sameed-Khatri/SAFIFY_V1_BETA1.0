const { Router } = require('express');
const router = Router();
const helperController = require('../controllers/helperController');

router.get('/hashPasswords', helperController.updatePasswords);
router.put('/revertPushNotification/:userid', helperController.revertPushNotification);
router.post('/sendDummyNotification', helperController.sendDummyNotification);

module.exports = router;
