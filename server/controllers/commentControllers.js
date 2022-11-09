const Comment = require('../models/comment')
const User = require('../models/user')
const mongoose = require('mongoose')

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({}).sort({ createdAt: 1 })

    res.status(200).json(comments)
  } catch (error) {
    res.status(500).json({ error: "Something went wrong, try to refersh the page." })
  }
}

const createComment = async (req, res) => {
  req.body.user_id = req.user._id
  req.body.userName = req.user.name
  req.body.userAvatar = req.user.avatar

  try {
    const comment = await Comment.create(req.body)
    const user = await User.findOne({ _id: req.body.user })
    res.status(201).json({ comment, user })
  } catch (error) {
    res.status(409).json({ error: "Failed to send the comment, please try again later." })
    console.log(error)
  }
}

const editComment = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: 'Failed to find the comment to edit, please try again later.' })
  }

  try {
    const comment = await Comment.findOne({ _id: req.params.id })

    if (!comment) {
      return res.status(404).json({ error: 'Failed to find the comment to edit, please try again later.' })
    }

    comment.text = req.body.text
    await comment.save()

    res.status(200).json({ comment })
  } catch (error) {
    res.status(409).json({ error: 'Failed to update, please try again later.' })
  }
}

const deleteComment = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: 'Failed to find the comment to delete, please try again later.' })
  }

  try {
    const comment = await Comment.findOne({ _id: req.params.id })

    if (!comment) {
      return res.status(404).json({ error: 'Failed to find the comment to delete, please try again later.' })
    }

    await comment.remove()
    res.status(200).json({ message: 'Comment has been deleted.' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to delete, please try again later.' })
  }
}

module.exports = { getComments, createComment, editComment, deleteComment }