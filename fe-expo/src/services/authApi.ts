import type {User} from '@/types/domain';
import {apiClient, clearAccessToken, saveAccessToken} from './apiClient';

type AuthResponse = {
  success: boolean;
  accessToken: string;
  user: User;
};

type RegisterStartResponse = {
  success: boolean;
  email: string;
  message: string;
};

type VerifyRegisterOtpResponse = {
  success: boolean;
  message: string;
};

type MeResponse = {
  success: boolean;
  user: User;
};

export async function register(input: {username: string; email: string; password: string}) {
  const {data} = await apiClient.post<RegisterStartResponse>('/auth/register', input);
  return data;
}

export async function verifyRegisterOtp(input: {username: string; email: string; password: string; otp: string}) {
  const {data} = await apiClient.post<VerifyRegisterOtpResponse>('/auth/register/verify-otp', input);
  return data;
}

export async function login(input: {identifier: string; password: string}) {
  const {data} = await apiClient.post<AuthResponse>('/auth/login', input);
  await saveAccessToken(data.accessToken);
  return data.user;
}

export async function getMe() {
  const {data} = await apiClient.get<MeResponse>('/users/me');
  return data.user;
}

export async function logout() {
  await clearAccessToken();
}
