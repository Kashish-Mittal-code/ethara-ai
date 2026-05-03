const AuthService = require('../services/AuthService');
const { signupSchema, loginSchema } = require('../validations/auth');

const signup = async (req, res, next) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) return next({ status: 400, message: error.message });
    const user = await AuthService.signup(value);
    res.json({ success: true, message: 'User created', data: user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    // Allow admin backdoor before strict validation (admin email may be non-standard)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@taskflow.local';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'AdminPass123!';
    if (req.body.email === ADMIN_EMAIL && req.body.password === ADMIN_PASS) {
      const { token, user } = await AuthService.login({ email: req.body.email, password: req.body.password });
      return res.json({ success: true, message: 'Logged in', data: { token, user } });
    }
    const { error, value } = loginSchema.validate(req.body);
    if (error) return next({ status: 400, message: error.message });
    const { token, user } = await AuthService.login(value);
    res.json({ success: true, message: 'Logged in', data: { token, user } });
  } catch (err) {
    next(err);
  }
};

// Google login removed

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return next({ status: 400, message: 'Missing token' });
    const user = await AuthService.verifyEmailToken(token);
    // Redirect to frontend login with success flag
    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?verified=1`;
    res.redirect(redirectUrl);
  } catch (err) {
    next(err);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next({ status: 400, message: 'Missing email' });
    await AuthService.resendVerification(email);
    res.json({ success: true, message: 'Verification sent' });
  } catch (err) {
    next(err);
  }
};

// linkGoogle removed

const me = async (req, res, next) => {
  try {
    const u = await AuthService.getUserById(req.user.sub);
    if (!u) return next({ status: 404, message: 'User not found' });
    res.json({ success: true, data: { id: u._id, name: u.name, email: u.email, role: u.role, authProvider: u.authProvider, googleId: u.googleId, emailVerified: u.emailVerified } });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return next({ status: 400, message: 'Name is required' });
    const u = await AuthService.updateProfile(req.user.sub, { name: name.trim() });
    if (!u) return next({ status: 404, message: 'User not found' });
    res.json({ success: true, data: { id: u._id, name: u.name, email: u.email, role: u.role, authProvider: u.authProvider, googleId: u.googleId, emailVerified: u.emailVerified } });
  } catch (err) {
    next(err);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const users = await User.find({}, 'name email role emailVerified').lean();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, verifyEmail, resendVerification, me, updateProfile, listUsers };
