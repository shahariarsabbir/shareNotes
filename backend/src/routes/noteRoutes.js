const express = require('express');
const router = express.Router();
const {
  uploadNote,
  getNotes,
  getNoteById,
  deleteNote,
  toggleLike,
  rateNote,
  incrementDownload,
} = require('../controllers/noteController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { handleUpload } = require('../middleware/uploadMiddleware');
const { validateNote, handleValidationErrors } = require('../utils/validators');

router.post('/upload', protect, handleUpload, validateNote, handleValidationErrors, uploadNote);
router.get('/', optionalAuth, getNotes);
router.get('/:id', optionalAuth, getNoteById);
router.delete('/:id', protect, deleteNote);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/rate', protect, rateNote);
router.put('/:id/download', incrementDownload);

module.exports = router;
