import express from 'express';
import { accessLog } from '../access-log/access-log.middleware';
import { authGuard, validManagerGuard } from '../auth/auth.middleware';
import * as userController from './user.controller';
import {
  validataUserData,
  hashPassword,
  validateUpdateUserData,
} from './user.middleware';
import { paginate } from '../post/post.middleware';
import { USERS_PER_PAGE } from '../app/app.config';

const router = express.Router();

/**
 * 创建用户
 */
router.post(
  '/users',
  validataUserData,
  hashPassword,
  accessLog({
    action: 'createUser',
    resourceType: 'user',
    payloadParam: 'body.name',
  }),
  userController.store,
);

/**
 * 更新用户信息
 */
router.patch(
  '/users',
  authGuard,
  validateUpdateUserData,
  accessLog({
    action: 'updateUser',
    resourceType: 'user',
    payloadParam: 'body.update.name',
  }),
  userController.update,
);

/**
 * 用户账户
 */
router.get(
  '/users/:userId',
  accessLog({
    action: 'getUserById',
    resourceType: 'user',
    resourceParamName: 'userId',
  }),
  userController.show,
);

/**
 * 用户信息列表
 */
router.get('/users', authGuard, paginate(USERS_PER_PAGE), userController.index);

/**
 * 改变用户状态
 */
router.patch(
  '/users/:userId',
  authGuard,
  validManagerGuard,
  userController.updateUserStatus,
);

export default router;
