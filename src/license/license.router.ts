import express from 'express';
import { accessLog } from '../access-log/access-log.middleware';
import { LICENSE_PER_PAGE } from '../app/app.config';
import { authGuard } from '../auth/auth.middleware';
import { paginate } from '../post/post.middleware';
import * as licenseController from './license.controller';

const router = express.Router();

/**
 * 用户有效许可
 */
router.get('/valid-license', authGuard, licenseController.ValidLisence);

/**
 * 许可证列表
 */
router.get(
  '/licenses',
  authGuard,
  paginate(LICENSE_PER_PAGE),
  accessLog({ action: 'getLicenses', resourceType: 'license' }),
  licenseController.index,
);

/**
 * 默认导出
 */
export default router;
