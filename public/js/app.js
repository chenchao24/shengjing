/* ====================================================
 * app.js — 全页面渲染（API 驱动版）
 * 所有数据通过 API.get / API.post 获取
 * ==================================================== */

// ── 全局演示状态 ──
let _selectedDoctorId = '1';   // 当前选中的医生 ID
let _selectedSlot     = null;  // 当前选中的时段对象
let _lastAppt         = null;  // 最近一次创建的预约对象
let _currentArticle   = null;  // 当前查看的文章 ID

// ── 应用初始化 ──
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
  });

  document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      return;
    }
    document.exitFullscreen?.();
  });

  Router.register('overview',               pageOverview);
  Router.register('c-home',                pageCHome);
  Router.register('c-education',           pageCEducationList);
  Router.register('c-education-detail',    pageCEducationDetail);
  Router.register('c-doctors',             pageCDoctors);
  Router.register('c-doctor-detail',       pageCDoctorDetail);
  Router.register('c-appointment-confirm', pageCAppointmentConfirm);
  Router.register('c-me',                  pageCMe);
  Router.register('c-appointments',        pageCAppointments);
  Router.register('c-favorites',           pageCFavorites);
  Router.register('c-appt-success',        pageCApptSuccess);
  Router.register('admin-dashboard',       pageAdminDashboard);
  Router.register('admin-slots',           pageAdminSlots);
  Router.register('admin-orders',          pageAdminOrders);
  Router.register('admin-content',         pageAdminContent);

  Nav.renderNav();
  initTopbarDate();

  const initPage = location.hash.replace('#', '') || APP_CONFIG.defaultPage;
  Router.navigate(initPage, false);
});

/* ── Topbar 日期时钟 ── */
function initTopbarDate() {
  const el = document.getElementById('topbarDate');
  if (!el) return;
  function tick() {
    const now = new Date();
    const d = now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' });
    const t = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    el.textContent = d + '\u2003' + t;
  }
  tick();
  setInterval(tick, 10000);
}

function filterChips(container, clicked) {
  container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  clicked.classList.add('active');
}

function docAvatar(name, size, avatarIdx) {
  const s = size || 78;
  const i = (avatarIdx !== undefined ? avatarIdx : name.charCodeAt(0)) % 4 + 1;
  const r = Math.round(s * 0.26);
  return `<img src="img/h${i}.png" style="width:${s}px;height:${s}px;border-radius:${r}px;object-fit:cover;flex-shrink:0" alt="${name[0]}" />`;
}

function selectAdminDoctor(el, doctorId) {
  document.querySelectorAll('#adminDoctorList .doctor-list-item').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  _selectedDoctorId = doctorId;
  const nm = el.querySelector('span').textContent;
  UI.toast('已切换至 ' + nm + ' 的排班视图', 'info');
  API.get('/doctors/' + doctorId + '/slots').then(slots => {
    const board = document.getElementById('calendarBoard');
    if (board) board.innerHTML = renderSlotCalendar(slots, doctorId);
  });
}

// ─────────────────────────── 页面：原型总览 ───────────────────────────
function pageOverview() {
  return `
    <div class="page-header">
      <div>
        <div class="page-title">儿童心理健康服务系统原型</div>
        <div class="page-subtitle">沈阳盛京医疗联盟 · C端家长服务与后台管理联动演示（数据实时联通）</div>
      </div>
      <div class="page-actions">
        <a class="btn btn-ghost" href="phone-demo.html" target="_blank" style="text-decoration:none">📱 手机演示模拟</a>
        <button class="btn btn-outline" onclick="Router.navigate('c-home')">查看 C端</button>
        <button class="btn btn-primary" onclick="Router.navigate('admin-dashboard')">查看后台</button>
      </div>
    </div>

    <div class="overview-hero">
      <section class="hero-panel">
        <div class="hero-kicker">🌿 专业温馨 · 柔和蓝绿 · 儿童医疗主题</div>
        <div class="hero-title">围绕"科普内容 + 绿色预约 + 随访沉淀"构建完整服务闭环</div>
        <div class="hero-desc">C端预约、收藏操作均通过真实 API 写入数据库，后台可实时看到变化。号源余量动态扣减，文章发布后 C端立即可见。</div>
        <div class="hero-actions">
          <button class="btn btn-primary" onclick="Router.navigate('c-home')">演示预约流程</button>
          <button class="btn btn-ghost" onclick="Router.navigate('admin-orders')">查看后台订单链路</button>
        </div>
        <img src="img/pic7.png" style="width:100%;height:150px;object-fit:cover;border-radius:14px;margin-top:18px" alt="" />
      </section>
      <section class="metric-stack">
        <div class="metric-item"><span class="muted">C端核心页面</span><strong>8 个</strong></div>
        <div class="metric-item"><span class="muted">后台核心页面</span><strong>4 个</strong></div>
        <div class="metric-item"><span class="muted">主演示链路</span><strong>首页 → 医生 → 预约确认 → 我的预约</strong></div>
      </section>
    </div>

    <div class="journey-grid" style="margin-bottom:24px">
      ${overviewCard('📱', 'C端统一入口', '首页整合心理科普、门诊预约、我的测评、我的预约，并设置常驻紧急求助按钮。', 'c-home', 8)}
      ${overviewCard('🧠', '儿童心理健康科普', '支持分类检索、图文/视频列表、详情页收藏，数据来自真实 API。', 'c-education', 9)}
      ${overviewCard('🩺', '心理专科绿色预约', '按擅长领域筛选医生，查看周排班，创建预约后号源实时减少。', 'c-doctors', 10)}
      ${overviewCard('🏥', '后台运营协同', '仪表盘数据、号源管理、订单管理均实时反映 C端操作结果。', 'admin-dashboard', 11)}
    </div>

    <div class="grid-2">
      <div class="flow-card">
        <div class="card-title" style="margin-bottom:12px">关键联动演示</div>
        <div class="timeline">
          ${timelineRow('C端预约 → 后台实时出单', '完成预约后，后台订单管理立即新增，号源 remain--')}
          ${timelineRow('后台发布文章 → C端可见', '后台发布后，C端科普列表刷新即看到新文章')}
          ${timelineRow('C端取消预约 → 号源恢复', '取消后对应时段号源 remain++ 并反映在后台')}
        </div>
      </div>
      <div class="flow-card">
        <div class="card-title" style="margin-bottom:12px">技术架构</div>
        <div class="detail-list">
          ${detailListRow('后端', 'Node.js + Express，JSON 文件数据库')}
          ${detailListRow('API', 'REST /api/*，前后端同进程内存共享')}
          ${detailListRow('前端', '纯 JS async/await + fetch，骨架屏加载态')}
          ${detailListRow('启动', 'npm start 或双击 start.bat')}
        </div>
      </div>
    </div>`;
}

// ─────────────────────────── C端首页 ───────────────────────────
function pageCHome() {
  const content = `
    <div class="mobile-banner">
      <div class="chip active" style="margin-bottom:10px">沈阳盛京医疗联盟</div>
      <div style="font-size:22px;font-weight:700;line-height:1.35">儿童心理健康服务</div>
      <div class="muted" style="margin-top:8px;line-height:1.7">为家长提供心理科普、绿色预约、测评回顾和紧急支持。</div>
      <img src="img/pic2.png" style="width:100%;height:110px;object-fit:cover;border-radius:12px;margin-top:12px" alt="" />
    </div>
    <div class="entry-grid">
      <button class="entry-card primary" onclick="Router.navigate('c-education')">
        <div>📚</div><strong>心理科普</strong>
        <div class="muted">图文与视频内容，帮助家长理解孩子心理状态</div>
      </button>
      <button class="entry-card secondary" onclick="Router.navigate('c-doctors')">
        <div>🩺</div><strong>门诊预约</strong>
        <div class="muted">绿色预约通道，快速匹配儿童心理专科医生</div>
      </button>
    </div>
    <div style="font-weight:600;margin:6px 0 10px">快捷入口</div>
    <div class="quick-grid">
      ${quickItem('🧪', '我的测评')}
      ${quickItem('📅', '我的预约', 'c-appointments')}
      ${quickItem('❤️', '我的收藏', 'c-favorites')}
      ${quickItem('☎️', '咨询热线')}
    </div>
    <div class="flow-card" style="padding:16px;background:linear-gradient(135deg,#fff,#f6fcfa)">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
        <div>
          <div style="font-weight:700">本周推荐</div>
          <div class="muted" style="margin-top:4px">儿童焦虑早筛与家庭沟通专题</div>
        </div>
        <button class="btn btn-sm btn-primary" onclick="openArticle('a1')">去查看</button>
      </div>
    </div>`;
  return renderPatientPage({ title:'首页统一入口', subtitle:'突出联盟品牌、双核心功能和紧急求助。', activeTab:'home', content, floatingHelp:true,
    notes:['顶部显示联盟品牌与通知入口。','两张核心卡片承接心理科普和门诊预约。','"紧急求助"使用高对比色常驻浮层，便于演示。'] });
}

// ─────────────────────────── 科普列表（异步） ───────────────────────────
async function pageCEducationList() {
  const articles = await API.get('/articles');
  const content = `
    <div class="form-group" style="margin-bottom:12px">
      <input class="form-control" placeholder="搜索科普文章、视频、专家讲座" />
    </div>
    <div class="chip-row" id="eduChips" style="margin-bottom:14px">
      ${['全部','情绪管理','学习压力','专家讲座','亲子沟通'].map((item,i) =>
        `<span class="chip ${i===0?'active':''}" onclick="filterChips(document.getElementById('eduChips'),this)">${item}</span>`
      ).join('')}
    </div>
    ${articles.map(a => `
      <button class="mobile-list-item" onclick="openArticle('${a.id}')">
        <img class="content-thumb" src="img/pic${((parseInt(a.id.replace(/\D/g,''))||1)-1)%11+1}.png" alt="" />
        <div class="mobile-list-body">
          <div class="chip active" style="margin-bottom:8px;width:max-content">${a.tag} · ${a.type}</div>
          <div style="font-weight:700;line-height:1.5;margin-bottom:6px">${a.title}</div>
          <div class="muted" style="line-height:1.6">${a.summary}</div>
        </div>
      </button>`).join('')}`;
  return renderPatientPage({ title:'心理健康科普', subtitle:`共 ${articles.length} 篇已发布内容，后台发布后刷新即可见。`, activeTab:'home', content,
    notes:['内容来自真实 API，后台发布后刷新此页即可看到。','卡片支持承载图文与视频两种内容形态。','点击任一卡片可进入详情并完成收藏分享。'] });
}

function openArticle(id) {
  _currentArticle = id;
  Router.navigate('c-education-detail');
}

// ─────────────────────────── 科普详情（异步） ───────────────────────────
async function pageCEducationDetail() {
  let article;
  try {
    article = await API.get('/articles/' + (_currentArticle || 'a1'));
  } catch(_) {
    article = { id:'a1', title:'孩子发脾气时，家长如何做情绪接纳', type:'图文', tag:'情绪管理', summary:'用陪伴、命名情绪和稳定边界，帮助孩子更快恢复情绪平衡。', reads: 1286 };
  }
  const content = `
    <div class="mobile-card" style="overflow:hidden;margin-bottom:14px">
      <div style="height:188px;position:relative;overflow:hidden">
        <img src="img/pic${((parseInt((article.id||'a1').replace(/\D/g,''))||1)-1)%11+1}.png" style="width:100%;height:100%;object-fit:cover;display:block" alt="${article.title}" />
        ${article.type==='视频' ? '<div class="play-overlay">▶</div>' : ''}
      </div>
      <div class="content-card-body">
        <div class="chip active" style="margin-bottom:10px;width:max-content">${article.tag} · ${article.type}</div>
        <div style="font-size:18px;font-weight:700;line-height:1.5;margin-bottom:10px">${article.title}</div>
        <div class="muted" style="line-height:1.8">${article.summary}</div>
        <div class="muted" style="margin-top:8px;font-size:12px">阅读量：${(article.reads||0).toLocaleString()}</div>
      </div>
    </div>
    <div class="mobile-card" style="padding:16px;margin-bottom:14px">
      <div style="font-weight:700;margin-bottom:10px">内容摘要</div>
      <div class="muted" style="line-height:1.8">当孩子出现持续回避上学、睡眠变差、食欲波动或频繁腹痛头痛时，建议尽早进行专业评估。家庭沟通时应避免简单归因为"不懂事"或"偷懒"。</div>
    </div>
    <div class="hero-actions">
      <button class="btn btn-outline" id="favBtn" onclick="toggleFavorite('${article.id}','${article.title.replace(/'/g,"&#39;")}','${article.type}','${article.summary.slice(0,30).replace(/'/g,"&#39;")}')">♡ 收藏</button>
      <button class="btn btn-primary" onclick="UI.toast('分享链接已复制','info')">↗ 分享</button>
    </div>`;
  return renderPatientPage({ title:'科普详情', subtitle:'顶部展示视频/图文主体，底部提供收藏和分享。', activeTab:'home', backPage:'c-education', content,
    notes:['阅读量来自真实 API（每次访问 +1）。','点击收藏后文章被存入收藏列表，可在"我的收藏"查看。'] });
}

async function toggleFavorite(articleId, title, type, desc) {
  try {
    await API.post('/favorites', { articleId, title, type, desc });
    UI.toast('已收藏到我的收藏', 'success');
    const btn = document.getElementById('favBtn');
    if (btn) { btn.textContent = '♥ 已收藏'; btn.disabled = true; }
  } catch(_) {}
}

// ─────────────────────────── 医生列表（异步） ───────────────────────────
async function pageCDoctors() {
  const doctors = await API.get('/doctors');
  const content = `
    <div class="chip-row" id="docChips" style="margin-bottom:14px">
      ${['全部科室','儿童焦虑','多动症','学习压力','睡眠问题'].map((item,i) =>
        `<span class="chip ${i===0?'active':''}" onclick="filterChips(document.getElementById('docChips'),this)">${item}</span>`
      ).join('')}
    </div>
    <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">共 ${doctors.length} 位在职心理专科医生可预约</div>
    <div class="doctor-grid">
      ${doctors.map((d, dIdx) => `
        <button class="doctor-card" onclick="_selectedDoctorId='${d.id}';Router.navigate('c-doctor-detail')">
          ${docAvatar(d.name, undefined, dIdx)}
          <div style="text-align:left;flex:1">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:start">
              <div>
                <div style="font-weight:700;font-size:17px">${d.name}</div>
                <div class="muted" style="margin-top:4px">${d.title} · ${d.dept}</div>
              </div>
              <span class="score-pill">★ ${d.score}</span>
            </div>
            <div class="doctor-tags" style="margin:10px 0 8px">
              ${d.skill.split(' / ').map(t=>`<span class="chip active">${t}</span>`).join('')}
            </div>
            <div class="muted" style="line-height:1.6">${d.intro}</div>
          </div>
        </button>`).join('')}
    </div>`;
  return renderPatientPage({ title:'心理专科门诊预约', subtitle:'数据来自真实 API，点击医生卡片查看周排班。', activeTab:'reserve', content,
    notes:['医生卡片同时承载头像、职称、擅长和评分。','点击医生进入详情页查看完整简介与周排班（API 实时获取）。'] });
}

// ─────────────────────────── 医生详情（异步） ───────────────────────────
async function pageCDoctorDetail() {
  const id = _selectedDoctorId || '1';
  const [doctor, slots] = await Promise.all([
    API.get('/doctors/' + id),
    API.get('/doctors/' + id + '/slots'),
  ]);
  const availableCount = slots.filter(s => s.remain > 0).reduce((sum,s) => sum + s.remain, 0);
  const dayNames = ['日','一','二','三','四','五','六'];

  const content = `
    <div class="mobile-card" style="padding:18px;margin-bottom:14px">
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:14px">
        ${docAvatar(doctor.name, 92, parseInt(doctor.id)-1)}
        <div>
          <div style="font-size:18px;font-weight:700">${doctor.name}</div>
          <div class="muted" style="margin:6px 0">${doctor.title} · ${doctor.dept}</div>
          <div class="doctor-tags">${doctor.skill.split(' / ').map(t=>`<span class="chip active">${t}</span>`).join('')}</div>
        </div>
      </div>
      <div class="muted" style="line-height:1.8">${doctor.intro}</div>
    </div>
    <div class="review-card" style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <strong>患者评价</strong><span class="score-pill">★ ${doctor.score}</span>
      </div>
      <div class="muted" style="line-height:1.7">"医生沟通非常耐心，能结合孩子学校表现给出具体建议，预约后复诊提醒也很清晰。"</div>
    </div>
    <div class="slot-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <strong>本周可预约时间</strong>
        <span class="status-pill">可预约 ${availableCount} 个号源</span>
      </div>
      <div class="week-slots">
        ${slots.slice(0,14).map(slot => {
          const dn = '周' + dayNames[new Date(slot.date).getDay()];
          const available = slot.remain > 0 && slot.total > 0;
          const slotJson = JSON.stringify(slot).replace(/"/g, '&quot;');
          return `<button class="time-slot ${available?'active':'disabled'}" ${available?`onclick="selectSlot(JSON.parse(this.dataset.slot))" data-slot="${slotJson}"`:'disabled title="已约满"'}>
            ${dn} ${slot.time}<br><span style="font-size:10px;opacity:.7">${available?'余'+slot.remain:'已满'}</span>
          </button>`;
        }).join('')}
      </div>
    </div>`;
  return renderPatientPage({ title:'医生详情', subtitle:'展示完整简介、患者评价和周排班（号源实时来自 API）。', activeTab:'reserve', backPage:'c-doctors', content,
    notes:['号源余量来自真实 API，预约后会实时减少。','点击可预约时段进入预约确认页。'] });
}

function selectSlot(slot) {
  _selectedSlot = slot;
  Router.navigate('c-appointment-confirm');
}

// ─────────────────────────── 预约确认 ───────────────────────────
function pageCAppointmentConfirm() {
  const slot  = _selectedSlot;
  const docId = _selectedDoctorId || '1';
  const slotId   = slot ? slot.id   : 'slot-1-2026-05-18-am';
  const slotDate = slot ? slot.date : '2026-05-18';
  const slotTime = slot ? slot.time : '09:30';

  const content = `
    <div class="appointment-summary">
      <div style="font-weight:700;font-size:17px;margin-bottom:10px">已选预约信息</div>
      ${detailListRow('医生编号', docId)}
      ${detailListRow('日期', slotDate)}
      ${detailListRow('时间', slotTime)}
      ${detailListRow('门诊', '儿童心理门诊 2诊室')}
    </div>
    <div class="mobile-card" style="padding:18px;margin-bottom:14px">
      <div class="form-group">
        <label class="form-label">就诊儿童姓名</label>
        <input class="form-control" id="childName" value="沈小安" />
      </div>
      <div class="form-group">
        <label class="form-label">年龄</label>
        <input class="form-control" id="childAge" value="8 岁" />
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label">主要症状描述</label>
        <textarea class="form-control" id="symptoms" rows="4">最近 2 周早晨抗拒上学，睡前情绪紧张，频繁说肚子疼。</textarea>
      </div>
    </div>
    <button class="btn btn-primary btn-lg" style="width:100%" id="confirmBtn"
      onclick="confirmAppointment('${docId}','${slotId}')">确认预约</button>`;
  return renderPatientPage({ title:'预约确认', subtitle:'确认医生、日期时间并补充患儿信息。', activeTab:'reserve', backPage:'c-doctor-detail', content,
    notes:['点击"确认预约"将调用 POST /api/appointments，号源实时扣减。','预约成功后跳转成功页，订单同步出现在后台。'] });
}

async function confirmAppointment(doctorId, slotId) {
  const btn       = document.getElementById('confirmBtn');
  const childName = document.getElementById('childName')?.value || '沈小安';
  const age       = document.getElementById('childAge')?.value  || '8';
  const symptoms  = document.getElementById('symptoms')?.value  || '';
  if (btn) { btn.disabled = true; btn.textContent = '提交中…'; }
  try {
    const appt = await API.post('/appointments', {
      doctorId: doctorId || _selectedDoctorId || '1',
      slotId:   slotId   || _selectedSlot?.id || 'slot-1-2026-05-18-am',
      childName, age, symptoms,
    });
    _lastAppt = appt;
    Router.navigate('c-appt-success');
  } catch(_) {
    if (btn) { btn.disabled = false; btn.textContent = '确认预约'; }
  }
}

// ─────────────────────────── 预约成功 ───────────────────────────
function pageCApptSuccess() {
  const appt       = _lastAppt;
  const doctorName = appt?.doctorName || '刘敏';
  const date       = appt?.slotInfo?.date || '2026-05-18';
  const time       = appt?.slotInfo?.time || '09:30';
  const apptId     = appt?.id            || 'SJ' + Date.now();

  const content = `
    <div style="text-align:center;padding:32px 16px 20px">
      <div class="success-ring">✓</div>
      <div style="font-size:21px;font-weight:700;margin-bottom:8px">预约成功！</div>
      <div class="muted" style="line-height:1.8">已成功预约${doctorName}医师<br/>${date} ${time}</div>
    </div>
    <div class="appointment-summary" style="margin-bottom:14px">
      ${detailListRow('订单编号', apptId)}
      ${detailListRow('就诊地点', '盛京医院儿童心理门诊 2诊室')}
      ${detailListRow('预计候诊', '15 分钟以内')}
    </div>
    <div style="background:#eaf6ff;border-radius:14px;padding:12px 16px;margin-bottom:16px;font-size:12.5px;line-height:1.8;color:#1565c0">
      📩 预约短信已发送至绑定手机，就诊前 2 小时将再次提醒。
    </div>
    <div style="display:grid;gap:10px">
      <button class="btn btn-primary btn-lg" onclick="Router.navigate('c-appointments')">查看我的预约</button>
      <button class="btn btn-outline" onclick="Router.navigate('c-home')">返回首页</button>
    </div>`;
  return renderPatientPage({ title:'预约成功', subtitle:'预约已确认，后台订单同步生成，号源已扣减。', activeTab:'reserve', content,
    notes:['预约数据已真实写入数据库，后台订单管理可立即查看。'] });
}

// ─────────────────────────── 我的 ───────────────────────────
function pageCMe() {
  const content = `
    <div class="mobile-banner" style="margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:12px">
        <img src="img/h4.png" style="width:64px;height:64px;border-radius:20px;object-fit:cover;flex-shrink:0" alt="我的头像" />
        <div>
          <div style="font-size:18px;font-weight:700">沈妈妈</div>
          <div class="muted" style="margin-top:4px">已绑定患儿 1 人 · 最近一次测评 3 天前</div>
        </div>
      </div>
    </div>
    <button class="mobile-list-item" onclick="Router.navigate('c-appointments')">
      <div class="content-thumb" style="width:88px;height:88px;display:flex;align-items:center;justify-content:center;font-size:28px">📅</div>
      <div class="mobile-list-body"><div style="font-weight:700;margin-bottom:6px">我的预约</div><div class="muted">查看待就诊与历史预约，支持取消预约</div></div>
    </button>
    <button class="mobile-list-item" onclick="Router.navigate('c-favorites')">
      <div class="content-thumb" style="width:88px;height:88px;display:flex;align-items:center;justify-content:center;font-size:28px">❤️</div>
      <div class="mobile-list-body"><div style="font-weight:700;margin-bottom:6px">我的收藏</div><div class="muted">沉淀关注的科普文章与视频内容</div></div>
    </button>`;
  return renderPatientPage({ title:'我的', subtitle:'承接预约历史、收藏与个人信息。', activeTab:'me', content,
    notes:['聚焦两个高频回访场景：我的预约、我的收藏。'] });
}

// ─────────────────────────── 我的预约（异步） ───────────────────────────
async function pageCAppointments() {
  const appts = await API.get('/appointments?userId=demo-user');
  const sc = { pending:'#128062,#eaf8f3', completed:'#657b8c,#eef2f5', cancelled:'#d93f5d,#fff0f2' };

  const content = appts.length === 0
    ? `<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-title">暂无预约记录</div><div class="empty-desc">前往门诊预约页面预约专科医生</div><button class="btn btn-primary" style="margin-top:14px" onclick="Router.navigate('c-doctors')">去预约</button></div>`
    : `<div class="timeline">${appts.map((item,i) => {
        const label = item.statusLabel || item.status;
        const [tc,bg] = (sc[item.status]||'#3f8fca,#eef6ff').split(',');
        return `<div class="timeline-item"><div class="timeline-body">
          <div style="display:flex;justify-content:space-between;gap:12px;align-items:start">
            <div>
              <div style="font-weight:700">${item.displayTime}</div>
              <div class="muted" style="margin-top:6px">${item.doctorName} ${item.doctorTitle}</div>
              <div class="muted" style="margin-top:4px">${item.dept}</div>
              <div class="muted" style="margin-top:4px;font-size:12px">患儿：${item.childName}</div>
            </div>
            <span class="status-pill" style="background:${bg};color:${tc}">${label}</span>
          </div>
          <div class="hero-actions" style="margin-top:12px">
            <button class="btn btn-outline btn-sm" onclick="UI.toast('订单 ${item.id}','info')">查看详情</button>
            ${item.status==='pending'?`<button class="btn btn-danger btn-sm" onclick="cancelAppt('${item.id}')">取消预约</button>`:''}
          </div>
        </div></div>`;
      }).join('')}</div>`;

  return renderPatientPage({ title:'我的预约', subtitle:'数据来自真实 API，取消后号源自动恢复。', activeTab:'me', content,
    notes:['状态标签真实反映后端状态。','点击"取消预约"调用 PATCH API，号源自动 +1 并在后台可见。'] });
}

async function cancelAppt(id) {
  if (!confirm('确认取消本次预约吗？取消后号源将自动恢复。')) return;
  try {
    await API.patch('/appointments/' + id + '/cancel');
    UI.toast('预约已取消，号源已恢复', 'warning');
    Router.navigate('c-appointments');
  } catch(_) {}
}

// ─────────────────────────── 我的收藏（异步） ───────────────────────────
async function pageCFavorites() {
  const favs = await API.get('/favorites?userId=demo-user');
  const content = favs.length === 0
    ? `<div class="empty-state"><div class="empty-icon">❤️</div><div class="empty-title">暂无收藏</div><div class="empty-desc">浏览科普内容时点击"收藏"即可沉淀</div><button class="btn btn-primary" style="margin-top:14px" onclick="Router.navigate('c-education')">去浏览科普</button></div>`
    : favs.map(item => `
      <div class="favorite-item">
        <img class="content-thumb" src="img/pic${((parseInt((item.articleId||'a1').replace(/\D/g,''))||1)-1)%11+1}.png" alt="" />
        <div class="favorite-body">
          <div class="chip active" style="margin-bottom:8px;width:max-content">${item.type}</div>
          <div style="font-weight:700;margin-bottom:8px;line-height:1.6">${item.title}</div>
          <div class="muted" style="line-height:1.6">${item.desc}</div>
        </div>
      </div>`).join('');
  return renderPatientPage({ title:'我的收藏', subtitle:`共 ${favs.length} 篇收藏，数据来自真实 API。`, activeTab:'me', content,
    notes:['收藏数据来自 API，在科普详情页点击收藏后此处实时新增。'] });
}

// ─────────────────────────── 后台仪表盘（异步） ───────────────────────────
async function pageAdminDashboard() {
  const data = await API.get('/admin/dashboard');
  return `
    <div class="page-header">
      <div>
        <div class="page-title">后台仪表盘</div>
        <div class="page-subtitle">面向医院管理员与医生的日常运营总览 · ${new Date().toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'short'})}</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" onclick="Router.navigate('admin-dashboard')">刷新数据</button>
      </div>
    </div>
    <div class="stat-grid">
      ${UI.statCard({ value:String(data.todayAppointments), label:'今日新增预约', icon:'📅', color:'#3f8fca', trend:'实时统计', trendUp:true })}
      ${UI.statCard({ value:String(data.pendingOrders), label:'待处理订单', icon:'🧾', color:'#4db69f', trend:'需跟进', trendUp:false })}
      ${UI.statCard({ value:String(data.totalUsers), label:'注册用户数', icon:'👪', color:'#53b5dd', trend:'9%', trendUp:true })}
      ${UI.statCard({ value:'Top 5', label:'热门科普文章', icon:'🔥', color:'#f0a53a' })}
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">近 7 天预约趋势</span></div>
        <div class="card-body">
          <div class="trend-chart">
            ${(data.trend||[]).map((v,i) => `
              <div class="trend-bar-wrap">
                <div class="trend-val">${v}</div>
                <div class="trend-bar" style="height:${v*2}px"></div>
                <div class="trend-day">${['5/9','5/10','5/11','5/12','5/13','5/14','今日'][i]||i}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">热门科普文章 Top 5</span></div>
        <div class="card-body">
          <div class="detail-list">
            ${(data.topArticles||[]).map(a => detailListRow(a.title, `${a.reads.toLocaleString()} 阅读`)).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

// ─────────────────────────── 后台号源管理（异步） ───────────────────────────
async function pageAdminSlots() {
  const doctors = await API.get('/doctors');
  const firstId = doctors[0]?.id || '1';
  const slots   = await API.get('/doctors/' + firstId + '/slots');

  return `
    <div class="page-header">
      <div>
        <div class="page-title">号源管理</div>
        <div class="page-subtitle">左侧医生列表，右侧日历排班，点击"设置时段"可实时修改号源数量</div>
      </div>
      <div class="page-actions slot-toolbar">
        <button class="btn btn-outline">复制上周排班</button>
        <button class="btn btn-primary" onclick="UI.toast('已批量发布号源','success')">发布本周号源</button>
      </div>
    </div>
    <div class="admin-scheduler">
      <div class="doctor-list-pane" id="adminDoctorList">
        ${doctors.map((d,i) => `
          <button class="doctor-list-item ${i===0?'active':''}" onclick="selectAdminDoctor(this,'${d.id}')">
            <div style="font-weight:700;display:flex;align-items:center;gap:10px">${docAvatar(d.name,36,i)}<span>${d.name}</span></div>
            <div class="muted" style="margin-top:8px;line-height:1.6">${d.title} · ${d.dept}</div>
          </button>`).join('')}
      </div>
      <div class="calendar-board" id="calendarBoard">
        ${renderSlotCalendar(slots, firstId)}
      </div>
    </div>`;
}

function renderSlotCalendar(slots, doctorId) {
  const dayNames = ['日','一','二','三','四','五','六'];
  const dates = [...new Set(slots.map(s => s.date))].slice(0,7);
  const headers = dates.map(d => `${d.slice(5).replace('-','/')} 周${dayNames[new Date(d).getDay()]}`);
  const rows = ['am','pm'].map(period => {
    const label = period==='am'?'上午':'下午';
    const time  = period==='am'?'09:00 - 12:00':'14:00 - 17:00';
    return `<div class="calendar-row">
      <div><strong>${label}</strong><div class="muted" style="margin-top:6px">${time}</div></div>
      ${dates.map(date => {
        const slot = slots.find(s => s.date===date && s.period===period);
        if (!slot) return '<div><span class="slot-chip">未设置</span></div>';
        return `<div>
          <span class="slot-chip ${slot.total>0?'filled':''}">${slot.total>0?slot.total+' 个号源':'未开诊'}</span>
          <span class="slot-chip">余 ${slot.remain}</span>
          <div style="margin-top:8px"><button class="btn btn-sm btn-outline" onclick="setSlot('${doctorId}','${date}','${period}',${slot.total})">设置时段</button></div>
        </div>`;
      }).join('')}
    </div>`;
  });
  return `
    <div class="calendar-head"><div>时段</div>${headers.map(h=>`<div>${h}</div>`).join('')}</div>
    ${rows.join('')}`;
}

function setSlot(doctorId, date, period, currentTotal) {
  UI.openModal({
    title: `设置号源 — ${date} ${period==='am'?'上午':'下午'}`,
    body: `<div class="form-group"><label class="form-label">号源数量</label><input class="form-control" id="slotTotal" type="number" min="0" max="50" value="${currentTotal}" /></div>`,
    footer: `<button class="btn btn-outline" onclick="UI.closeModal()">取消</button><button class="btn btn-primary" onclick="saveSlot('${doctorId}','${date}','${period}')">保存</button>`,
    width: 400,
  });
}

async function saveSlot(doctorId, date, period) {
  const total = parseInt(document.getElementById('slotTotal')?.value || '18');
  try {
    await API.post('/doctors/' + doctorId + '/slots', { slots:[{ date, period, total }] });
    UI.closeModal();
    UI.toast(`已更新 ${date} ${period==='am'?'上午':'下午'} 号源为 ${total} 个`, 'success');
    const slots = await API.get('/doctors/' + doctorId + '/slots');
    const board = document.getElementById('calendarBoard');
    if (board) board.innerHTML = renderSlotCalendar(slots, doctorId);
  } catch(_) {}
}

// ─────────────────────────── 后台订单管理（异步） ───────────────────────────
async function pageAdminOrders() {
  const orders = await API.get('/admin/orders');
  return `
    <div class="page-header">
      <div>
        <div class="page-title">挂号订单管理</div>
        <div class="page-subtitle">C端用户预约后实时出单，取消后状态同步更新</div>
      </div>
    </div>
    <div class="filter-bar filter-row">
      <input class="form-control" id="filterFrom" type="date" value="2026-05-15" />
      <input class="form-control" id="filterTo"   type="date" value="2026-05-25" />
      <input class="form-control" id="filterDoc"  placeholder="医生姓名" />
      <input class="form-control" id="filterPat"  placeholder="患者姓名" />
      <select class="form-control" id="filterStatus">
        <option>全部状态</option><option>已预约</option><option>已完成</option><option>已取消</option>
      </select>
      <button class="btn btn-primary" onclick="searchOrders()">查询</button>
    </div>
    <div class="card" id="ordersTable">
      <div class="card-body" style="padding:0">${renderOrdersTable(orders)}</div>
    </div>`;
}

function renderOrdersTable(orders) {
  const sc = { pending:{bg:'#eef6ff',color:'#2d6f9f'}, completed:{bg:'#eef2f5',color:'#657b8c'}, cancelled:{bg:'#fff0f2',color:'#d93f5d'} };
  return UI.table({
    columns:[
      {key:'id',         label:'订单 ID'},
      {key:'childName',  label:'患者姓名'},
      {key:'doctorName', label:'预约医生'},
      {key:'displayTime',label:'预约时间'},
      {key:'status', label:'订单状态', render:(v)=>{
        const c=sc[v]||{bg:'#eef6ff',color:'#2d6f9f'};
        const l={pending:'已预约',completed:'已完成',cancelled:'已取消'}[v]||v;
        return `<span class="status-pill" style="background:${c.bg};color:${c.color}">${l}</span>`;
      }},
    ],
    rows:orders,
    actions:(row)=>`
      <button class="btn btn-ghost btn-sm" onclick="showOrderDetail('${row.id}','${row.childName}','${row.doctorName} ${row.doctorTitle||''}','${row.displayTime}','${(row.symptoms||'').replace(/'/g,'')}')">查看详情</button>
      ${row.status==='pending'?`<button class="btn btn-outline btn-sm" style="margin-left:6px" onclick="adminCancelOrder('${row.id}')">取消订单</button>`:''}`,
  });
}

async function searchOrders() {
  const params = new URLSearchParams({
    from:   document.getElementById('filterFrom')?.value  || '',
    to:     document.getElementById('filterTo')?.value    || '',
    doctor: document.getElementById('filterDoc')?.value   || '',
    patient:document.getElementById('filterPat')?.value   || '',
    status: document.getElementById('filterStatus')?.value|| '',
  }).toString();
  try {
    const orders = await API.get('/admin/orders?' + params);
    const el = document.getElementById('ordersTable');
    if (el) el.innerHTML = `<div class="card-body" style="padding:0">${renderOrdersTable(orders)}</div>`;
    UI.toast(`查询到 ${orders.length} 条订单`, 'info');
  } catch(_) {}
}

async function adminCancelOrder(id) {
  if (!confirm('确认取消此订单吗？')) return;
  try {
    await API.patch('/appointments/' + id + '/cancel');
    UI.toast('订单已取消', 'warning');
    const orders = await API.get('/admin/orders');
    const el = document.getElementById('ordersTable');
    if (el) el.innerHTML = `<div class="card-body" style="padding:0">${renderOrdersTable(orders)}</div>`;
  } catch(_) {}
}

// ─────────────────────────── 后台内容管理（异步） ───────────────────────────
async function pageAdminContent() {
  const rows = await API.get('/articles?all=1');
  return `
    <div class="page-header">
      <div>
        <div class="page-title">科普内容管理</div>
        <div class="page-subtitle">发布后 C端立即可见，下架后 C端列表自动移除</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showPublishModal()">＋ 发布新内容</button>
      </div>
    </div>
    <div class="card" id="contentTable">
      <div class="card-body" style="padding:0">${renderContentTable(rows)}</div>
    </div>`;
}

function renderContentTable(rows) {
  return UI.table({
    columns:[
      {key:'title', label:'标题'},
      {key:'type',  label:'类型', type:'tag'},
      {key:'createdAt', label:'发布时间', render:(v)=>v?v.slice(0,10):''},
      {key:'reads', label:'阅读量', render:(v)=>(v||0).toLocaleString()},
      {key:'status', label:'状态', render:(v)=>{
        const m={published:['已发布','#e9f7f0','#128062'], draft:['草稿','#fff4df','#9d6904'], unpublished:['已下架','#f5f5f5','#888']};
        const [l,bg,c]=m[v]||[v,'#eee','#555'];
        return `<span class="status-pill" style="background:${bg};color:${c}">${l}</span>`;
      }},
    ],
    rows,
    actions:(row)=>`
      <button class="btn btn-ghost btn-sm" onclick="UI.toast('编辑：${row.title.slice(0,8)}…','info')">编辑</button>
      ${row.status==='published'?`<button class="btn btn-outline btn-sm" style="margin-left:6px" onclick="unpublishArticle('${row.id}')">下架</button>`:''}`,
  });
}

async function unpublishArticle(id) {
  if (!confirm('确认下架此文章吗？下架后 C端将不可见。')) return;
  try {
    await API.patch('/articles/' + id + '/unpublish');
    UI.toast('内容已下架', 'warning');
    const rows = await API.get('/articles?all=1');
    const el = document.getElementById('contentTable');
    if (el) el.innerHTML = `<div class="card-body" style="padding:0">${renderContentTable(rows)}</div>`;
  } catch(_) {}
}

function showPublishModal() {
  UI.openModal({
    title: '发布新内容',
    body: `
      <div class="form-group">
        <label class="form-label">内容标题</label>
        <input class="form-control" id="newTitle" placeholder="请输入文章或视频标题" />
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">内容类型</label>
          <select class="form-control" id="newType"><option>图文</option><option>视频</option></select>
        </div>
        <div class="form-group">
          <label class="form-label">所属分类</label>
          <select class="form-control" id="newTag"><option>情绪管理</option><option>学习压力</option><option>专家讲座</option><option>亲子沟通</option></select>
        </div>
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label">内容摘要</label>
        <textarea class="form-control" id="newSummary" rows="4" placeholder="输入摘要"></textarea>
      </div>`,
    footer: `
      <button class="btn btn-outline" onclick="UI.closeModal()">取消</button>
      <button class="btn btn-outline" onclick="publishArticle('draft')">保存草稿</button>
      <button class="btn btn-primary" onclick="publishArticle('published')">立即发布</button>`,
    width: 680,
  });
}

async function publishArticle(status) {
  const title   = document.getElementById('newTitle')?.value   || '';
  const type    = document.getElementById('newType')?.value    || '图文';
  const tag     = document.getElementById('newTag')?.value     || '情绪管理';
  const summary = document.getElementById('newSummary')?.value || '';
  if (!title.trim()) { UI.toast('标题不能为空', 'error'); return; }
  try {
    await API.post('/articles', { title, type, tag, summary, status });
    UI.closeModal();
    UI.toast(status==='published'?'内容已发布，C端科普列表实时可见':'已保存为草稿', 'success');
    const rows = await API.get('/articles?all=1');
    const el = document.getElementById('contentTable');
    if (el) el.innerHTML = `<div class="card-body" style="padding:0">${renderContentTable(rows)}</div>`;
  } catch(_) {}
}

// ─────────────────────────── renderPatientPage ───────────────────────────
function renderPatientPage({ title, subtitle, content, notes=[], activeTab='home', floatingHelp=false, backPage=null }) {
  const phoneHeader = backPage
    ? `<div class="phone-back-bar">
        <button class="phone-back-btn" onclick="Router.navigate('${backPage}')">← 返回</button>
        <span style="font-weight:600;font-size:14px">${title}</span>
        <span style="width:54px"></span>
      </div>`
    : `<div class="app-brand">
        <div style="display:flex;gap:12px;align-items:center">
          <div class="brand-mark">盛</div>
          <div>
            <div style="font-weight:700">沈阳盛京医疗联盟</div>
            <div class="muted" style="font-size:12px;margin-top:4px">儿童心理健康服务</div>
          </div>
        </div>
        <button class="icon-btn" onclick="UI.toast('已联系值班护士','info')">☎</button>
      </div>`;
  return `
    <div class="page-header">
      <div>
        <div class="page-title">${title}</div>
        <div class="page-subtitle">${subtitle}</div>
      </div>
      <div class="page-actions flow-links">
        <button class="btn btn-outline btn-sm" onclick="Router.navigate('c-home')">首页</button>
        <button class="btn btn-outline btn-sm" onclick="Router.navigate('c-doctors')">门诊预约</button>
        <button class="btn btn-outline btn-sm" onclick="Router.navigate('c-me')">我的</button>
      </div>
    </div>
    <div class="phone-stage">
      <div class="phone-shell">
        <div class="phone-status"><span>9:41</span><span>5G 98%</span></div>
        <div class="phone-screen">
          <div class="phone-top">${phoneHeader}</div>
          <div class="phone-content">${content}</div>
          ${floatingHelp?'<button class="floating-help" onclick="UI.toast(\'已呼起紧急求助热线\',\'warning\')">紧急求助</button>':''}
          <div class="phone-bottom-nav">
            ${mobileTab('🏠','首页','c-home',activeTab==='home')}
            ${mobileTab('🩺','预约','c-doctors',activeTab==='reserve')}
            ${mobileTab('👨‍👩‍👧','我的','c-me',activeTab==='me')}
          </div>
        </div>
      </div>
      <div class="prototype-notes">
        <div class="flow-card">
          <div class="card-title" style="margin-bottom:12px">页面说明</div>
          <div class="detail-list">
            ${notes.map((note,i) => detailListRow(`要点 ${i+1}`, note)).join('')}
          </div>
        </div>
        <div class="flow-card">
          <div class="card-title" style="margin-bottom:12px">推荐演示路径</div>
          <div class="timeline">
            ${timelineRow('预约主链路','首页 → 门诊预约 → 医生详情 → 预约确认 → 预约成功 → 我的预约')}
            ${timelineRow('科普沉淀链路','首页 → 心理科普 → 科普详情 → 收藏 → 我的收藏')}
          </div>
        </div>
      </div>
    </div>`;
}

// ─────────────────────────── Modal 工具 ───────────────────────────
function showOrderDetail(id, patient, doctor, time, symptoms) {
  UI.openModal({
    title: `订单详情 · ${id}`,
    body: `<div class="detail-list">
      ${detailListRow('患者姓名', patient)}
      ${detailListRow('医生', doctor)}
      ${detailListRow('预约时间', time)}
      ${detailListRow('症状描述', symptoms || '未填写')}
    </div>`,
    footer: `
      <button class="btn btn-outline" onclick="UI.closeModal()">关闭</button>
      <button class="btn btn-primary" onclick="UI.closeModal();UI.toast('已通知门诊前台','success')">通知前台</button>`,
    width: 620,
  });
}

// ─────────────────────────── 小工具 ───────────────────────────
function mobileTab(icon, label, page, active) {
  return `<button class="${active?'active':''}" onclick="Router.navigate('${page}')"><span>${icon}</span><span>${label}</span></button>`;
}

function quickItem(icon, label, page) {
  const action = page ? `onclick="Router.navigate('${page}')"` : '';
  return `<button class="quick-item" ${action}><span>${icon}</span><span>${label}</span></button>`;
}

function overviewCard(icon, title, desc, page, picN) {
  return `<button class="journey-card" onclick="Router.navigate('${page}')">
    ${picN ? `<img class="journey-card-thumb" src="img/pic${picN}.png" alt="" />` : `<div style="font-size:28px">${icon}</div>`}
    <strong>${title}</strong>
    <div class="muted" style="line-height:1.7">${desc}</div>
  </button>`;
}

function timelineRow(title, desc) {
  return `<div class="timeline-item"><div class="timeline-body">
    <div style="font-weight:700;margin-bottom:6px">${title}</div>
    <div class="muted" style="line-height:1.7">${desc}</div>
  </div></div>`;
}

function detailListRow(label, value) {
  return `<div class="detail-list-item"><span class="muted">${label}</span><span>${value}</span></div>`;
}
