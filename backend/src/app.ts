// backend/src/app.ts
import { errorHandler } from './middlewares/errorHandler';
import { errorHandler } from './middlewares/errorHandler';
import { errorHandler } from './middlewares/errorHandler';
import { errorHandler } from './middlewares/errorHandler';
import { errorHandler } from './middlewares/errorHandler';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Swagger docs (UI)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ NOVÉ: raw OpenAPI JSON (už nebude "Cannot GET /docs-json")
app.get('/docs-json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(swaggerSpec);
});

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    gitCommit: process.env.RENDER_GIT_COMMIT || process.env.GIT_COMMIT || null,
    cwd: process.cwd(),
  });
});

app.use('/api', routes);

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);

  const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;

  const message = status === 500 ? 'Internal server error' : err.message || 'Something went wrong';

  res.status(status).json({
    error: status === 500 ? 'Internal server error' : 'Error',
    message,
  });
});

app.use(errorHandler);

export default app;
