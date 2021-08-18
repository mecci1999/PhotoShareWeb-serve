import express from 'express';
import * as likeMiddleware from './like.middleware';
import * as likeController from './like.controller';
import { authGuard } from '../auth/auth.middleware';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 用户点赞内容
 */
router.post(
  '/posts/:postId/like',
  authGuard,
  accessLog({
    action: 'createUserLikePost',
    resourceType: 'post',
    resourceParamName: 'postId',
  }),
  likeController.storeUserLikePosr,
);

/**
 * 取消用户点赞
 */
router.delete(
  '/posts/:postId/like',
  authGuard,
  accessLog({
    action: 'deleteUserLikePost',
    resourceType: 'post',
    resourceParamName: 'postId',
  }),
  likeController.destroyUserLikePost,
);

/**
 * 导出默认接口
 */
export default router;
