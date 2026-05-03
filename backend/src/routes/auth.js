const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.get('/verify', AuthController.verifyEmail);
router.post('/resend-verification', AuthController.resendVerification);
router.get('/me', authenticate, AuthController.me);
router.get('/users', authenticate, authorizeRole('admin'), AuthController.listUsers);
router.put('/profile', authenticate, AuthController.updateProfile);

module.exports = router;
