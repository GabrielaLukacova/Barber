import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index';
import { swaggerSpec } from './config/swagger';
import path from 'node:path';
import fs from 'node:fs/promises';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const SERVICES_DIR = path.join(UPLOADS_DIR, 'services');
const GALLERY_DIR = path.join(UPLOADS_DIR, 'gallery');

async function detectMime(filePath: string): Promise<string> {
  const fh = await fs.open(filePath, 'r');
  try {
    const buf = Buffer.alloc(12);
    await fh.read(buf, 0, 12, 0);

    // sniff image type
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';

    if (
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47 &&
      buf[4] === 0x0d &&
      buf[5] === 0x0a &&
      buf[6] === 0x1a &&
      buf[7] === 0x0a
    )
      return 'image/png';

    if (
      buf[0] === 0x52 && // R
      buf[1] === 0x49 && // I
      buf[2] === 0x46 && // F
      buf[3] === 0x46 && // F
      buf[8] === 0x57 && // W
      buf[9] === 0x45 && // E
      buf[10] === 0x42 && // B
      buf[11] === 0x50 // P
    )
      return 'image/webp';

    return 'application/octet-stream';
  } finally {
    await fh.close();
  }
}

/* files have no extension */
app.get('/uploads/services/:file', async (req, res, next) => {
  try {
    const abs = path.join(SERVICES_DIR, req.params.file);
    const mime = await detectMime(abs);
    res.setHeader('Cache-Control', 'public, max-age=0');
    res.type(mime);
    return res.sendFile(abs);
  } catch (err) {
    return next(err);
  }
});

app.get('/uploads/gallery/:file', async (req, res, next) => {
  try {
    const abs = path.join(GALLERY_DIR, req.params.file);
    const mime = await detectMime(abs);
    res.setHeader('Cache-Control', 'public, max-age=0');
    res.type(mime);
    return res.sendFile(abs);
  } catch (err) {
    return next(err);
  }
});

// static uploads fallback
app.use('/uploads', express.static(UPLOADS_DIR));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/docs-json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(swaggerSpec);
});

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

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);

  // normalize status
  const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const message = status === 500 ? 'Internal server error' : err.message || 'Something went wrong';

  res.status(status).json({
    error: status === 500 ? 'Internal server error' : 'Error',
    message,
  });
});

export default app;