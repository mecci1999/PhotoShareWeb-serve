import express from 'express';
import * as searchController from './search.controller';

/**
 * 定义路由
 */
const router = express.Router();

/**
 * 搜索标签
 */
router.get('/search/tags', searchController.tags);

/**
 * 搜索用户
 */
router.get('/search/users', searchController.users);

/**
 * 默认导出
 */
export default router;
