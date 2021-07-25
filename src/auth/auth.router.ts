import express from 'express';
import * as authController from './auth.controller';
import * as authMidderware from './auth.middleware';

const router = express.Router();

/**
 * 用户登录
 */
router.post('/login', authMidderware.validataLoginData, authController.login);

/**
 * 验证用户登录接口
 */
router.post('/auth/validata', authMidderware.authGuard, authController.validata);

/**
 * 导出路由
 */
export default router;