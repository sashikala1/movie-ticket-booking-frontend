import { api } from './api';
import type { AuthResponse, SigninRequest, SignupRequest } from '../types';

export const authService = {
  signup: async (payload: SignupRequest) => {
    const { data } = await api.post<AuthResponse>('/auth/signup', payload);
    return data;
  },
  signin: async (payload: SigninRequest) => {
    const { data } = await api.post<AuthResponse>('/auth/signin', payload);
    return data;
  },
};
