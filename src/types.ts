export type Role = 'ADMIN' | 'CUSTOMER';
export type MovieStatus = 'UPCOMING' | 'NOW_SHOWING' | 'ENDED';
export type TheatreStatus = 'ACTIVE' | 'INACTIVE';
export type ShowStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type PaymentMethod = 'CARD' | 'CASH' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface User {
  id?: number;
  name?: string;
  email?: string;
  role?: Role;
}

export interface Movie {
  id: number;
  title: string;
  description?: string;
  duration?: number;
  language?: string;
  genre?: string;
  releaseDate?: string;
  status?: MovieStatus;
}

export interface Theatre {
  id: number;
  name: string;
  location: string;
  capacity: number;
  status?: TheatreStatus;
}

export interface Show {
  id: number;
  movieId: number;
  movieTitle: string;
  theatreId: number;
  theatreName: string;
  showDate: string;
  showTime: string;
  ticketPrice: number;
  status?: ShowStatus;
}

export interface Booking {
  id: number;
  userId?: number;
  showId: number;
  movieTitle?: string;
  theatreName?: string;
  seatNumbers: string[];
  numberOfTickets: number;
  totalAmount: number;
  bookingDate?: string;
  status?: BookingStatus;
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus;
}

export interface AuthResponse {
  token: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface BookingRequest {
  showId: number;
  seatNumbers: string[];
  numberOfTickets: number;
}

export interface PaymentRequest {
  bookingId: number;
  amount: number;
  paymentMethod: PaymentMethod;
}
