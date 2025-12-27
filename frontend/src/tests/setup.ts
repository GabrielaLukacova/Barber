import { afterEach, vi } from 'vitest';

// Mock axios globally so no real HTTP runs in tests.
vi.mock('axios', () => {
  const mockAxios = {
    get: vi.fn(async () => ({ data: [] })),
    post: vi.fn(async () => ({ data: {} })),
    put: vi.fn(async () => ({ data: {} })),
    delete: vi.fn(async () => ({ data: {} })),
    create: () => mockAxios,
    defaults: { headers: { common: {} } },
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  };
  return { default: mockAxios };
});

// Stub RouterLink so components using vue-router don't warn.
vi.mock('vue-router', async () => {
  const actual: any = await vi.importActual('vue-router');
  return {
    ...actual,
    RouterLink: {
      name: 'RouterLink',
      props: ['to'],
      template: '<a><slot /></a>',
    },
    useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
    useRoute: () => ({ path: '/', params: {}, query: {} }),
  };
});

// Reduce noisy AbortErrors during happy-dom teardown (cosmetic only).
const _err = console.error;
console.error = (...args: any[]) => {
  const msg = String(args?.[0] ?? '');
  if (msg.includes('AbortError') || msg.includes('Request aborted')) return;
  _err(...args);
};

afterEach(() => {
  document.body.innerHTML = '';
});
