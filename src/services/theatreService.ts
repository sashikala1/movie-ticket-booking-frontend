import { api } from './api';
import type { Theatre } from '../types';

export const theatreService = {
  getAll: async () => {
    const { data } = await api.get<Theatre[]>('/theatres');
    return data;
  },
  getTheatres: async () => theatreService.getAll(),
  getById: async (id: number) => {
    const { data } = await api.get<Theatre>(`/theatres/${id}`);
    return data;
  },
  getTheatreById: async (id: number) => theatreService.getById(id),
  create: async (payload: Partial<Theatre>) => {
    const { data } = await api.post<Theatre>('/theatres', payload);
    return data;
  },
  createTheatre: async (payload: Partial<Theatre>) => theatreService.create(payload),
  update: async (id: number, payload: Partial<Theatre>) => {
    const { data } = await api.put<Theatre>(`/theatres/${id}`, payload);
    return data;
  },
  updateTheatre: async (id: number, payload: Partial<Theatre>) => theatreService.update(id, payload),
  remove: async (id: number) => {
    await api.delete(`/theatres/${id}`);
  },
  deleteTheatre: async (id: number) => theatreService.remove(id),
};
