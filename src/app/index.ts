import express from 'express';

/**
 * 创建应用
 */
const app = express();

/**
 * 可以处理 JSON 文件
 */
app.use(express.json());

/**
 * 最后默认导出应用
 */
export default app;