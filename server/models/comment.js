const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true
  },
  userName: {
    type: String,
    default: 'unknown'
  },
  userAvatar: {
    type: String,
    default: '/default-avatar'
  },
  replyTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'comment'
  },
  replies: {
    type: [mongoose.Schema.ObjectId],
    ref: 'comment'
  }
}, { timestamps: true })

module.exports = mongoose.model('Comment', CommentSchema)