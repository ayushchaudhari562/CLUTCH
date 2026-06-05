// backend/src/routes/feed.js
const express = require('express');
const router = express.Router();
const { createPost,getAllPosts } = require('../controllers/multercon');
const upload = require('../services/multer');

// Use upload.single('image') where 'image' is 
// the name of the form field sent from the frontend
router.post('/create', upload.single('image'), createPost);
router.get('/all')

module.exports = router;
