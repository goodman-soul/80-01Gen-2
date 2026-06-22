import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../../shared/types';

export function sendSuccess<T>(res: Response, data: T, message?: string) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  res.json(response);
}

export function sendError(res: Response, message: string, statusCode: number = 400) {
  const response: ApiResponse<null> = {
    success: false,
    error: message,
    message,
  };
  res.status(statusCode).json(response);
}

export function notFoundHandler(req: Request, res: Response) {
  sendError(res, `路由 ${req.method} ${req.path} 不存在`, 404);
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[Server Error]', err);
  sendError(res, err.message || '服务器内部错误', err.statusCode || 500);
}
