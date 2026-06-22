import * as statsRepository from '../repositories/statsRepository';
import type { MonthlyStats } from '../../shared/types';

export function getMonthlyStatistics(month: string = '2024-01'): MonthlyStats {
  const stats = statsRepository.getMonthlyStats(month);
  return stats as MonthlyStats;
}

export function getPropertyRanking(month: string = '2024-01') {
  const stats = statsRepository.getMonthlyPropertyStats(month);
  return {
    month,
    ranking: stats,
    bestPerformer: stats[0],
  };
}

export function getCostComparison(months: string[] = ['2023-08', '2023-09', '2023-10', '2023-11', '2023-12', '2024-01']) {
  const trend = statsRepository.getMonthlyTrend();
  const latestMonth = trend[trend.length - 1];
  const prevMonth = trend[trend.length - 2];

  const delta = prevMonth
    ? {
        electricity: {
          value: latestMonth.electricity - prevMonth.electricity,
          percent: Math.round(((latestMonth.electricity - prevMonth.electricity) / prevMonth.electricity) * 1000) / 10,
        },
        cost: {
          value: latestMonth.cost - prevMonth.cost,
          percent: Math.round(((latestMonth.cost - prevMonth.cost) / prevMonth.cost) * 1000) / 10,
        },
      }
    : null;

  return {
    trend,
    delta,
  };
}
