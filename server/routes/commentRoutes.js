const express = require('express')
const router = express.Router()
const { verifyAuth } = require('../middleware/verifyAuth')
const { getComments, createComment, editComment, deleteComment } = require('../controllers/commentControllers')

router.get('/', getComments)

router.post('/', verifyAuth, createComment)

router.patch('/:id', verifyAuth, editComment)

router.delete('/:id', verifyAuth, deleteComment)

module.exports = router