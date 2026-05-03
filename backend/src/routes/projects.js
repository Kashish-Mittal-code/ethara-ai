const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/ProjectController');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.use(authenticate);
router.post('/', authorizeRole('admin'), ProjectController.create);
router.get('/', ProjectController.list);
router.get('/:id', ProjectController.get);
router.put('/:id', authorizeRole('admin'), ProjectController.update);
router.delete('/:id', authorizeRole('admin'), ProjectController.remove);

module.exports = router;
