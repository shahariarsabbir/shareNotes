const Note = require('../models/Note');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// @desc    Upload a note
// @route   POST /api/notes/upload
// @access  Private
const uploadNote = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { title, description, subject, semester, tags } = req.body;

    const tagsArray = tags
      ? tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
      : [];

    const note = await Note.create({
      title,
      description,
      subject,
      semester,
      tags: tagsArray,
      fileUrl: req.file.path,
      filePublicId: req.file.filename,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
    });

    // Update user's note count
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalNotes: 1 } });

    await note.populate('uploadedBy', 'name email avatar university department');

    res.status(201).json({ success: true, message: 'Note uploaded successfully', note });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all notes (with search & filter)
// @route   GET /api/notes
// @access  Public
const getNotes = async (req, res, next) => {
  try {
    const { search, subject, semester, sort = '-createdAt', page = 1, limit = 12 } = req.query;

    const query = { isPublic: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (semester) query.semester = semester;

    const skip = (Number(page) - 1) * Number(limit);

    const [notes, total] = await Promise.all([
      Note.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate('uploadedBy', 'name avatar university department'),
      Note.countDocuments(query),
    ]);

    res.json({
      success: true,
      notes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id).populate(
      'uploadedBy',
      'name email avatar university department bio'
    );

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Increment view count
    note.views += 1;
    await note.save();

    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this note' });
    }

    // Delete from Cloudinary
    if (note.filePublicId) {
      await cloudinary.uploader.destroy(note.filePublicId, { resource_type: 'auto' });
    }

    await note.deleteOne();
    await User.findByIdAndUpdate(note.uploadedBy, { $inc: { totalNotes: -1 } });

    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Like / Unlike a note
// @route   PUT /api/notes/:id/like
// @access  Private
const toggleLike = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const userId = req.user._id;
    const alreadyLiked = note.likes.includes(userId);

    if (alreadyLiked) {
      note.likes = note.likes.filter((id) => id.toString() !== userId.toString());
      note.likesCount = Math.max(0, note.likesCount - 1);
      await User.findByIdAndUpdate(note.uploadedBy, { $inc: { totalLikesReceived: -1 } });
    } else {
      note.likes.push(userId);
      note.likesCount += 1;
      await User.findByIdAndUpdate(note.uploadedBy, { $inc: { totalLikesReceived: 1 } });
    }

    await note.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: note.likesCount,
      message: alreadyLiked ? 'Note unliked' : 'Note liked',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate a note
// @route   POST /api/notes/:id/rate
// @access  Private
const rateNote = async (req, res, next) => {
  try {
    const { value } = req.body;

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const existingRating = note.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      note.rating.total -= existingRating.value;
      existingRating.value = value;
    } else {
      note.ratings.push({ user: req.user._id, value });
      note.rating.count += 1;
    }

    note.rating.total = note.ratings.reduce((sum, r) => sum + r.value, 0);
    note.rating.count = note.ratings.length;
    note.rating.average = note.rating.total / note.rating.count;

    await note.save();

    res.json({
      success: true,
      message: 'Rating submitted',
      rating: note.rating,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment download count
// @route   PUT /api/notes/:id/download
// @access  Public
const incrementDownload = async (req, res, next) => {
  try {
    await Note.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
    res.json({ success: true, message: 'Download recorded' });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadNote, getNotes, getNoteById, deleteNote, toggleLike, rateNote, incrementDownload };
