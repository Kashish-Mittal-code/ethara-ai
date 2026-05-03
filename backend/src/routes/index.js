const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/projects', require('./projects'));
router.use('/tasks', require('./tasks'));

module.exports = router;
