const TaskService = require('../services/TaskService');

const create = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const task = await TaskService.createTask(payload);
    res.json({ success: true, message: 'Task created', data: task });
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const tasks = await TaskService.listTasks(req.query);
    res.json({ success: true, message: 'Tasks retrieved', data: tasks });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const task = await TaskService.updateTask(req.params.id, req.body);
    res.json({ success: true, message: 'Task updated', data: task });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await TaskService.deleteTask(req.params.id);
    res.json({ success: true, message: 'Task deleted', data: {} });
  } catch (err) {
    next(err);
  }
};

const dashboard = async (req, res, next) => {
  try {
    const stats = await TaskService.dashboardStats(req.query.projectId);
    res.json({ success: true, message: 'Dashboard stats', data: stats });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, list, update, remove, dashboard };
