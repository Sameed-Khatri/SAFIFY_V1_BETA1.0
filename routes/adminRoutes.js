const { Router } = require('express');
const router = Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/authenticateToken');
const pdfController = require('../controllers/pdfController');

const role = 'admin';

router.get('/dashboard/fetchAllUserReports', authenticate.authenticateToken, authenticate.authorizeRoles(role), adminController.fetchAllUserReports);
router.get('/dashboard/fetchAllActionReports', authenticate.authenticateToken, authenticate.authorizeRoles(role), adminController.fetchAllActionReports);
router.get('/dashboard/fetchDepartments', authenticate.authenticateToken, authenticate.authorizeRoles(role), adminController.fetchAllDepartments);
router.get('/dashboard/fetchActionTeams', authenticate.authenticateToken, authenticate.authorizeRoles(role), adminController.fetchAllActionTeams);
router.post('/dashboard/insertAssignTask', authenticate.authenticateToken, authenticate.authorizeRoles(role), adminController.InsertAssignTask);
router.delete('/dashboard/deleteUserReport/:user_report_id', authenticate.authenticateToken, authenticate.authorizeRoles(role), adminController.DeleteUserReport);
router.delete('/dashboard/deleteActionReport/:action_report_id', authenticate.authenticateToken, authenticate.authorizeRoles(role), adminController.DeleteActionReport);
router.post('/dashboard/approvedActionReport', authenticate.authenticateToken, authenticate.authorizeRoles(role), adminController.ApproveActionReport);
router.post('/dashboard/createUser', authenticate.authenticateToken, authenticate.authorizeRoles(role), adminController.createUser);
router.get('/dashboard/generateUserReportPDF', authenticate.authenticateToken, authenticate.authorizeRoles(role), pdfController.generatePdfReport);
// router.get('/dashboard/generateActionReportPDF', authenticate.authenticateToken, authenticate.authorizeRoles(role), pdfController.generateActionReportPdf);
router.get('/dashboard/fetchAllActionTeamsWithDepartments', authenticate.authenticateToken, authenticate.authorizeRoles(role), adminController.fetchAllActionTeamsWithDepartments);

module.exports = router;