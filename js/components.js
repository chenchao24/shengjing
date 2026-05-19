/**
 * components.js — 可复用 UI 组件
 */
window.UI = (function () {

  /** 打开模态框 */
  function openModal({ title = '', body = '', footer = '', width = 520 } = {}) {
    closeModal();
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'modalBackdrop';
    backdrop.innerHTML = `
      <div class="modal" style="width:${width}px">
        <div class="modal-header">
          <span class="modal-title">${title}</span>
          <button class="modal-close" id="modalCloseBtn">✕</button>
        </div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>`;
    document.body.appendChild(backdrop);
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
    return backdrop;
  }

  function closeModal() {
    const el = document.getElementById('modalBackdrop');
    if (el) el.remove();
  }

  /** Toast 提示 */
  function toast(message, type = 'success', duration = 2800) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
      document.body.appendChild(container);
    }

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const colors = {
      success: 'border-left:4px solid #06c270;',
      error:   'border-left:4px solid #f5425d;',
      warning: 'border-left:4px solid #f5a623;',
      info:    'border-left:4px solid #3ab7f8;',
    };

    const el = document.createElement('div');
    el.style.cssText = `background:#fff;border-radius:8px;padding:12px 18px;box-shadow:0 4px 20px rgba(0,0,0,.15);
      display:flex;align-items:center;gap:10px;font-size:13.5px;min-width:240px;max-width:340px;
      animation:slideUp .2s ease;${colors[type] || ''}`;
    el.innerHTML = `<span>${icons[type] || ''}</span><span style="flex:1">${message}</span>`;
    container.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity .3s';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  /** 确认对话框 */
  function confirm(message, onConfirm, title = '确认操作') {
    openModal({
      title,
      body: `<p style="font-size:14px;line-height:1.6;color:#444">${message}</p>`,
      footer: `
        <button class="btn btn-outline" id="confirmCancel">取消</button>
        <button class="btn btn-danger"  id="confirmOk">确认</button>`,
    });
    document.getElementById('confirmCancel').addEventListener('click', closeModal);
    document.getElementById('confirmOk').addEventListener('click', () => { closeModal(); onConfirm?.(); });
  }

  /** 构建统计卡片 HTML */
  function statCard({ value, label, icon, color = '#4f6ef7', trend, trendUp }) {
    const trendHtml = trend !== undefined
      ? `<div class="stat-trend ${trendUp ? 'trend-up' : 'trend-down'}">${trendUp ? '▲' : '▼'} ${trend}</div>`
      : '';
    return `
      <div class="stat-card">
        <div class="stat-icon" style="background:${color}20;color:${color}">${icon}</div>
        <div class="stat-body">
          <div class="stat-value">${value}</div>
          <div class="stat-label">${label}</div>
          ${trendHtml}
        </div>
      </div>`;
  }

  /** 构建表格 HTML */
  function table({ columns = [], rows = [], actions }) {
    const thead = columns.map(c => `<th>${c.label}</th>`).join('') + (actions ? '<th>操作</th>' : '');
    const tbody = rows.map(row => {
      const cells = columns.map(c => {
        const val = row[c.key] ?? '';
        if (c.render) return `<td>${c.render(val, row)}</td>`;
        if (c.type === 'status') return `<td><span class="status status-${val}">${statusLabel(val)}</span></td>`;
        if (c.type === 'tag') return `<td><span class="tag">${val}</span></td>`;
        return `<td>${val}</td>`;
      }).join('');
      const actionCell = actions ? `<td>${actions(row)}</td>` : '';
      return `<tr>${cells}${actionCell}</tr>`;
    }).join('') || `<tr><td colspan="${columns.length + (actions ? 1 : 0)}" style="text-align:center;padding:40px;color:#8590a5">暂无数据</td></tr>`;

    return `<div class="table-wrapper"><table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table></div>`;
  }

  function statusLabel(s) {
    const map = { active: '正常', inactive: '停用', pending: '待审', error: '异常', info: '信息' };
    return map[s] || s;
  }

  /** 分页组件 */
  function pagination({ current = 1, total = 1, onChange } = {}) {
    const el = document.createElement('div');
    el.style.cssText = 'display:flex;align-items:center;justify-content:flex-end;margin-top:16px;gap:8px;';
    el.innerHTML = `<span style="font-size:13px;color:#8590a5">共 ${total} 页</span>`;

    const pg = document.createElement('div');
    pg.className = 'pagination';

    const prev = btn('‹', current <= 1);
    prev.addEventListener('click', () => { if (current > 1) onChange?.(current - 1); });

    const pages = [];
    for (let i = 1; i <= Math.min(total, 7); i++) {
      const b = btn(i, false, i === current);
      b.addEventListener('click', () => onChange?.(i));
      pages.push(b);
    }

    const next = btn('›', current >= total);
    next.addEventListener('click', () => { if (current < total) onChange?.(current + 1); });

    pg.appendChild(prev);
    pages.forEach(p => pg.appendChild(p));
    pg.appendChild(next);
    el.appendChild(pg);
    return el;
  }

  function btn(label, disabled = false, active = false) {
    const b = document.createElement('button');
    b.className = 'page-btn' + (active ? ' active' : '');
    b.textContent = label;
    b.disabled = disabled;
    return b;
  }

  return { openModal, closeModal, toast, confirm, statCard, table, pagination };
})();
