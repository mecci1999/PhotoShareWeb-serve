import express from 'express';
import * as commentMiddleware from './comment.middleware';
import * as commentController from './comment.controller';
import { authGuard } from '../auth/auth.middleware';

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
 * 导出默认接口
 */
export default router;