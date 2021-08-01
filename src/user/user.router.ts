import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as userController from './user.controller'; 
import { validataUserData, hashPassword, validateUpdateUserData } from './user.middleware';

const router = express.Router();

/**
 * 创建用户
 */
router.post('/users', validataUserData, hashPassword, userController.store);

/**
 * 更新用户信息
 */
router.patch('/users', authGuard, validateUpdateUserData, userController.update);

/**
 * 用户账户
 */
router.get('/users/:userId',userController.show);

export default router;