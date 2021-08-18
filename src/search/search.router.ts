import express from 'express';
import { accessLog } from '../access-log/access-log.middleware';
import * as searchController from './search.controller';

/**
 * 定义路由
 */
const router = express.Router();

/**
 * 搜索标签
 */
router.get(
  '/search/tags',
  accessLog({
    action: 'searchTags',
    resourceType: 'search',
    payloadParam: 'query.name',
  }),
  searchController.tags,
);

/**
 * 搜索用户
 */
router.get(
  '/search/users',
  accessLog({
    action: 'searchUsers',
    resourceType: 'search',
    payloadParam: 'query.name',
  }),
  searchController.users,
);

/**
 * 默认导出
 */
export default router;
