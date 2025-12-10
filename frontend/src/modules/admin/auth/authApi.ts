import api from '@/services/api';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  username: string;
}

/**
 * Calls the deployed backend /api/auth/login using the shared Axios client.
 * IMPORTANT: it does NOT touch localStorage – the Pinia auth store does that.
 */
export async function login(payload: LoginPayload): Promise<LoginResult> {
  const res = await api.post('/auth/login', {
    username: payload.username,
    password: payload.password,
  });

  const { token } = res.data as { token: string };

  return {
    token,
    username: payload.username,
  };
}
