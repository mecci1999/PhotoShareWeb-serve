import { Request, Response, NextFunction } from 'express';
import { searchTags } from './search.service';

/**
 * 搜素标签
 */
export const tags = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    // 准备数据
    const { name } = request.query;
    const tagName = `${name}`;

    // 查询标签
    const tags = await searchTags({ tagName });

    // 做出响应
    response.send(tags);
  } catch (error) {
    next(error);
  }
};
