import express from 'express';
import cors from 'cors';
import postRouter from '../post/post.router';
import userRouter from '../user/user.router';
import authRouter from '../auth/auth.router';
import fileRouter from '../file/file.router';
import tagRouter from '../tag/tag.router';
import commentRouter from '../comment/comment.router';
import avatarRouter from '../avatar/avatar.router';
import likeRouter from '../like/like.router';
import appRouter from './app.router';
import searchRouter from '../search/search.router';
import auditLogRouter from '../audit-log/audit-log.router';
import dashBoardRouter from '../dashboard/dashboard.router';
import productRouter from '../product/product.router';
import paymentRouter from '../payment/payment.router';
import orderRouter from '../order/order.router';
import licenseRouter from '../license/license.router';
import subscriptionRouter from '../subscription/subscription.router';
import downloadRouter from '../download/download.router';
import { defaultErrorHandler } from './app.middleware';
import { currentUser } from '../auth/auth.middleware';
import { ALLOW_ORIGIN } from './app.config';

/**
 * 创建应用
 */
const app = express();

/**
 * 跨域资源共享
 */
app.use(
  cors({
    origin: ALLOW_ORIGIN,
    exposedHeaders: 'X-Total-Count',
  }),
);

/**
 * 可以处理 JSON 文件
 */
app.use(express.json());

/**
 * 当前用户
 */
app.use(currentUser);

/**
 * 应用路由
 */
app.use(
  postRouter,
  userRouter,
  authRouter,
  fileRouter,
  tagRouter,
  commentRouter,
  avatarRouter,
  likeRouter,
  appRouter,
  searchRouter,
  auditLogRouter,
  dashBoardRouter,
  productRouter,
  paymentRouter,
  orderRouter,
  licenseRouter,
  subscriptionRouter,
  downloadRouter,
);

/**
 * 使用异常处理器
 */
app.use(defaultErrorHandler);

/**
 * 最后默认导出应用
 */
export default app;
