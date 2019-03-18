const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const PostSchema = new Schema({
  postedBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  record: '',
  description: {
    type: String,
    default: ''
  },
  players: [
    {
      type: ObjectId,
      ref: 'User',
      required: true,
      default: []
    }
  ],
  like: [
    {
      type: ObjectId,
      ref: 'User',
      default: []
    }
  ],
  comments: [
    {
      type: ObjectId,
      ref: 'Comment',
      default: []
    }
  ]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = Post = mongoose.model('Post', PostSchema);
