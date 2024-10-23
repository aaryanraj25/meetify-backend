const express = require('express');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, getUsers);
router.post('/', authenticate, createUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

module.exports = router;
