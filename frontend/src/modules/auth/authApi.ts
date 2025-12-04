// frontend/src/modules/admin/auth/authApi.ts

export interface LoginResponse {
  token: string;
}

export async function login(username: string, password: string): Promise<void> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Login failed');
  }

  const data: LoginResponse = await res.json();
  // 🔴 THIS IS THE IMPORTANT PART
  localStorage.setItem('adminToken', data.token);
}
