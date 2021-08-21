import dotenv from 'dotenv';

dotenv.config();

/**
 * 应用配置
 */
export const { APP_PORT } = process.env;

/**
 * 数据仓库配置
 */
export const {
  MYSQL_HOST,
  MYSQL_PORT = '3306',
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

/**
 * 密钥和公钥配置
 */
export let { PRIVATE_KEY, PUBLIC_KEY } = process.env;
PRIVATE_KEY = Buffer.from(`${PRIVATE_KEY}`, 'base64').toString();
PUBLIC_KEY = Buffer.from(`${PUBLIC_KEY}`, 'base64').toString();

/**
 * 内容分页
 */
export const POSTS_PRE_PAGE = parseInt(`${process.env['POSTS_PRE_PAGE']}`, 10);

/**
 * 评论分页
 */
export const COMMENTS_PRE_PAGE = parseInt(
  `${process.env['COMMENTS_PRE_PAGE']}`,
  10,
);

/**
 * 跨域资源共享
 */
export const ALLOW_ORIGIN = process.env['ALLOW_ORIGIN'];

/**
 * 微信登录: 网站应用
 */
export const {
  WEIXIN_API_BASE_URL,
  WEIXIN_WEBSITE_APP_ID,
  WEIXIN_WEBSITE_APP_SECRET,
} = process.env;

/**
 * 许可
 */
export const LICENSE_PER_PAGE = parseInt(process.env['LICENSE_PER_PAGE'], 10);
