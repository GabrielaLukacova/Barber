dev-backend:
	cd backend && npm run dev

dev-frontend:
	cd frontend && npm run dev

dev:
	(cd backend && npm run dev) & (cd frontend && npm run dev)
