import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as licenseController from './license.controller';

const router = express.Router();

/**
 * 用户有效许可
 */
router.get('/valid-license', authGuard, licenseController.ValidLisence);

/**
 * 默认导出
 */
export default router;
