const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const commentController = require('../controllers/comment')

router.get('/post/:id/comments', auth, commentController.getAllComments)
router.post('/post/:id/comment', auth, commentController.createComment)
router.delete('/post/:id/comment', auth, commentController.deleteComment)

module.exports = router;