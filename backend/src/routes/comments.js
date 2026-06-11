const express = require('express');
const { addComment, getPostComments } = require('../controllers/CommentlogicAPI');

const router = express.Router();

router.post('/', addComment);
router.get('/:postId', getPostComments);

module.exports = router;
