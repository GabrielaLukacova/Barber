import { Router } from 'express';

const router = Router();

router.get('/routes', (req, res) => {
  const stack = (req.app as any)?._router?.stack ?? [];
  const routes = stack
    .filter((l: any) => l?.route || l?.name === 'router')
    .map((l: any) => {
      if (l.route) return { path: l.route.path, methods: l.route.methods };
      if (l.name === 'router') return { name: 'router', regexp: String(l.regexp) };
      return null;
    })
    .filter(Boolean);
  res.json(routes);
});

export default router;
