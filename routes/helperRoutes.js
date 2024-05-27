const { Router } = require('express');
const router = Router();
const helperController = require('../controllers/helperController');

router.get('/hashPasswords', helperController.updatePasswords);

module.exports = router;
