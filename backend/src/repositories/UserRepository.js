const User = require('../models/User');

const createUser = (payload) => User.create(payload);
const findByEmail = (email) => User.findOne({ email }).exec();
const findById = (id) => User.findById(id).exec();

module.exports = { createUser, findByEmail, findById };
