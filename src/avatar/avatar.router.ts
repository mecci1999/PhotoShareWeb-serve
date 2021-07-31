import express, { Router } from 'express';
import * as avatarMiddleware from './avatar.middleware';
import * as avatarController from './avatar.controller';
import { authGuard } from '../auth/auth.middleware';

const router = express.Router();

/**
 * 上传头像文件
 */
router.post('/avatar',
authGuard,
avatarMiddleware.avatarInterceptor,
avatarMiddleware.avatarProcessor,
avatarController.store);

/**
 * 头像服务
 */
router.get('/users/:userId/avatar', avatarController.serve);

/**
 * 默认导出接口
 */
export default router;