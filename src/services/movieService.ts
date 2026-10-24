import { api } from './api';
import type { Movie } from '../types';

export const movieService = {
  getAll: async () => {
    const { data } = await api.get<Movie[]>('/movies');
    return data;
  },
  getMovies: async () => movieService.getAll(),
  getById: async (id: number) => {
    const { data } = await api.get<Movie>(`/movies/${id}`);
    return data;
  },
  getMovieById: async (id: number) => movieService.getById(id),
  create: async (payload: Partial<Movie>) => {
    const { data } = await api.post<Movie>('/movies', payload);
    return data;
  },
  createMovie: async (payload: Partial<Movie>) => movieService.create(payload),
  update: async (id: number, payload: Partial<Movie>) => {
    const { data } = await api.put<Movie>(`/movies/${id}`, payload);
    return data;
  },
  updateMovie: async (id: number, payload: Partial<Movie>) => movieService.update(id, payload),
  remove: async (id: number) => {
    await api.delete(`/movies/${id}`);
  },
  deleteMovie: async (id: number) => movieService.remove(id),
};
