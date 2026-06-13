const express = require('express');
const { addComment, getPostComments, editComment } = require('../controllers/CommentlogicAPI');

const router = express.Router();

router.post('/', addComment);
router.get('/:postId', getPostComments);
router.put('/:id', editComment);

module.exports = router;
