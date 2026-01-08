import api from '@/shared/api/api';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  username: string;
}

/* calls /auth/login via shared api client */
export async function login(payload: LoginPayload): Promise<LoginResult> {
  const res = await api.post('/auth/login', {
    username: payload.username,
    password: payload.password,
  });

  // backend returns token only
  const { token } = res.data as { token: string };

  return {
    token,
    username: payload.username,
  };
}