const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.use(authenticate);
router.post('/', authorizeRole('admin'), TaskController.create);
router.get('/', TaskController.list);
router.put('/:id', TaskController.update);
router.delete('/:id', authorizeRole('admin'), TaskController.remove);
router.get('/dashboard/stats', TaskController.dashboard);

module.exports = router;
