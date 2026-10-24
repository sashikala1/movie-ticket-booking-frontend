import { api } from './api';
import type { Show } from '../types';

export const showService = {
  getAll: async () => {
    const { data } = await api.get<Show[]>('/shows');
    return data;
  },
  getShows: async () => showService.getAll(),
  getById: async (id: number) => {
    const { data } = await api.get<Show>(`/shows/${id}`);
    return data;
  },
  getShowById: async (id: number) => showService.getById(id),
  getByMovieId: async (movieId: number) => {
    const { data } = await api.get<Show[]>(`/shows/movie/${movieId}`);
    return data;
  },
  getShowsByMovie: async (movieId: number) => showService.getByMovieId(movieId),
  getSeatAvailability: async (showId: number) => {
    const { data } = await api.get<{ bookedSeats: string[]; availableSeats: string[] }>(`/shows/${showId}/seats`);
    return data;
  },
  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post<Show>('/shows', payload);
    return data;
  },
  createShow: async (payload: Record<string, unknown>) => showService.create(payload),
  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put<Show>(`/shows/${id}`, payload);
    return data;
  },
  updateShow: async (id: number, payload: Record<string, unknown>) => showService.update(id, payload),
  remove: async (id: number) => {
    await api.delete(`/shows/${id}`);
  },
  deleteShow: async (id: number) => showService.remove(id),
};
