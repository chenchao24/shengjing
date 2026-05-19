/**
 * nav.js — 动态渲染侧边栏导航
 */
(function () {
  function renderNav() {
    const cfg = window.APP_CONFIG;
    const container = document.getElementById('sidebarNav');
    if (!container) return;

    // 更新 logo 文字
    const logoText = document.querySelector('.logo-text');
    if (logoText) logoText.textContent = cfg.logoText || cfg.title;

    // 更新 document title
    document.title = cfg.title;

    let html = '';
    cfg.nav.forEach(group => {
      html += `<div class="nav-group">`;
      html += `<div class="nav-group-title">${group.group}</div>`;
      group.items.forEach(item => {
        const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
        html += `
          <div class="nav-item" data-page="${item.page}" data-id="${item.id}">
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-label">${item.label}</span>
            ${badge}
          </div>`;
      });
      html += `</div>`;
    });

    container.innerHTML = html;

    // 绑定点击
    container.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', () => {
        const page = el.dataset.page;
        window.Router.navigate(page);
      });
    });
  }

  function setActive(pageId) {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === pageId);
    });
  }

  window.Nav = { renderNav, setActive };
})();
