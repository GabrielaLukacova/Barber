export interface LoginPayload {
  username: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<void> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Login failed');
  }

  const data = await res.json();
  localStorage.setItem('admin_token', data.token);
  localStorage.setItem('admin_username', payload.username);
}

export function logout(): void {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_username');
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem('admin_token');
}