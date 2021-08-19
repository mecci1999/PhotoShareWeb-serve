import express from 'express';
import * as dashBoardController from './dashboard.controller';
import { accessCountFilter, accessCountsGuard } from './dashboard.middleware';

/**
 * 定义路由
 */
const router = express.Router();

/**
 * 访问次数列表
 */
router.get(
  '/dashboard/access-counts',
  accessCountFilter,
  dashBoardController.accessCountIndex,
);

/**
 * 按动作分时段的访问次数
 */
router.get(
  '/dashboard/access-counts/:action',
  accessCountsGuard,
  accessCountFilter,
  dashBoardController.accessCountShow,
);

/**
 * 默认导出
 */
export default router;
