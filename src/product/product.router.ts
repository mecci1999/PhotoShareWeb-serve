import express from 'express';
import * as productController from './product.controller';

/**
 * 定义接口
 */
const router = express.Router();

/**
 * 商用许可
 */
router.get('/products/license', productController.showLicenseProduct);

/**
 * 默认导出
 */
export default router;
