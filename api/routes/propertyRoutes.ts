import { Router, type Request, type Response } from 'express';
import * as propertyService from '../services/propertyService';
import { sendSuccess, sendError } from '../middleware/response';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const overview = propertyService.getDashboardOverview();
  sendSuccess(res, overview);
});

router.get('/list', (_req: Request, res: Response) => {
  const properties = propertyService.getAllProperties();
  sendSuccess(res, properties);
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const detail = propertyService.getPropertyDetail(id as string);
  if (!detail) {
    return sendError(res, '房源不存在', 404);
  }
  sendSuccess(res, detail);
});

router.patch('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: 'active' | 'maintenance' };
  if (!status || !['active', 'maintenance'].includes(status)) {
    return sendError(res, '状态参数无效');
  }
  const updated = propertyService.updatePropertyStatus(id as string, status);
  if (!updated) {
    return sendError(res, '房源不存在', 404);
  }
  sendSuccess(res, updated, '状态已更新');
});

export default router;
