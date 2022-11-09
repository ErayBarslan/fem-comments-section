const express = require('express')
const router = express.Router()
const { signup, login, uploadPhoto, editProfile, voteComment, getUsers } = require('../controllers/userControllers')
const { verifyAuth } = require('../middleware/verifyAuth')

router.get('/', getUsers)

router.post('/signup', signup)

router.post('/login', login)

router.post('/upload', verifyAuth, uploadPhoto)

router.patch('/:id', verifyAuth, editProfile)

router.post('/vote/:id', verifyAuth, voteComment)

module.exports = router