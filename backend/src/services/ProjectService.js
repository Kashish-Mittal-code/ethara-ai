const projectRepo = require('../repositories/ProjectRepository');

const createProject = async ({ title, description, createdBy }) => {
  return projectRepo.create({ title, description, createdBy, members: [createdBy] });
};

const listProjects = async (filter = {}) => projectRepo.findAll(filter);

const getProject = async (id) => projectRepo.findById(id);

const updateProject = async (id, payload) => projectRepo.updateById(id, payload);

const deleteProject = async (id) => projectRepo.removeById(id);

module.exports = { createProject, listProjects, getProject, updateProject, deleteProject };
