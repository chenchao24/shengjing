/**
 * router.js — 极简哈希路由
 */
(function () {
  // 页面注册表：{ pageId: renderFunction }
  const pages = {};

  function skeletonPage() {
    return `<div style="padding:24px">
      <div class="skeleton" style="width:220px;height:28px;margin-bottom:8px;border-radius:8px"></div>
      <div class="skeleton" style="width:320px;height:16px;margin-bottom:24px;border-radius:6px"></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
        ${Array.from({length:4}).map(()=>`<div class="skeleton" style="height:100px;border-radius:14px"></div>`).join('')}
      </div>
      ${Array.from({length:3}).map(()=>`<div class="skeleton" style="height:72px;border-radius:12px;margin-bottom:12px"></div>`).join('')}
    </div>`;
  }

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
      const result = render();
      if (result && typeof result.then === 'function') {
        // 异步页面：先显示骨架屏，等待数据返回后替换
        el.innerHTML = `<div class="page-anim"><div class="skeleton-page">${skeletonPage()}</div></div>`;
        result.then(html => {
          el.innerHTML = `<div class="page-anim">${html}</div>`;
          el.scrollTop = 0;
          Nav.setActive(id);
          updateBreadcrumb(id);
        }).catch(() => {
          el.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-title">加载失败</div><div class="empty-desc">请检查服务是否正常运行</div></div>`;
        });
      } else {
        el.innerHTML = `<div class="page-anim">${result}</div>`;
        el.scrollTop = 0;
      }
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
