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
 * 默认导出
 */
export default router;
