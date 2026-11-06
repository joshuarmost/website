// Express API server
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import nodemailer from 'nodemailer';
import type { NextFunction, Request, Response } from 'express';

interface DevPost {
  id: number;
  title: string;
  date: string;
  content: string;
}

interface ContactRequest {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string;
}

dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS ?? (isProduction ? '' : 'http://localhost:5173'))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

if (isProduction && allowedOrigins.size === 0) {
  throw new Error('ALLOWED_ORIGINS must contain the public site origin in production.');
}

const app = express();
const PORT = process.env.PORT || 5555;
const trustedProxyHops = process.env.TRUST_PROXY_HOPS;

if (trustedProxyHops !== undefined) {
  if (!/^\d+$/.test(trustedProxyHops)) {
    throw new Error('TRUST_PROXY_HOPS must be a non-negative integer.');
  }
  app.set('trust proxy', Number(trustedProxyHops));
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 1,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

const contactEmailLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 1,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req) => getEmail(req.body?.email) ?? req.ip ?? 'unknown',
  message: { error: 'Too many requests. Please try again later.' },
});

const requireAllowedOrigin = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.get('origin');
  if (!origin || !allowedOrigins.has(origin)) {
    return res.status(403).json({ error: 'Origin is not allowed.' });
  }
  next();
};

// ES modules path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectDirectory = path.basename(__dirname) === '.server-build'
  ? path.dirname(__dirname)
  : __dirname;

// Markdown posts folder
const POSTS_DIR = path.join(projectDirectory, 'devPostsMd');
console.log('Dev posts folder path:', POSTS_DIR);
console.log('Exists?', fs.existsSync(POSTS_DIR));
console.log('Files:', fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR) : 'No folder');

// Serve frontend static files in production
// Your Vite config builds to 'build' folder
const buildPath = path.join(projectDirectory, 'build');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(buildPath));
}

// Middleware
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false,
  strictTransportSecurity: isProduction ? undefined : false,
}));
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header are non-browser clients such as health checks.
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
}));
app.use(express.json({ limit: '16kb', strict: true }));
app.use('/api', apiLimiter);

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Helper: Load Markdown posts
const loadPosts = (): DevPost[] => {
  if (!fs.existsSync(POSTS_DIR)) {
    console.warn('Dev posts folder not found:', POSTS_DIR);
    return [];
  }

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts: DevPost[] = [];
  files.forEach((file, idx) => {
    try {
      const filePath = path.join(POSTS_DIR, file);
      const contentRaw = fs.readFileSync(filePath, 'utf8');
      const { metadata, content } = parseFrontMatter(contentRaw);
      const title = metadata.title ?? file.replace('.md', '');
      const date = metadata.date
        ? metadata.date
        : fs.statSync(filePath).mtime.toISOString().split('T')[0];

      posts.push({
        id: idx + 1,
        title,
        date,
        content,
      });
    } catch (err) {
      console.error('Error loading post:', file, err);
    }
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  console.log('Loaded posts:', posts.map(p => p.title));
  return posts;
};

interface PostMetadata {
  title?: string;
  date?: string;
}

/**
 * This site only needs string title/date metadata. Avoid parsing arbitrary YAML,
 * which keeps the content format small and removes an unneeded attack surface.
 */
const parseFrontMatter = (raw: string): { metadata: PostMetadata; content: string } => {
  if (!raw.startsWith('---\n') && !raw.startsWith('---\r\n')) {
    return { metadata: {}, content: raw };
  }

  const closingDelimiter = raw.indexOf('\n---', 3);
  if (closingDelimiter === -1) return { metadata: {}, content: raw };

  const metadataLines = raw.slice(3, closingDelimiter).split(/\r?\n/);
  const metadata: PostMetadata = {};

  for (const line of metadataLines) {
    const match = /^(title|date):\s*(.*?)\s*$/.exec(line);
    if (!match) continue;

    const [, key, rawValue] = match;
    const value = rawValue.replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, '$1$2').trim();
    if (value) metadata[key as keyof PostMetadata] = value;
  }

  return {
    metadata,
    content: raw.slice(closingDelimiter + 4).replace(/^\r?\n/, ''),
  };
};

const getText = (value: unknown, maxLength: number): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : undefined;
};

const getEmail = (value: unknown): string | undefined => {
  const email = getText(value, 254)?.toLowerCase();
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined;
};

// === API ROUTER ===
const apiRouter = express.Router();

apiRouter.get('/devPosts', (req, res) => {
  const posts = loadPosts();
  if (!posts.length) console.warn('No dev posts found!');
  res.json(posts);
});

apiRouter.post('/contact', requireAllowedOrigin, contactLimiter, contactEmailLimiter, async (req: Request<unknown, unknown, ContactRequest>, res, next) => {
  if (req.body.website) {
    return res.status(200).json({ message: 'Email sent successfully' });
  }

  const name = getText(req.body.name, 100);
  const email = getEmail(req.body.email);
  const subject = getText(req.body.subject, 160);
  const message = getText(req.body.message, 5_000);

  if (!name || !email || !subject || !message || /[\r\n]/.test(subject)) {
    return res.status(400).json({ error: 'Please provide valid contact details.' });
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  if (!emailUser || !emailPass) {
    console.error('Contact mail service is not configured.');
    return res.status(503).json({ error: 'Email service is temporarily unavailable.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: { name: 'Website contact form', address: emailUser },
      replyTo: { name, address: email },
      to: 'me@joshuamost.com',
      subject,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    next(err);
  }
});

app.use('/api', apiRouter);

// === SPA fallback ===
if (process.env.NODE_ENV === 'production') {
  app.get(/^\/.*$/, (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// === Error handling middleware ===
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Error on ${req.method} ${req.originalUrl}:`, err);
  res.status(500).json({ error: 'Internal server error' });
});

// === Start server ===
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
