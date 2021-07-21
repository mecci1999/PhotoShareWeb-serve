import { Request, Response, NextFunction, response } from "express";

/**
 *内容列表
 */
export const index = (
  resquest: Request,
  resonse: Response,
  next: NextFunction
) => {
  response.send("内容列表接口");
};