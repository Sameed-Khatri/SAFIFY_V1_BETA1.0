const { Router } = require('express');
const router = Router();
const authenticate = require('../middlewares/authenticateToken');
const searchForumController = require('../controllers/solutionForumController');

router.get('/fetchAllSolutions', authenticate.authenticateToken, searchForumController.fetchAllSolutions);

module.exports = router;
