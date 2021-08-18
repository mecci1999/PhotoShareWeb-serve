import express from 'express';
import * as dashBoardController from './dashboard.controller';
import { accessCountFilter } from './dashboard.middleware';

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
 * 默认导出
 */
export default router;
