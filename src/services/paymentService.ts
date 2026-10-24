import { api } from './api';
import type { Payment, PaymentRequest } from '../types';

export const paymentService = {
  create: async (payload: PaymentRequest) => {
    const { data } = await api.post<Payment>('/payments', payload);
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<Payment>(`/payments/${id}`);
    return data;
  },
  getPaymentById: async (id: number) => paymentService.getById(id),
  getStatus: async (id: number) => {
    const { data } = await api.get<Payment>(`/payments/${id}/status`);
    return data;
  },
  getPaymentStatus: async (id: number) => paymentService.getStatus(id),
  getAll: async () => {
    try {
      const { data } = await api.get<Payment[]>('/payments');
      return data;
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404) return [];
      throw error;
    }
  },
  getPayments: async () => paymentService.getAll(),
};
