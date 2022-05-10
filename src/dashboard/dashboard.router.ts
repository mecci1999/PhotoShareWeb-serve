import express from 'express';
import * as dashBoardController from './dashboard.controller';
import { validManagerGuard } from '../auth/auth.middleware';
import {
  accessCountFilter,
  accessCountsGuard,
  orderDateFilter,
} from './dashboard.middleware';

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
 * 管理员接口新增动作数据
 */
router.get(
  '/dashboard/admin/access-counts',
  validManagerGuard,
  accessCountFilter,
  dashBoardController.accessCountIndexAdmin,
);

/**
 * 管理员获取新增收益和总收益接口
 */
router.get(
  '/dashboard/admin/income',
  validManagerGuard,
  orderDateFilter,
  dashBoardController.getOrderData,
);

/**
 * 默认导出
 */
export default router;
