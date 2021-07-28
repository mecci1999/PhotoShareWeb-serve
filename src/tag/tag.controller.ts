import { Request, Response, NextFunction } from 'express';
import * as tagService from './tag.service';

/**
 * 创建标签
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //准备数据
  const {name} = request.body;

  try {
    //查找标签
    const tag = await tagService.getTagByName(name);

    // 如果标签存在
    if(tag) throw new Error('TAG_ALREADY_EIXST');

    // 存储标签
    const data = await tagService.createTag({name});

    //做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};