import type {User} from '@/types/domain';
import {apiClient, clearAccessToken, saveAccessToken} from './apiClient';

type AuthResponse = {
  success: boolean;
  accessToken: string;
  user: User;
};

type MeResponse = {
  success: boolean;
  user: User;
};

export async function register(input: {fullName: string; email: string; password: string}) {
  const {data} = await apiClient.post<AuthResponse>('/auth/register', input);
  await saveAccessToken(data.accessToken);
  return data.user;
}

export async function login(input: {email: string; password: string}) {
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
