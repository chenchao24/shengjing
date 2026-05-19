/**
 * routes/articles.js — 科普内容 API（纯 Node 内置，无 express）
 * on(method, pattern, handler) 由 server/index.js 注入
 */
module.exports = function articlesRouter(on, db) {

  // GET /api/articles  ?tag=  &all=1
  on('GET', '/api/articles', (req, res, _p, query) => {
    let articles = db.getAll('articles');
    const { tag, all } = query;
    if (!all) articles = articles.filter(a => a.status === 'published');
    if (tag && tag !== '全部') articles = articles.filter(a => a.tag === tag);
    articles.sort((a, b) => (b.reads || 0) - (a.reads || 0));
    res.json(articles);
  });

  // GET /api/articles/:id
  on('GET', '/api/articles/:id', (req, res, params) => {
    const article = db.getById('articles', params.id);
    if (!article) return res.status(404).json({ error: '文章不存在' });
    db.update('articles', params.id, { reads: (article.reads || 0) + 1 });
    res.json({ ...article, reads: (article.reads || 0) + 1 });
  });

  // POST /api/articles
  on('POST', '/api/articles', (req, res, _p, _q, body) => {
    const { title, type, tag, summary, status = 'published' } = body;
    if (!title || !title.trim()) return res.status(400).json({ error: '标题不能为空' });
    const article = db.insert('articles', {
      id: 'a' + Date.now(),
      title: title.trim(),
      type:    type    || '图文',
      tag:     tag     || '情绪管理',
      summary: summary || '',
      reads:   0,
      status,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json(article);
  });

  // PATCH /api/articles/:id/unpublish
  on('PATCH', '/api/articles/:id/unpublish', (req, res, params) => {
    const article = db.update('articles', params.id, { status: 'unpublished' });
    if (!article) return res.status(404).json({ error: '文章不存在' });
    res.json(article);
  });
};
