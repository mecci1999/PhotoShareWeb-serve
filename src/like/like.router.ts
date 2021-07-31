import express from 'express';
import * as likeMiddleware from './like.middleware';
import * as likeController from './like.controller';
import { authGuard } from '../auth/auth.middleware';

const router = express.Router();

/**
 * 用户点赞内容
 */
router.post('/posts/:postId/like', authGuard, likeController.storeUserLikePosr);

/**
 * 导出默认接口
 */
export default router;