dev-backend:
\tcd backend && npm run dev

dev-frontend:
\tcd frontend && npm run dev

dev:
\t(cd backend && npm run dev) & (cd frontend && npm run dev)
