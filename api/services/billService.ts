import * as billRepository from '../repositories/billRepository';
import type { EnergyBill } from '../../shared/types';

export function getBillById(id: string): EnergyBill | undefined {
  return billRepository.getBillById(id);
}

export function getBillByBooking(bookingId: string): EnergyBill | undefined {
  return billRepository.getBillByBookingId(bookingId);
}

export function queryBillByOrderNumber(orderNumber: string): EnergyBill | undefined {
  return billRepository.getBillByOrderNumber(orderNumber);
}

export function getAllBills(): EnergyBill[] {
  return billRepository.getAllBills();
}

export function getBillSummary(id: string) {
  const bill = billRepository.getBillById(id);
  if (!bill) return null;

  return {
    id: bill.id,
    propertyName: bill.propertyName,
    roomNumber: bill.roomNumber,
    checkIn: bill.checkIn,
    checkOut: bill.checkOut,
    totalCost: bill.totalCost,
    totalElectricity: bill.totalElectricity,
    totalWater: bill.totalWater,
    averageDailyCost: bill.averageDailyCost,
    solarOffset: bill.solarOffset,
    potentialSavings: bill.savingTips.reduce((sum, tip) => sum + tip.savingAmount, 0),
  };
}
