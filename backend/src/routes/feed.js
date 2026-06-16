// backend/src/routes/feed.js
const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, deletePost } = require('../controllers/postController');
const upload = require('../services/multer');
const {togglePostLike} = require('../controllers/LikeController');

// Use upload.single('image') where 'image' is 
// the name of the form field sent from the frontend
router.post('/create', upload.single('image'), createPost);
router.get('/all',getAllPosts);
router.post('/post/:postId/like',togglePostLike);
router.delete('/post/:postId', deletePost);

module.exports = router;
