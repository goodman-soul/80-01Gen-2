import * as bookingRepository from '../repositories/bookingRepository';
import * as propertyRepository from '../repositories/propertyRepository';
import type { Booking, PrecoolingInfo } from '../../shared/types';

export function getTodayBookings(propertyId?: string) {
  const bookings = bookingRepository.getAllBookings({
    propertyId,
    excludeCheckedOut: true,
  });

  const properties = propertyRepository.getAllProperties();
  const propertyMap = new Map(properties.map(p => [p.id, p]));

  const enriched = bookings.map(b => ({
    ...b,
    propertyName: propertyMap.get(b.propertyId)?.name || '未知房源',
  }));

  const precoolingStats = {
    notStarted: bookings.filter(b => !b.precooling?.enabled).length,
    inProgress: bookings.filter(b => b.precooling?.enabled && b.precooling.progress < 100).length,
    complete: bookings.filter(b => b.precooling?.enabled && b.precooling.progress >= 100).length,
  };

  return {
    bookings: enriched,
    counts: {
      upcoming: bookings.filter(b => b.status === 'upcoming').length,
      checkedIn: bookings.filter(b => b.status === 'checked-in').length,
    },
    precoolingStats,
  };
}

export function getBookingsForPrecooling(propertyId?: string) {
  const bookings = bookingRepository.getAllBookings({
    propertyId,
    excludeCheckedOut: true,
  });

  return bookings.map(b => {
    const precooling = b.precooling;
    if (precooling?.enabled && precooling.progress < 100) {
      const remaining = (100 - precooling.progress) / 10;
      (precooling as any).estimatedTime = `约 ${Math.ceil(remaining)} 分钟`;
    } else if (precooling?.enabled && precooling.progress >= 100) {
      (precooling as any).estimatedTime = '已完成';
    }
    return b;
  });
}

export function startPrecooling(bookingId: string, targetTemp: number = 24): Booking | null {
  const booking = bookingRepository.getBookingById(bookingId);
  if (!booking) return null;

  const currentTemp = 31;
  const precooling: PrecoolingInfo = {
    enabled: true,
    targetTemp,
    currentTemp,
    progress: 0,
    startTime: new Date().toISOString(),
  };

  bookingRepository.updateBookingPrecooling(bookingId, precooling);
  return bookingRepository.getBookingById(bookingId) ?? null;
}

export function updatePrecoolingProgress(bookingId: string, progressDelta: number): Booking | null {
  const booking = bookingRepository.getBookingById(bookingId);
  if (!booking || !booking.precooling?.enabled) return null;

  const p = booking.precooling;
  const newProgress = Math.min(100, Math.max(0, p.progress + progressDelta));
  const tempDiff = p.targetTemp - 31;
  const newTemp = Math.round(31 + (tempDiff * newProgress / 100) * 10) / 10;

  const newPrecooling: PrecoolingInfo = {
    ...p,
    progress: newProgress,
    currentTemp: newTemp,
  };

  bookingRepository.updateBookingPrecooling(bookingId, newPrecooling);
  return bookingRepository.getBookingById(bookingId) ?? null;
}

export function checkIn(bookingId: string): Booking | null {
  bookingRepository.updateBookingStatus(bookingId, 'checked-in');
  return bookingRepository.getBookingById(bookingId) ?? null;
}

export function checkOut(bookingId: string): Booking | null {
  bookingRepository.updateBookingStatus(bookingId, 'checked-out');
  return bookingRepository.getBookingById(bookingId) ?? null;
}
