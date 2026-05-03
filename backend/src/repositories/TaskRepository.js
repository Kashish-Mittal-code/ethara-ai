const Task = require('../models/Task');

const create = (payload) => Task.create(payload);
const findAll = (query = {}) => Task.find(query).populate('assignedTo projectId').exec();
const findById = (id) => Task.findById(id).populate('assignedTo projectId').exec();
const updateById = (id, payload) => Task.findByIdAndUpdate(id, payload, { new: true }).exec();
const removeById = (id) => Task.findByIdAndDelete(id).exec();

module.exports = { create, findAll, findById, updateById, removeById };
