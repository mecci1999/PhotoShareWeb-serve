import express from 'express';
import postRouter from '../post/post.router';
/**
 * 创建应用
 */
const app = express();

/**
 * 可以处理 JSON 文件
 */
app.use(express.json());

/**
 *路由 
 */
app.use(postRouter);

/**
 * 最后默认导出应用
 */
export default app;
