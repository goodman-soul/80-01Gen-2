import { Router, type Request, type Response } from 'express';
import * as alertService from '../services/alertService';
import { sendSuccess, sendError } from '../middleware/response';
import type { AlertSeverity } from '../../shared/types';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { propertyId, acknowledged, severity } = req.query as {
    propertyId?: string;
    acknowledged?: string;
    severity?: AlertSeverity;
  };

  const ackBool = acknowledged === 'true' ? true : acknowledged === 'false' ? false : undefined;
  const result = alertService.getAlertList({
    propertyId,
    acknowledged: ackBool,
    severity,
  });
  sendSuccess(res, result);
});

router.get('/stats', (_req: Request, res: Response) => {
  const stats = alertService.getUnacknowledgedStats();
  sendSuccess(res, stats);
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const alert = alertService.getAlertDetail(id as string);
  if (!alert) {
    return sendError(res, '告警不存在', 404);
  }
  sendSuccess(res, alert);
});

router.post('/:id/acknowledge', (req: Request, res: Response) => {
  const { id } = req.params;
  const alert = alertService.acknowledgeAlert(id as string);
  if (!alert) {
    return sendError(res, '告警不存在', 404);
  }
  sendSuccess(res, alert, '告警已处理');
});

router.post('/', (req: Request, res: Response) => {
  const { type, severity, title, description, deviceId, propertyId } = req.body;
  if (!type || !severity || !title || !description || !propertyId) {
    return sendError(res, '必要参数缺失');
  }
  const id = alertService.createAlert({
    type, severity, title, description, deviceId, propertyId,
  });
  sendSuccess(res, { id }, '告警已创建');
});

export default router;
