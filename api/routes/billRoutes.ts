import { Router, type Request, type Response } from 'express';
import * as billService from '../services/billService';
import { sendSuccess, sendError } from '../middleware/response';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const bills = billService.getAllBills();
  sendSuccess(res, bills);
});

router.get('/query', (req: Request, res: Response) => {
  const { orderNumber } = req.query as { orderNumber?: string };
  if (!orderNumber) {
    return sendError(res, '订单号不能为空');
  }
  const bill = billService.queryBillByOrderNumber(orderNumber);
  if (!bill) {
    return sendError(res, '未找到对应账单', 404);
  }
  sendSuccess(res, bill);
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const bill = billService.getBillById(id as string);
  if (!bill) {
    return sendError(res, '账单不存在', 404);
  }
  sendSuccess(res, bill);
});

router.get('/booking/:bookingId', (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const bill = billService.getBillByBooking(bookingId as string);
  if (!bill) {
    return sendError(res, '该预订暂无账单', 404);
  }
  sendSuccess(res, bill);
});

router.get('/:id/summary', (req: Request, res: Response) => {
  const { id } = req.params;
  const summary = billService.getBillSummary(id as string);
  if (!summary) {
    return sendError(res, '账单不存在', 404);
  }
  sendSuccess(res, summary);
});

export default router;
