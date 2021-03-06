import { Request, Response, NextFunction } from 'express';
import { off } from 'process';
import { AuditLogStatus } from '../audit-log/audit-log.model';
import { PostStatus } from './post.service';

/**
 * 排序方式
 */
export const sort = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //获取客户端的地址查询符
  const { sort } = request.query;

  //排序用的 SQL
  let sqlSort: string;

  //设置排序用的SQL
  switch (sort) {
    case 'earliest':
      sqlSort = 'post.id ASC';
      break;
    case 'lastest':
      sqlSort = 'post.id DESC';
      break;
    case 'mostComment':
      sqlSort = 'totalComments DESC, post.id DESC';
      break;
    default:
      sqlSort = 'post.id DESC';
      break;
  }

  //在请求中添加排序
  request.sort = sqlSort;

  //下一步
  next();
};

/**
 * 过滤列表
 */
export const filter = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //获取数据
  const { tag, user, action } = request.query;

  //默认过滤
  request.filter = {
    name: 'defualt',
    sql: 'post.id IS NOT NULL',
  };

  //按标签名进行过滤
  if (tag && !user && !action) {
    request.filter = {
      name: 'tagName',
      sql: 'tag.name = ?',
      param: `${tag}`,
    };
  }

  //过滤用户发布的内容
  if (user && action == 'published' && !tag) {
    request.filter = {
      name: 'userPublished',
      sql: 'user.id = ?',
      param: `${user}`,
    };
  }

  //过滤用户点赞过的内容
  if (user && action == 'liked' && !tag) {
    request.filter = {
      name: 'userLiked',
      sql: 'user_like_post.userId = ?',
      param: `${user}`,
    };
  }

  //下一步
  next();
};

/**
 * 内容分页
 */

export const paginate = (itemPerPage: number) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    // 准备数据
    // 当前页面
    const { page = 1 } = request.query;

    // 每页内容数量,默认30
    const limit = itemPerPage || 30;

    // 计算出偏移量
    const offset = limit * (parseInt(`${page}`, 10) - 1);

    request.pagination = { limit: limit, offset: offset };

    //下一步
    next();
  };
};

/**
 * 验证内容状态
 */
export const validatePostStatus = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { status: statusFromQuery = '' } = request.query;
  const { status: statusFromBody = '' } = request.body;

  const status = statusFromQuery || statusFromBody;

  const isValidStatus = ['published', 'draft', 'archived', ''].includes(
    `${status}`,
  );

  if (!isValidStatus) {
    next(new Error('BAD_REQUEST'));
  } else {
    next();
  }
};

/**
 * 模式切换器
 */
export const modeSwitcher = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 解构查询符
  const { manage, admin } = request.query;

  // 管理模式
  const isManageMode = manage === 'true';

  // 管理员模式
  const isAdminMode = isManageMode && admin === 'true' && request.user.id === 1;

  if (isManageMode) {
    if (isAdminMode) {
      request.filter = {
        name: 'adminManagePosts',
        sql: 'post.id IS NOT NULL',
        param: '',
      };
    } else {
      request.filter = {
        name: 'userManagePosts',
        sql: 'user.id = ?',
        param: `${request.user.id}`,
      };
    }
  } else {
    // 普通模式
    request.query.status = PostStatus.published;
    request.query.auditStatus = AuditLogStatus.approved;
  }

  next();
};
