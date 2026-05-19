/**
 * router.js — 极简哈希路由
 */
(function () {
  // 页面注册表：{ pageId: renderFunction }
  const pages = {};

  function register(id, fn) {
    pages[id] = fn;
  }

  function navigate(pageId, push = true) {
    if (push) location.hash = '#' + pageId;
    renderPage(pageId);
  }

  function renderPage(pageId) {
    const cfg = window.APP_CONFIG;
    const id = pageId || cfg.defaultPage;
    const render = pages[id] || pages[cfg.defaultPage];

    const el = document.getElementById('pageContent');
    if (!el) return;

    if (render) {
      el.innerHTML = `<div class="page-anim">${render()}</div>`;
      el.scrollTop = 0;
    } else {
      el.innerHTML = `<div class="empty-state">
        <div class="empty-icon">🚧</div>
        <div class="empty-title">页面开发中</div>
        <div class="empty-desc">「${id}」页面尚未实现，请稍后再试</div>
      </div>`;
    }

    // 更新导航高亮 & 面包屑
    Nav.setActive(id);
    updateBreadcrumb(id);

    // 触发页面 mount 钩子
    document.dispatchEvent(new CustomEvent('page:mounted', { detail: { pageId: id } }));
  }

  const SUB_LABELS = {
    'c-education-detail':     { parent: '心理科普', label: '内容详情' },
    'c-doctor-detail':        { parent: '门诊预约', label: '医生详情' },
    'c-appointment-confirm':  { parent: '医生详情', label: '预约确认' },
    'c-appt-success':         { parent: '预约确认', label: '预约成功' },
    'c-appointments':         { parent: '我的', label: '我的预约' },
    'c-favorites':            { parent: '我的', label: '我的收藏' },
  };

  function updateBreadcrumb(pageId) {
    const cfg = window.APP_CONFIG;
    const el = document.getElementById('breadcrumb');
    if (!el) return;

    let label = pageId;
    cfg.nav.forEach(g => g.items.forEach(i => { if (i.page === pageId) label = i.label; }));

    const sub = SUB_LABELS[pageId];
    if (sub) {
      el.innerHTML = `<span>首页</span><span style="margin:0 6px;opacity:.4">›</span><span>${sub.parent}</span><span style="margin:0 6px;opacity:.4">›</span><span>${sub.label}</span>`;
    } else {
      el.innerHTML = `<span>首页</span><span style="margin:0 6px;opacity:.4">›</span><span>${label}</span>`;
    }
  }

  // hash 变化时触发
  window.addEventListener('hashchange', () => {
    const page = location.hash.replace('#', '') || window.APP_CONFIG.defaultPage;
    renderPage(page);
  });

  window.Router = { register, navigate, renderPage };
})();
