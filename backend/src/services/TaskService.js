const taskRepo = require('../repositories/TaskRepository');
const Task = require('../models/Task');

const createTask = (payload) => taskRepo.create(payload);
const listTasks = (filter = {}) => taskRepo.findAll(filter);
const getTask = (id) => taskRepo.findById(id);
const updateTask = (id, payload) => taskRepo.updateById(id, payload);
const deleteTask = (id) => taskRepo.removeById(id);

const dashboardStats = async (projectId) => {
  const match = projectId ? { projectId } : {};
  const total = await Task.countDocuments(match);
  const completed = await Task.countDocuments({ ...match, status: 'done' });
  const pending = await Task.countDocuments({ ...match, status: { $in: ['todo', 'in-progress'] } });
  const overdue = await Task.countDocuments({ ...match, dueDate: { $lt: new Date() }, status: { $ne: 'done' } });
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, overdue, completionRate };
};

module.exports = { createTask, listTasks, getTask, updateTask, deleteTask, dashboardStats };
