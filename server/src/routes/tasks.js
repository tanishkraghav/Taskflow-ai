const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  updateTaskPriority,
  reprioritizeTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Protect all routes in this router
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/complete', toggleTaskCompletion);
router.patch('/:id/priority', updateTaskPriority);
router.post('/:id/reprioritize', reprioritizeTask);

module.exports = router;
