import express from 'express';
import { accessLog } from '../access-log/access-log.middleware';
import { authGuard } from '../auth/auth.middleware';
import * as fileController from './file.controller';
import {
  fileDownloadGuard,
  fileInterceptor,
  fileProcessor,
} from './file.middleware';

const router = express.Router();

/**
 * 上传文件
 */
router.post(
  '/files',
  authGuard,
  fileInterceptor,
  fileProcessor,
  accessLog({
    action: 'createFile',
    resourceType: 'file',
  }),
  fileController.store,
);

/**
 * 文件服务
 */
router.get('/files/:fileId/serve', fileController.serve);

/**
 * 文件信息接口
 */
router.get(
  '/files/:fileId/metadata',
  accessLog({
    action: 'getFileMetadata',
    resourceType: 'file',
    resourceParamName: 'fileId',
  }),
  fileController.metadata,
);

/**
 * 文件下载
 */
router.get(
  '/files/:fileId/download',
  fileDownloadGuard,
  fileController.fileDownload,
);

/**
 * 导出路由
 */
export default router;
