const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { cloudinary } = require('../utils/cloudinary')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.ENV_JWT_SECRET, { expiresIn: '30d' })
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select(['name', 'avatar', 'bio'])

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: "Something went wrong, try to refersh the page." })
  }
}

const signup = async (req, res) => {
  const { name, password } = req.body

  try {
    const user = await User.signup(name, password)
    const token = createToken(user._id)

    res.status(200).json({ user, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const login = async (req, res) => {
  const { name, password } = req.body

  try {
    const user = await User.login(name, password)
    const token = createToken(user._id)

    res.status(200).json({ user, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const editProfile = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: 'Something went wrong, try to refresh the page.' })
  }

  const pass = req.body.password
  let user;

  if (pass) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(pass, salt)

    user = await User.findOneAndUpdate({
      _id: req.params.id
    }, { ...req.body, password: hash }, { returnDocument: 'after' })
  }
  else {
    user = await User.findOneAndUpdate({
      _id: req.params.id
    }, { ...req.body }, { returnDocument: 'after' })
  }

  if (!user) {
    return res.status(404).json({ error: 'Something went wrong, try to refresh the page.' })
  }

  const token = createToken(user._id)

  return res.status(200).json({ user, token })
}

const uploadPhoto = async (req, res) => {
  try {
    const file = req.body.data
    const response = await cloudinary.uploader.upload(file, {
      upload_preset: 'fem_comment_section'
    })
    res.status(200).json({ url: response.url })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something went wrong, try to refresh the page.' })
  }
}

const voteComment = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id })
    const comment = await Comment.findOne({ _id: req.params.id })
    const token = createToken(user._id)

    if (req.body.like && req.body.vote > 0) {
      user.downvoted = user.downvoted.filter(downvote => downvote !== req.params.id)
      user.upvoted = [...user.upvoted, comment._id]
    }
    else if (req.body.like && req.body.vote < 0) {
      user.upvoted = user.upvoted.filter(upvote => upvote !== req.params.id)
    }
    else if (!req.body.like && req.body.vote < 0) {
      user.upvoted = user.upvoted.filter(upvote => upvote !== req.params.id)
      user.downvoted = [...user.downvoted, comment._id]
    }
    else {
      user.downvoted = user.downvoted.filter(downvote => downvote !== req.params.id)
    }

    comment.likes = comment.likes + req.body.vote

    await comment.save()
    await user.save()
    res.status(200).json({ user, token, comment })
  } catch (error) {
    res.status(409).json({ error: 'Something went wrong, please try again later.' })
  }
}

module.exports = {
  signup,
  login,
  editProfile,
  uploadPhoto,
  voteComment,
  getUsers
}