// src/types/auth.ts

// Payload untuk Login
export interface LoginPayload {
  email: string;
  password: string;
}

// Payload untuk Register
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// Respons dari API Login
export interface LoginResponse {
  token: string;
}

// Respons dari API Register
export interface RegisterResponse {
  id: number;
  email: string;
}

// Respons untuk Error dari API
export interface ErrorResponse {
  message: string;
}
