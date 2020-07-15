const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer');

const auth = require('../middleware/auth');

const userController = require('../controllers/user');

router.post('/api/auth/signup', multer, userController.signup);
router.post('/api/auth/login', userController.login);
router.get('/user/me', auth, userController.getProfile);
router.delete('/user/me', auth, multer, userController.deleteProfile);
router.put('/user/me', auth, multer,  userController.updateProfile);

module.exports = router;