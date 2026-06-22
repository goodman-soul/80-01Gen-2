import { Router, type Request, type Response } from 'express';
import * as statsService from '../services/statsService';
import { sendSuccess } from '../middleware/response';

const router = Router();

router.get('/monthly', (req: Request, res: Response) => {
  const { month } = req.query as { month?: string };
  const stats = statsService.getMonthlyStatistics(month ?? '2024-01');
  sendSuccess(res, stats);
});

router.get('/ranking', (req: Request, res: Response) => {
  const { month } = req.query as { month?: string };
  const ranking = statsService.getPropertyRanking(month ?? '2024-01');
  sendSuccess(res, ranking);
});

router.get('/trend', (_req: Request, res: Response) => {
  const trend = statsService.getCostComparison();
  sendSuccess(res, trend);
});

export default router;
