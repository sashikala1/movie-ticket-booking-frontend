import { api } from './api';
import type { Booking, BookingRequest, BookingStatus } from '../types';

export const bookingService = {
  create: async (payload: BookingRequest) => {
    const { data } = await api.post<Booking>('/bookings', payload);
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<Booking>(`/bookings/${id}`);
    return data;
  },
  getBookingById: async (id: number) => bookingService.getById(id),
  getMine: async () => {
    const { data } = await api.get<Booking[]>('/bookings/my-bookings');
    return data;
  },
  getMyBookings: async () => bookingService.getMine(),
  getAll: async () => {
    const { data } = await api.get<Booking[]>('/bookings');
    return data;
  },
  getAllBookings: async () => bookingService.getAll(),
  cancel: async (id: number) => {
    const { data } = await api.put<Booking>(`/bookings/${id}/cancel`);
    return data;
  },
  cancelBooking: async (id: number) => bookingService.cancel(id),
  updateBookingStatus: async (id: number, status: BookingStatus) => {
    const { data } = await api.put<Booking>(`/bookings/${id}/status`, null, {
      params: { status },
    });
    return data;
  },
};
