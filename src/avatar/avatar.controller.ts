import { Request, Response, NextFunction } from "express";

/**
* 上传头像文件
*/
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.sendStatus(201);
};