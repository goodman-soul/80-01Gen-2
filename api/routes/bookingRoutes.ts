import { Router, type Request, type Response } from 'express';
import * as bookingService from '../services/bookingService';
import { sendSuccess, sendError } from '../middleware/response';

const router = Router();

router.get('/today', (req: Request, res: Response) => {
  const { propertyId } = req.query as { propertyId?: string };
  const result = bookingService.getTodayBookings(propertyId);
  sendSuccess(res, result);
});

router.get('/precooling', (req: Request, res: Response) => {
  const { propertyId } = req.query as { propertyId?: string };
  const bookings = bookingService.getBookingsForPrecooling(propertyId);
  sendSuccess(res, bookings);
});

router.post('/:bookingId/precooling/start', (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { targetTemp } = req.body as { targetTemp?: number };
  const result = bookingService.startPrecooling(bookingId as string, targetTemp ?? 24);
  if (!result) {
    return sendError(res, '预订不存在', 404);
  }
  sendSuccess(res, result, '预冷已启动');
});

router.patch('/:bookingId/precooling/progress', (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { progressDelta } = req.body as { progressDelta?: number };
  const result = bookingService.updatePrecoolingProgress(bookingId as string, progressDelta ?? 10);
  if (!result) {
    return sendError(res, '预订不存在或预冷未启动', 404);
  }
  sendSuccess(res, result, '预冷进度已更新');
});

router.post('/:bookingId/check-in', (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const result = bookingService.checkIn(bookingId as string);
  if (!result) {
    return sendError(res, '预订不存在', 404);
  }
  sendSuccess(res, result, '已办理入住');
});

router.post('/:bookingId/check-out', (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const result = bookingService.checkOut(bookingId as string);
  if (!result) {
    return sendError(res, '预订不存在', 404);
  }
  sendSuccess(res, result, '已办理离店');
});

export default router;
