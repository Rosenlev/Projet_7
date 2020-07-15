const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const likeController = require('../controllers/like')

router.get('/post/:id/like', auth, likeController.getPostLikes)
router.post('/post/:id/like', auth, likeController.createLike)
router.delete('/post/:id/like', auth, likeController.deleteLike)

module.exports = router;