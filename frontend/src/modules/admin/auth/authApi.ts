import axios from '@/services/api';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await axios.post<LoginResponse>('/auth/login', payload);

  localStorage.setItem('admin_token', res.data.token);
  localStorage.setItem('admin_username', res.data.username);

  return res.data;
}

export function logout() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_username');
}
