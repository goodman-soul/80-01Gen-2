import * as alertRepository from '../repositories/alertRepository';
import type { Alert, AlertType, AlertSeverity } from '../../shared/types';

export function getAlertList(options?: {
  propertyId?: string;
  acknowledged?: boolean;
  severity?: AlertSeverity;
}) {
  const alerts = alertRepository.getAllAlerts(options);
  const unacknowledgedCount = alerts.filter(a => a.acknowledged === 0).length;

  const counts = {
    error: alerts.filter(a => a.severity === 'error' && a.acknowledged === 0).length,
    warning: alerts.filter(a => a.severity === 'warning' && a.acknowledged === 0).length,
    info: alerts.filter(a => a.severity === 'info' && a.acknowledged === 0).length,
    total: unacknowledgedCount,
  };

  return {
    alerts,
    counts,
  };
}

export function getAlertDetail(id: string): Alert | undefined {
  return alertRepository.getAlertById(id);
}

export function acknowledgeAlert(id: string): Alert | undefined {
  alertRepository.acknowledgeAlert(id);
  return alertRepository.getAlertById(id);
}

export function createAlert(data: {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  deviceId?: string;
  propertyId: string;
}): string {
  return alertRepository.createAlert({
    ...data,
    deviceId: data.deviceId ?? null,
    timestamp: new Date().toISOString(),
    acknowledged: 0,
  });
}

export function getUnacknowledgedStats() {
  const alerts = alertRepository.getAllAlerts();
  return {
    total: alerts.filter(a => a.acknowledged === 0).length,
    error: alerts.filter(a => a.acknowledged === 0 && a.severity === 'error').length,
    warning: alerts.filter(a => a.acknowledged === 0 && a.severity === 'warning').length,
    info: alerts.filter(a => a.acknowledged === 0 && a.severity === 'info').length,
  };
}
