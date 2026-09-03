// src/services/auth.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';
import type { User } from '@/store/auth.store';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstName:  string;
  lastName:   string;
  email:      string;
  phone?:     string;
  username?:  string;
  password:   string;
  isBusiness?: boolean;
}

export interface AuthResponse {
  user:         User;
  accessToken:  string;
  refreshToken: string;
}

// Frontend uses 'code' internally; backend DTO expects 'otp'
export interface OtpPayload {
  email: string;
  code:  string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token:       string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword:     string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.LOGIN, payload);
    return data;
  },

  async signup(payload: SignupPayload): Promise<{ message: string; email: string }> {
    const { data } = await apiClient.post(ENDPOINTS.SIGNUP, payload);
    return data;
  },

  // Map frontend field 'code' → backend DTO field 'otp'
  async verifyOtp(payload: OtpPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.OTP_VERIFY, {
      email: payload.email,
      otp:   payload.code,
    });
    return data;
  },

  async resendOtp(email: string): Promise<{ message: string }> {
    const { data } = await apiClient.post(ENDPOINTS.OTP_RESEND, { email });
    return data;
  },

  async loginWithGoogleToken(idToken: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.GOOGLE_TOKEN, { idToken });
    return data;
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const { data } = await apiClient.post(ENDPOINTS.REFRESH, { refreshToken });
    return data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post(ENDPOINTS.LOGOUT, { refreshToken });
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    const { data } = await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, payload);
    return data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    const { data } = await apiClient.post(ENDPOINTS.RESET_PASSWORD, payload);
    return data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    const { data } = await apiClient.post(ENDPOINTS.PASSWORD_CHANGE, payload);
    return data;
  },
};
