const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    favoriteCount: {
      type: Number,
      default: 0
    },
    favoriteBy: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
