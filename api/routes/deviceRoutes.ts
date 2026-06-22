import { Router, type Request, type Response } from 'express';
import * as deviceService from '../services/deviceService';
import { sendSuccess, sendError } from '../middleware/response';
import type { DeviceType, DeviceStatus } from '../../shared/types';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { propertyId, type, status } = req.query as {
    propertyId?: string;
    type?: DeviceType | 'all';
    status?: DeviceStatus;
  };
  const result = deviceService.getDeviceList({ propertyId, type, status });
  sendSuccess(res, result);
});

router.get('/charts', (_req: Request, res: Response) => {
  const charts = deviceService.getChartsData();
  sendSuccess(res, charts);
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const device = deviceService.getDeviceDetail(id as string);
  if (!device) {
    return sendError(res, '设备不存在', 404);
  }
  sendSuccess(res, device);
});

router.patch('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: DeviceStatus };
  if (!status) {
    return sendError(res, '状态参数缺失');
  }
  const updated = deviceService.updateDeviceStatus(id as string, status);
  if (!updated) {
    return sendError(res, '设备不存在', 404);
  }
  sendSuccess(res, updated, '设备状态已更新');
});

router.patch('/:id/ac-settings', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = deviceService.updateACSettings(id as string, req.body);
  if (!updated) {
    return sendError(res, '设备不存在或类型错误', 404);
  }
  sendSuccess(res, updated, '空调设置已更新');
});

export default router;
