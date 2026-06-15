const express = require('express');
const { addComment, getPostComments, editComment } = require('../controllers/CommentlogicAPI');
const { toggleCommentLike } = require('../controllers/LikeController');
const router = express.Router();

router.post('/', addComment);
router.get('/:postId', getPostComments);
router.put('/:id', editComment);
router.post('/:commentId/like',toggleCommentLike)

module.exports = router;
