const User = require('../models/User');
const Note = require('../models/Note');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notes uploaded by a specific user
// @route   GET /api/users/:id/notes
// @access  Public
const getUserNotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [notes, total] = await Promise.all([
      Note.find({ uploadedBy: req.params.id, isPublic: true })
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .populate('uploadedBy', 'name avatar university department'),
      Note.countDocuments({ uploadedBy: req.params.id, isPublic: true }),
    ]);

    res.json({
      success: true,
      notes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, university, department, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, university, department, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserById, getUserNotes, updateProfile, changePassword };
