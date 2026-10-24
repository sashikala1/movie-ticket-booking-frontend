import { api } from './api';
import type { User } from '../types';

export const userService = {
  getUsers: async () => {
    const { data } = await api.get<User[]>('/users');
    return data;
  },
  getUserById: async (id: number) => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },
  updateUser: async (id: number, payload: Partial<User> & { password?: string }) => {
    const { data } = await api.put<User>(`/users/${id}`, payload);
    return data;
  },
  deleteUser: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
  getAll: async () => userService.getUsers(),
  getById: async (id: number) => userService.getUserById(id),
  update: async (id: number, payload: Partial<User> & { password?: string }) => userService.updateUser(id, payload),
  remove: async (id: number) => userService.deleteUser(id),
};
