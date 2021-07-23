import express from 'express';
import * as userController from './user.controller'; 
import { validataUserData } from './user.middleware';

const router = express.Router();

/**
 * 创建用户
 */
router.post('/users', validataUserData, userController.store);

export default router;