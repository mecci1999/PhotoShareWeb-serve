import { Request, Response, NextFunction } from "express";
import _ from 'lodash';
import * as fileService from './file.service';

/**
* 上传文件
*/
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 当前用户
  const {id: userId} = request.user;

  // 所属内容
  const {post: postId} = request.query;

  // 文件信息
  const fileInfo = _.pick(request.file, [
    'originalname',
    'mimetype',
    'filename',
    'size',
  ]);

  // 存储操作
  try {
    // 保存文件信息
    const data = await fileService.createFile({
      ...fileInfo,
      userId,
      postId
    });

    // 做出响应
    response.status(201).send(data);
  } catch (error) {
      next(error); 
  }
};

/**
* 文件服务
*/
export const serve = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 获取文件ID，从地址参数里得到
  const { fileId } = request.params;

  try {
    //查找文件
    const file = await fileService.findFileById(parseInt(fileId, 10));

    //作出响应
    response.sendFile(file.filename, {
      root: 'uploads',
      headers: {
        'Content-Type': file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};