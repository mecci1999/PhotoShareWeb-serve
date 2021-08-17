import { Request, Response, NextFunction } from 'express';
import { AuditLogStatus } from './audit-log.model';
import {
  createAuditLog,
  deleteAuditLog,
  getAuditLogByResource,
} from './audit-log.service';

/**
 * 创建审核
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const data = await createAuditLog(request.body);

    // 做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 取消审核
 */
export const revoke = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备用户
  const { id: userId } = request.user;

  // 准备数据
  const { resourceType, resourceId } = request.body;

  try {
    const [auditLog] = await getAuditLogByResource({
      resourceType,
      resourceId,
    });

    const canRevokeAudit =
      auditLog &&
      auditLog.status === AuditLogStatus.pending &&
      auditLog.userId === userId;

    // 做出判断
    if (canRevokeAudit) {
      await deleteAuditLog(parseInt(`${auditLog.id}`, 10));
    } else {
      throw new Error('BAD_REQUEST');
    }

    // 做出响应
    response.send({ message: '成功取消审核!' });
  } catch (error) {
    next(error);
  }
};
