import { Request, Response, NextFunction } from "express";
import { off } from "process";
import { POSTS_PRE_PAGE } from "../app/app.config";

/**
* 排序方式
*/
export const sort = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //获取客户端的地址查询符
  const {sort} = request.query;

  //排序用的 SQL
  let sqlSort : string;

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
      sqlSort = 'post.id DESC'
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
  next: NextFunction
) => {
  //获取数据
  const {tag, user, action} = request.query;

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

  //过滤用户发布的问题
  if (user && action == 'published' && !tag) {
    request.filter = {
      name: 'userPublished',
      sql: 'user.id = ?',
      param: `${user}`,
    };
  }

  //下一步
  next();
};

/**
* 内容分页
*/  
export const paginate = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  // 当前页面
  const {page = 1} = request.query;

  // 每页内容数量,默认30
  const limit = parseInt(`${POSTS_PRE_PAGE}`, 10) || 30;

  // 计算出便宜量
  const offset = limit * (parseInt(`${page}`, 10) - 1);

  request.pagination = {
    limit: limit,
    offset: offset
  };
  
  //下一步
  next();
};