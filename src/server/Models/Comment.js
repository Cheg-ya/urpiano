const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CommentSchema = new Schema({
  postedBy: {
    type: ObjectId,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = Comment = mongoose.model('Comment', CommentSchema);
