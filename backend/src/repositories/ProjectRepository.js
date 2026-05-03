const Project = require('../models/Project');

const create = (payload) => Project.create(payload);
const findAll = (query = {}) => Project.find(query).populate('createdBy members').exec();
const findById = (id) => Project.findById(id).populate('createdBy members').exec();
const updateById = (id, payload) => Project.findByIdAndUpdate(id, payload, { new: true }).exec();
const removeById = (id) => Project.findByIdAndDelete(id).exec();

module.exports = { create, findAll, findById, updateById, removeById };
