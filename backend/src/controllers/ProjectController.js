const ProjectService = require('../services/ProjectService');

const create = async (req, res, next) => {
  try {
    const payload = { ...req.body, createdBy: req.user.sub };
    const project = await ProjectService.createProject(payload);
    res.json({ success: true, message: 'Project created', data: project });
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const projects = await ProjectService.listProjects();
    res.json({ success: true, message: 'Projects retrieved', data: projects });
  } catch (err) {
    next(err);
  }
};

const get = async (req, res, next) => {
  try {
    const project = await ProjectService.getProject(req.params.id);
    res.json({ success: true, message: 'Project retrieved', data: project });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const project = await ProjectService.updateProject(req.params.id, req.body);
    res.json({ success: true, message: 'Project updated', data: project });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await ProjectService.deleteProject(req.params.id);
    res.json({ success: true, message: 'Project deleted', data: {} });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, list, get, update, remove };
