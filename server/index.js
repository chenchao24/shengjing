/**
 * server/index.js — 纯 Node.js 内置模块服务器（无需 npm install）
 * 使用 http / fs / path / url 实现静态文件服务 + REST API
 */
const http = require('http');
const fs   = require('fs');
const path = require('path');
const { URL } = require('url');
const { exec } = require('child_process');

const db = require('./db');
const articlesRouter     = require('./routes/articles');
const doctorsRouter      = require('./routes/doctors');
const appointmentsRouter = require('./routes/appointments');
const adminRouter        = require('./routes/admin');

const PORT    = 8000;
const PUBLIC  = path.join(__dirname, '..', 'public');

// ── MIME 类型 ──
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

// ── 轻量 Request / Response 封装（仿 Express 风格） ──
function wrapRes(res) {
  res.status = (code) => { res._statusCode = code; return res; };
  res.json   = (data) => {
    const body = JSON.stringify(data);
    res.writeHead(res._statusCode || 200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
    });
    res.end(body);
  };
  res._statusCode = 200;
  return res;
}

// ── 解析请求体 JSON ──
function parseBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); }
      catch(_) { resolve({}); }
    });
  });
}

// ── 简易路由匹配（支持 :param） ──
function matchRoute(pattern, pathname) {
  const pp = pattern.split('/');
  const ap = pathname.split('/');
  if (pp.length !== ap.length) return null;
  const params = {};
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(':')) {
      params[pp[i].slice(1)] = decodeURIComponent(ap[i]);
    } else if (pp[i] !== ap[i]) {
      return null;
    }
  }
  return params;
}

// ── 静态文件服务 ──
function serveStatic(pathname, res) {
  // SPA 回退
  let filePath = path.join(PUBLIC, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath)) filePath = path.join(PUBLIC, 'index.html');

  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  } catch(_) {
    res.writeHead(404); res.end('Not Found');
  }
}

// ── API 分发器 ──
// routes 格式: [method, pattern, handler(req, res, params, query, body)]
const routes = [];

function on(method, pattern, handler) {
  routes.push([method.toUpperCase(), pattern, handler]);
}

// 注册所有 API 路由
articlesRouter(on, db);
doctorsRouter(on, db);
appointmentsRouter(on, db);
adminRouter(on, db);

// 收藏（内联）
on('GET',    '/api/favorites', (req, res, _p, query) => {
  const { userId = 'demo-user' } = query;
  res.json(db.getAll('favorites', { userId }));
});
on('POST',   '/api/favorites', async (req, res, _p, _q, body) => {
  const { articleId, title, type, desc } = body;
  if (!articleId) return res.status(400).json({ error: '缺少 articleId' });
  const exists = db.getAll('favorites').find(f => f.articleId === articleId && f.userId === 'demo-user');
  if (exists) return res.json(exists);
  res.status(201).json(db.insert('favorites', {
    id: 'fav' + Date.now(), articleId, userId: 'demo-user',
    title: title||'', type: type||'图文', desc: desc||'',
    createdAt: new Date().toISOString(),
  }));
});
on('DELETE', '/api/favorites/:id', (req, res, params) => {
  const ok = db.remove('favorites', params.id);
  if (!ok) return res.status(404).json({ error: '收藏不存在' });
  res.json({ ok: true });
});

// ── HTTP 服务器 ──
const server = http.createServer(async (req, rawRes) => {
  const res = wrapRes(rawRes);
  const parsed   = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const pathname = parsed.pathname;
  const query    = Object.fromEntries(parsed.searchParams.entries());
  const method   = req.method.toUpperCase();

  // 静态资源
  if (!pathname.startsWith('/api/')) {
    return serveStatic(pathname, rawRes);
  }

  // API 路由匹配
  let matched = false;
  for (const [m, pattern, handler] of routes) {
    if (m !== method && !(m === 'GET' && method === 'HEAD')) continue;
    const params = matchRoute(pattern, pathname);
    if (params === null) continue;
    matched = true;
    try {
      const body = (method === 'POST' || method === 'PATCH' || method === 'PUT')
        ? await parseBody(req) : {};
      await handler(req, res, params, query, body);
    } catch(e) {
      console.error('[ERROR]', e.message);
      if (!rawRes.headersSent) res.status(500).json({ error: '服务器内部错误' });
    }
    break;
  }

  if (!matched && !rawRes.headersSent) {
    res.status(404).json({ error: 'API 路由不存在' });
  }
});

server.listen(PORT, () => {
  const url = `http://127.0.0.1:${PORT}`;
  console.log('');
  console.log('  ✅ 沈阳盛京医疗联盟 · 演示服务已启动');
  console.log(`  📡 地址：${url}`);
  console.log('  🔄 C端与后台操作共用同一内存数据库，修改实时生效');
  console.log('  ℹ️  纯 Node.js 内置模块，无需 npm install');
  console.log('');
  exec(`start ${url}`, () => {});
});
