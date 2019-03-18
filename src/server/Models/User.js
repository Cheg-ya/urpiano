const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  profile_image: {
    type: String,
    default: './public/default_profile.png'
  },
  user_posts: [
    {
      type: ObjectId,
      ref: 'Post',
      default: []
    }
  ],
  friends: [
    {
      type: ObjectId,
      ref: 'User',
      default: []
    }
  ],
  user_comments: [
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

module.exports = User = mongoose.model('User', UserSchema);
