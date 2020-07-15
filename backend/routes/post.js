const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer')

const postController = require('../controllers/post')

router.get('/posts', auth, postController.getAllPosts)
router.get('/post/:id', auth, postController.getOnePost)
// router.get('/posts/me', auth, postController.getAllUserPosts)
router.post('/post', auth, multer, postController.createPost)
router.put('/post/:id', auth, multer, postController.updatePost)
router.delete('/post/:id', auth, multer,  postController.deletePost)
// router.post('/post/:id/like', auth, postController.likeOrDislikePost)

module.exports = router;