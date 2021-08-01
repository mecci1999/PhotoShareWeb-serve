import express from 'express';
import * as commentMiddleware from './comment.middleware';
import * as commentController from './comment.controller';
import { accessControl, authGuard } from '../auth/auth.middleware';
import { paginate } from '../post/post.middleware';
import { COMMENTS_PRE_PAGE } from '../app/app.config';

const router = express.Router();

/**
 * 发表评论
 */
router.post('/comments', authGuard, commentController.store);

/**
 * 回复评论
 */
router.post('/comments/:commentId/reply', authGuard, commentController.reply);

/**
 * 修改评论
 */
router.patch('/comments/:commentId', authGuard, accessControl({prossession: true}), commentController.update);

/**
 * 删除评论
 */
router.delete('/comments/:commentId', authGuard, accessControl({prossession: true}), commentController.destroy);

/**
 * 评论列表
 */
router.get('/comments', commentMiddleware.filter, paginate(COMMENTS_PRE_PAGE), commentController.index);

/**
 * 回复评论列表
 */
router.get('/comments/:commentId/replies', commentController.indexReplied);

/**
 * 导出默认接口
 */
export default router;