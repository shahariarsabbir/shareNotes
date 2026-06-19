const express = require('express');
const router = express.Router();
const { getUserById, getUserNotes, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', getUserById);
router.get('/:id/notes', getUserNotes);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;
