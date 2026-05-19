const C_DATA = {
  articles: [
    { title: '孩子发脾气时，家长如何做情绪接纳', type: '图文', tag: '情绪管理', summary: '用陪伴、命名情绪和稳定边界，帮助孩子更快恢复。', action: 'c-education-detail' },
    { title: '学习压力识别与家庭支持技巧', type: '视频', tag: '学习压力', summary: '从睡眠、回避和注意力变化识别预警信号。', action: 'c-education-detail' },
    { title: '专家讲座：多动症干预的家庭协同', type: '视频', tag: '专家讲座', summary: '行为训练、校园协作与门诊随访的完整思路。', action: 'c-education-detail' },
  ],
  doctors: [
    { name: '刘敏', title: '主任医师', dept: '儿童心理门诊', skill: '儿童焦虑 / 情绪障碍', score: '4.9', intro: '擅长儿童焦虑、睡眠问题与家庭沟通指导。' },
    { name: '周岚', title: '副主任医师', dept: '发育行为门诊', skill: '多动症 / 学习困难', score: '4.8', intro: '长期从事多动症、注意缺陷和学习压力干预。' },
    { name: '王璇', title: '主治医师', dept: '儿童心理咨询', skill: '社交退缩 / 青春期适应', score: '4.7', intro: '关注青春期心理发展、亲子关系和学校适应。' },
  ],
  appointments: [
    { time: '2026-05-18 09:30', doctor: '刘敏 主任医师', dept: '儿童心理门诊', status: '已预约' },
    { time: '2026-05-07 14:00', doctor: '周岚 副主任医师', dept: '发育行为门诊', status: '已完成' },
  ],
  favorites: [
    { title: '儿童焦虑的早期信号', type: '图文', desc: '从睡眠、饮食和回避行为识别情绪问题。' },
    { title: '门诊前怎么与孩子沟通', type: '视频', desc: '减少就医抵触，让孩子理解看诊过程。' },
  ],
};

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

  Router.register('overview', pageOverview);
  Router.register('c-home', pageCHome);
  Router.register('c-education', pageCEducationList);
  Router.register('c-education-detail', pageCEducationDetail);
  Router.register('c-doctors', pageCDoctors);
  Router.register('c-doctor-detail', pageCDoctorDetail);
  Router.register('c-appointment-confirm', pageCAppointmentConfirm);
  Router.register('c-me', pageCMe);
  Router.register('c-appointments', pageCAppointments);
  Router.register('c-favorites', pageCFavorites);
  Router.register('c-appt-success', pageCApptSuccess);
  Router.register('admin-dashboard', pageAdminDashboard);
  Router.register('admin-slots', pageAdminSlots);
  Router.register('admin-orders', pageAdminOrders);
  Router.register('admin-content', pageAdminContent);

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

/* ── Chip 分类互动 ── */
function filterChips(container, clicked) {
  container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  clicked.classList.add('active');
}

/* ── 医生头像（姓名首字） ── */
function docAvatar(name, size) {
  const s = size || 78;
  const palette = ['#7bc5e6,#5bbfdb', '#60d0b0,#3ebfa0', '#a78fdf,#8b72d4', '#f0b96c,#e8a044', '#79c8b8,#55b8a6'];
  const i = name.charCodeAt(0) % palette.length;
  const r = Math.round(s * 0.26);
  return `<div style="width:${s}px;height:${s}px;border-radius:${r}px;background:linear-gradient(135deg,${palette[i]});display:flex;align-items:center;justify-content:center;color:#fff;font-size:${Math.round(s * 0.38)}px;font-weight:700;flex-shrink:0;letter-spacing:0">${name[0]}</div>`;
}

/* ── 选择排班医生 ── */
function selectAdminDoctor(el) {
  document.querySelectorAll('#adminDoctorList .doctor-list-item').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  const nm = el.querySelector('div').textContent;
  UI.toast('已切换至 ' + nm + ' 的排班视图', 'info');
}

function pageOverview() {
  return `
    <div class="page-header">
      <div>
        <div class="page-title">儿童心理健康服务系统原型</div>
        <div class="page-subtitle">沈阳盛京医疗联盟 · C端家长服务与后台管理联动演示</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" onclick="Router.navigate('c-home')">查看 C端</button>
        <button class="btn btn-primary" onclick="Router.navigate('admin-dashboard')">查看后台</button>
      </div>
    </div>

    <div class="overview-hero">
      <section class="hero-panel">
        <div class="hero-kicker">🌿 专业温馨 · 柔和蓝绿 · 儿童医疗主题</div>
        <div class="hero-title">围绕“科普内容 + 绿色预约 + 随访沉淀”构建完整服务闭环</div>
        <div class="hero-desc">原型覆盖家长/患者端核心触点，以及医院管理员、医生和运营团队的后台协同场景。重点演示从首页入口到预约成功，再到后台订单处理和号源配置的关键流程。</div>
        <div class="hero-actions">
          <button class="btn btn-primary" onclick="Router.navigate('c-home')">演示预约流程</button>
          <button class="btn btn-ghost" onclick="Router.navigate('admin-orders')">查看后台订单链路</button>
        </div>
      </section>
      <section class="metric-stack">
        <div class="metric-item"><span class="muted">C端核心页面</span><strong>8 个</strong></div>
        <div class="metric-item"><span class="muted">后台核心页面</span><strong>4 个</strong></div>
        <div class="metric-item"><span class="muted">主演示链路</span><strong>首页 → 医生 → 预约确认 → 我的预约</strong></div>
      </section>
    </div>

    <div class="journey-grid" style="margin-bottom:24px">
      ${overviewCard('📱', 'C端统一入口', '首页整合心理科普、门诊预约、我的测评、我的预约，并设置常驻紧急求助按钮。', 'c-home')}
      ${overviewCard('🧠', '儿童心理健康科普', '支持分类检索、图文/视频列表、详情页收藏与分享，满足家长自助学习场景。', 'c-education')}
      ${overviewCard('🩺', '心理专科绿色预约', '按擅长领域筛选医生，查看医生详情与周排班，完成预约确认。', 'c-doctors')}
      ${overviewCard('🏥', '后台运营协同', '围绕仪表盘、号源管理、订单管理、内容管理形成医院闭环。', 'admin-dashboard')}
    </div>

    <div class="grid-2">
      <div class="flow-card">
        <div class="card-title" style="margin-bottom:12px">关键演示流程</div>
        <div class="timeline">
          ${timelineRow('家长端预约流程', '首页入口 → 门诊预约 → 医生详情 → 预约确认 → 我的预约')}
          ${timelineRow('家长端科普流程', '首页入口 → 心理科普 → 内容详情 → 收藏/分享 → 我的收藏')}
          ${timelineRow('后台处理流程', '仪表盘 → 号源管理 → 挂号订单 → 科普内容运营')}
        </div>
      </div>
      <div class="flow-card">
        <div class="card-title" style="margin-bottom:12px">设计原则</div>
        <div class="detail-list">
          ${detailListRow('视觉', '圆角、留白、柔和阴影与蓝绿渐变，强化安心与专业感')}
          ${detailListRow('信息层级', '面向家长的入口扁平化，面向后台的操作模块化')}
          ${detailListRow('交互', '关键 CTA 明确，所有主流程均能一步步点击演示')}
          ${detailListRow('信任感', '突出联盟品牌、专家能力、排班透明与订单状态')}
        </div>
      </div>
    </div>`;
}

function pageCHome() {
  const content = `
    <div class="mobile-banner">
      <div class="chip active" style="margin-bottom:10px">沈阳盛京医疗联盟</div>
      <div style="font-size:22px;font-weight:700;line-height:1.35">儿童心理健康服务</div>
      <div class="muted" style="margin-top:8px;line-height:1.7">为家长提供心理科普、绿色预约、测评回顾和紧急支持。</div>
    </div>
    <div class="entry-grid">
      <button class="entry-card primary" onclick="Router.navigate('c-education')">
        <div>📚</div>
        <strong>心理科普</strong>
        <div class="muted">图文与视频内容，帮助家长理解孩子心理状态</div>
      </button>
      <button class="entry-card secondary" onclick="Router.navigate('c-doctors')">
        <div>🩺</div>
        <strong>门诊预约</strong>
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
        <button class="btn btn-sm btn-primary" onclick="Router.navigate('c-education-detail')">去查看</button>
      </div>
    </div>`;

  return renderPatientPage({
    title: '首页统一入口',
    subtitle: '突出联盟品牌、双核心功能和紧急求助。',
    activeTab: 'home',
    content,
    floatingHelp: true,
    notes: [
      '顶部显示联盟品牌与通知入口。',
      '两张核心卡片承接心理科普和门诊预约。',
      '“紧急求助”使用高对比色常驻浮层，便于演示。',
    ],
  });
}

function pageCEducationList() {
  const content = `
    <div class="form-group" style="margin-bottom:12px">
      <input class="form-control" placeholder="搜索科普文章、视频、专家讲座" />
    </div>
    <div class="chip-row" id="eduChips" style="margin-bottom:14px">
      ${['全部', '情绪管理', '学习压力', '专家讲座', '亲子沟通'].map((item, index) => `<span class="chip ${index === 0 ? 'active' : ''}" onclick="filterChips(document.getElementById('eduChips'),this)">${item}</span>`).join('')}
    </div>
    ${C_DATA.articles.map(article => `
      <button class="mobile-list-item" onclick="Router.navigate('${article.action}')">
        <div class="content-thumb"></div>
        <div class="mobile-list-body">
          <div class="chip active" style="margin-bottom:8px;width:max-content">${article.tag} · ${article.type}</div>
          <div style="font-weight:700;line-height:1.5;margin-bottom:6px">${article.title}</div>
          <div class="muted" style="line-height:1.6">${article.summary}</div>
        </div>
      </button>
    `).join('')}`;

  return renderPatientPage({
    title: '心理健康科普',
    subtitle: '支持搜索、横向分类和图文/视频卡片列表。',
    activeTab: 'home',
    content,
    notes: [
      '列表页强调搜索和分类筛选。',
      '卡片支持承载图文与视频两种内容形态。',
      '点击任一卡片可进入详情并完成收藏分享。',
    ],
  });
}

function pageCEducationDetail() {
  const content = `
    <div class="mobile-card" style="overflow:hidden;margin-bottom:14px">
      <div class="content-thumb" style="height:188px;display:flex;align-items:center;justify-content:center;font-size:44px">▶</div>
      <div class="content-card-body">
        <div class="chip active" style="margin-bottom:10px;width:max-content">专家讲座 · 视频</div>
        <div style="font-size:18px;font-weight:700;line-height:1.5;margin-bottom:10px">孩子总说“我不想去学校”，家长怎样分辨是压力还是焦虑？</div>
        <div class="muted" style="line-height:1.8">从情绪表现、作息变化、躯体化反应和亲子沟通四个角度，帮助家长识别孩子的学习压力与焦虑倾向。</div>
      </div>
    </div>
    <div class="mobile-card" style="padding:16px;margin-bottom:14px">
      <div style="font-weight:700;margin-bottom:10px">内容摘要</div>
      <div class="muted" style="line-height:1.8">当孩子出现持续回避上学、睡眠变差、食欲波动或频繁腹痛头痛时，建议尽早进行专业评估。家庭沟通时应避免简单归因为“不懂事”或“偷懒”。</div>
    </div>
    <div class="hero-actions">
      <button class="btn btn-outline" onclick="UI.toast('已收藏到我的收藏')">♡ 收藏</button>
      <button class="btn btn-primary" onclick="UI.toast('分享链接已复制','info')">↗ 分享</button>
    </div>`;

  return renderPatientPage({
    title: '科普详情',
    subtitle: '顶部展示视频/图文主体，底部提供收藏和分享。',
    activeTab: 'home',
    backPage: 'c-education',
    content,
    notes: [
      '适合承载文章、讲座视频或直播回放。',
      '底部操作符合家长二次传播和沉淀场景。',
    ],
  });
}

function pageCDoctors() {
  const content = `
    <div class="chip-row" id="docChips" style="margin-bottom:14px">
      ${['全部科室', '儿童焦虑', '多动症', '学习压力', '睡眠问题'].map((item, index) => `<span class="chip ${index === 0 ? 'active' : ''}" onclick="filterChips(document.getElementById('docChips'),this)">${item}</span>`).join('')}
    </div>
    <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">共 ${C_DATA.doctors.length} 位在职心理专科医生可预约</div>
    <div class="doctor-grid">
      ${C_DATA.doctors.map((doctor, index) => `
        <button class="doctor-card" onclick="Router.navigate('c-doctor-detail')">
          ${docAvatar(doctor.name)}
          <div style="text-align:left;flex:1">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:start">
              <div>
                <div style="font-weight:700;font-size:17px">${doctor.name}</div>
                <div class="muted" style="margin-top:4px">${doctor.title} · ${doctor.dept}</div>
              </div>
              <span class="score-pill">★ ${doctor.score}</span>
            </div>
            <div class="doctor-tags" style="margin:10px 0 8px">
              ${doctor.skill.split(' / ').map(tag => `<span class="chip active">${tag}</span>`).join('')}
            </div>
            <div class="muted" style="line-height:1.6">${doctor.intro}</div>
          </div>
        </button>
      `).join('')}
    </div>`;

  return renderPatientPage({
    title: '心理专科门诊预约',
    subtitle: '支持按科室与擅长领域筛选医生。',
    activeTab: 'reserve',
    content,
    notes: [
      '医生卡片同时承载头像、职称、擅长和评分。',
      '点击医生进入详情页查看完整简介与周排班。',
    ],
  });
}

function pageCDoctorDetail() {
  const doctor = C_DATA.doctors[0];
  const content = `
    <div class="mobile-card" style="padding:18px;margin-bottom:14px">
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:14px">
        ${docAvatar(doctor.name, 92)}
        <div>
          <div style="font-size:18px;font-weight:700">${doctor.name}</div>
          <div class="muted" style="margin:6px 0">${doctor.title} · ${doctor.dept}</div>
          <div class="doctor-tags">
            ${doctor.skill.split(' / ').map(tag => `<span class="chip active">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="muted" style="line-height:1.8">${doctor.intro} 同时具备家庭访谈、量表评估和门诊随访经验，能为家长提供更清晰的干预建议。</div>
    </div>
    <div class="review-card" style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <strong>患者评价</strong>
        <span class="score-pill">★ 4.9</span>
      </div>
      <div class="muted" style="line-height:1.7">“医生沟通非常耐心，能结合孩子学校表现给出具体建议，预约后复诊提醒也很清晰。”</div>
    </div>
    <div class="slot-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <strong>本周可预约时间</strong>
        <span class="status-pill">可预约 12 个号源</span>
      </div>
      <div class="week-slots">
        ${['周一 09:30', '周一 14:00', '周三 10:00', '周三 15:30', '周五 09:00', '周五 10:30', '周六 09:30', '周六 14:00'].map((item, index) => `<button class="time-slot ${index < 5 ? 'active' : ''}" onclick="Router.navigate('c-appointment-confirm')">${item}</button>`).join('')}
      </div>
    </div>`;

  return renderPatientPage({
    title: '医生详情',
    subtitle: '展示完整简介、患者评价和周排班。',
    activeTab: 'reserve',
    backPage: 'c-doctors',
    content,
    notes: [
      '时间段高亮展示可预约号源。',
      '点击任意可预约时段进入预约确认页。',
    ],
  });
}

function pageCAppointmentConfirm() {
  const content = `
    <div class="appointment-summary">
      <div style="font-weight:700;font-size:17px;margin-bottom:10px">已选预约信息</div>
      ${detailListRow('医生', '刘敏 主任医师')}
      ${detailListRow('日期', '2026-05-18')}
      ${detailListRow('时间', '09:30 - 10:00')}
      ${detailListRow('门诊', '儿童心理门诊 2诊室')}
    </div>
    <div class="mobile-card" style="padding:18px;margin-bottom:14px">
      <div class="form-group">
        <label class="form-label">就诊儿童姓名</label>
        <input class="form-control" value="沈小安" />
      </div>
      <div class="form-group">
        <label class="form-label">年龄</label>
        <input class="form-control" value="8 岁" />
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label">主要症状描述</label>
        <textarea class="form-control" rows="4">最近 2 周早晨抗拒上学，睡前情绪紧张，频繁说肚子疼。</textarea>
      </div>
    </div>
    <button class="btn btn-primary btn-lg" style="width:100%" onclick="confirmAppointment()">确认预约</button>`;

  return renderPatientPage({
    title: '预约确认',
    subtitle: '确认医生、日期时间并补充患儿信息。',
    activeTab: 'reserve',
    backPage: 'c-doctor-detail',
    content,
    notes: [
      '表单仅保留演示必须字段，减少原型噪音。',
      '确认后直接跳转“我的预约”，便于串联完整流程。',
    ],
  });
}

function pageCMe() {
  const content = `
    <div class="mobile-banner" style="margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="doctor-avatar" style="width:64px;height:64px;border-radius:20px"></div>
        <div>
          <div style="font-size:18px;font-weight:700">沈妈妈</div>
          <div class="muted" style="margin-top:4px">已绑定患儿 1 人 · 最近一次测评 3 天前</div>
        </div>
      </div>
    </div>
    <button class="mobile-list-item" onclick="Router.navigate('c-appointments')">
      <div class="content-thumb" style="width:88px;height:88px;display:flex;align-items:center;justify-content:center;font-size:28px">📅</div>
      <div class="mobile-list-body">
        <div style="font-weight:700;margin-bottom:6px">我的预约</div>
        <div class="muted">查看待就诊与历史预约，支持取消预约</div>
      </div>
    </button>
    <button class="mobile-list-item" onclick="Router.navigate('c-favorites')">
      <div class="content-thumb" style="width:88px;height:88px;display:flex;align-items:center;justify-content:center;font-size:28px">❤️</div>
      <div class="mobile-list-body">
        <div style="font-weight:700;margin-bottom:6px">我的收藏</div>
        <div class="muted">沉淀关注的科普文章与视频内容</div>
      </div>
    </button>`;

  return renderPatientPage({
    title: '我的',
    subtitle: '承接预约历史、收藏与个人信息。',
    activeTab: 'me',
    content,
    notes: [
      '聚焦两个高频回访场景：我的预约、我的收藏。',
    ],
  });
}

function pageCAppointments() {
  const content = `
    <div class="timeline">
      ${C_DATA.appointments.map((item, index) => `
        <div class="timeline-item">
          <div class="timeline-body">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:start">
              <div>
                <div style="font-weight:700">${item.time}</div>
                <div class="muted" style="margin-top:6px">${item.doctor}</div>
                <div class="muted" style="margin-top:4px">${item.dept}</div>
              </div>
              <span class="status-pill">${item.status}</span>
            </div>
            <div class="hero-actions" style="margin-top:12px">
              <button class="btn btn-outline btn-sm" onclick="UI.toast('已打开订单详情','info')">查看详情</button>
              ${index === 0 ? '<button class="btn btn-danger btn-sm" onclick="UI.confirm(\'确认取消本次预约吗？\', ()=>UI.toast(\'预约已取消\',\'warning\'))">取消预约</button>' : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  return renderPatientPage({
    title: '我的预约',
    subtitle: '使用时间线或列表呈现待就诊与历史订单。',
    activeTab: 'me',
    content,
    notes: [
      '状态采用醒目胶囊标签，便于快速辨识。',
      '保留“查看详情”和“取消预约”操作。',
    ],
  });
}

function pageCFavorites() {
  const content = C_DATA.favorites.map(item => `
    <div class="favorite-item">
      <div class="content-thumb"></div>
      <div class="favorite-body">
        <div class="chip active" style="margin-bottom:8px;width:max-content">${item.type}</div>
        <div style="font-weight:700;margin-bottom:8px;line-height:1.6">${item.title}</div>
        <div class="muted" style="line-height:1.6">${item.desc}</div>
      </div>
    </div>
  `).join('');

  return renderPatientPage({
    title: '我的收藏',
    subtitle: '沉淀文章和视频，方便家长二次阅读。',
    activeTab: 'me',
    content,
    notes: [
      '与科普详情页的收藏动作闭环联动。',
    ],
  });
}

function pageAdminDashboard() {
  const trend = [42, 56, 49, 68, 73, 65, 81];
  return `
    <div class="page-header">
      <div>
        <div class="page-title">后台仪表盘</div>
        <div class="page-subtitle">面向医院管理员与医生的日常运营总览 · ${new Date().toLocaleDateString('zh-CN', {year:'numeric',month:'long',day:'numeric',weekday:'short'})}</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" onclick="UI.toast('数据已同步','success')">刷新数据</button>
      </div>
    </div>

    <div class="stat-grid">
      ${UI.statCard({ value: '86', label: '今日预约数', icon: '📅', color: '#3f8fca', trend: '12%', trendUp: true })}
      ${UI.statCard({ value: '12', label: '待处理订单', icon: '🧾', color: '#4db69f', trend: '4 单', trendUp: false })}
      ${UI.statCard({ value: '37', label: '新增注册用户', icon: '👪', color: '#53b5dd', trend: '9%', trendUp: true })}
      ${UI.statCard({ value: 'Top 5', label: '热门科普文章', icon: '🔥', color: '#f0a53a' })}
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">近 7 天预约趋势</span></div>
        <div class="card-body">
          <div class="trend-chart">
            ${trend.map((value, index) => `
              <div class="trend-bar-wrap">
                <div class="trend-val">${value}</div>
                <div class="trend-bar" style="height:${value * 2}px"></div>
                <div class="trend-day">${['5/9','5/10','5/11','5/12','5/13','5/14','今日'][index]}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">热门科普文章 Top 5</span></div>
        <div class="card-body">
          <div class="detail-list">
            ${[
              '儿童焦虑的早期信号识别',
              '学习压力与睡眠问题关系',
              '多动症家庭训练建议',
              '青春期沟通的 5 个技巧',
              '门诊前如何降低孩子紧张感',
            ].map((title, index) => detailListRow(title, `${1280 - index * 120} 阅读`)).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

function pageAdminSlots() {
  const doctors = [
    { name: '刘敏', meta: '儿童心理门诊 · 焦虑/情绪问题' },
    { name: '周岚', meta: '发育行为门诊 · 多动症/学习困难' },
    { name: '王璇', meta: '心理咨询门诊 · 社交退缩/青春期适应' },
  ];
  return `
    <div class="page-header">
      <div>
        <div class="page-title">号源管理</div>
        <div class="page-subtitle">左侧医生列表，右侧日历排班，支持批量设置上午/下午号源</div>
      </div>
      <div class="page-actions slot-toolbar">
        <button class="btn btn-outline">复制上周排班</button>
        <button class="btn btn-primary" onclick="UI.toast('已批量发布号源')">发布本周号源</button>
      </div>
    </div>

    <div class="admin-scheduler">
      <div class="doctor-list-pane" id="adminDoctorList">
        ${doctors.map((doctor, index) => `
          <button class="doctor-list-item ${index === 0 ? 'active' : ''}" onclick="selectAdminDoctor(this)">
            <div style="font-weight:700;display:flex;align-items:center;gap:10px">${docAvatar(doctor.name, 36)}<span>${doctor.name}</span></div>
            <div class="muted" style="margin-top:8px;line-height:1.6">${doctor.meta}</div>
          </button>
        `).join('')}
      </div>
      <div class="calendar-board">
        <div class="calendar-head">
          <div>时段</div>
          ${['05/18 周一','05/19 周二','05/20 周三','05/21 周四','05/22 周五','05/23 周六','05/24 周日'].map(item => `<div>${item}</div>`).join('')}
        </div>
        ${[
          { name: '上午', value: '09:00 - 12:00', cls: 'filled' },
          { name: '下午', value: '14:00 - 17:00', cls: '' },
        ].map(row => `
          <div class="calendar-row">
            <div><strong>${row.name}</strong><div class="muted" style="margin-top:6px">${row.value}</div></div>
            ${Array.from({ length: 7 }, (_, index) => `
              <div>
                <span class="slot-chip ${row.cls}">${row.name === '上午' ? 18 - index : 12 - (index % 4)} 个号源</span>
                <span class="slot-chip">可预约</span>
                <div style="margin-top:8px"><button class="btn btn-sm btn-outline" onclick="UI.toast('已为 ${row.name} 设置号源','success')">设置时段</button></div>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>`;
}

function pageAdminOrders() {
  const orders = [
    { id: 'SJ20260515001', patient: '沈小安', doctor: '刘敏', time: '2026-05-18 09:30', status: '待就诊' },
    { id: 'SJ20260515002', patient: '周小诺', doctor: '周岚', time: '2026-05-18 14:00', status: '已预约' },
    { id: 'SJ20260515003', patient: '陈乐乐', doctor: '王璇', time: '2026-05-17 10:00', status: '已完成' },
    { id: 'SJ20260515004', patient: '李小可', doctor: '刘敏', time: '2026-05-19 09:00', status: '已取消' },
  ];

  return `
    <div class="page-header">
      <div>
        <div class="page-title">挂号订单管理</div>
        <div class="page-subtitle">按预约日期、医生、患者和订单状态筛选</div>
      </div>
    </div>

    <div class="filter-bar filter-row">
      <input class="form-control" type="date" value="2026-05-15" />
      <input class="form-control" type="date" value="2026-05-22" />
      <input class="form-control" placeholder="医生姓名" />
      <input class="form-control" placeholder="患者姓名" />
      <select class="form-control"><option>全部状态</option><option>已预约</option><option>待就诊</option><option>已完成</option><option>已取消</option></select>
      <button class="btn btn-primary">查询</button>
    </div>

    <div class="card">
      <div class="card-body" style="padding:0">
        ${UI.table({
          columns: [
            { key: 'id', label: '订单 ID' },
            { key: 'patient', label: '患者姓名' },
            { key: 'doctor', label: '预约医生' },
            { key: 'time', label: '预约时间' },
            {
              key: 'status',
              label: '订单状态',
              render: (value) => `<span class="status-pill" style="background:${orderStatusColor(value).bg};color:${orderStatusColor(value).color}">${value}</span>`,
            },
          ],
          rows: orders,
          actions: (row) => `
            <button class="btn btn-ghost btn-sm" onclick="showOrderDetail('${row.id}')">查看详情</button>
            <button class="btn btn-outline btn-sm" style="margin-left:6px" onclick="UI.confirm('确认取消订单 ${row.id} 吗？', ()=>UI.toast('订单已取消','warning'))">取消订单</button>`,
        })}
      </div>
    </div>`;
}

function pageAdminContent() {
  const rows = [
    { title: '儿童焦虑的早期信号识别', type: '图文', time: '2026-05-13 10:20', read: '1,286', status: '已发布' },
    { title: '专家讲座：多动症家庭训练', type: '视频', time: '2026-05-11 15:40', read: '968', status: '已发布' },
    { title: '学习压力下的亲子沟通', type: '图文', time: '2026-05-08 09:30', read: '842', status: '已发布' },
    { title: '门诊前如何帮助孩子减压', type: '视频', time: '2026-05-06 17:00', read: '653', status: '待发布' },
  ];

  return `
    <div class="page-header">
      <div>
        <div class="page-title">科普内容管理</div>
        <div class="page-subtitle">管理已发布的文章与视频内容</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showPublishModal()">＋ 发布新内容</button>
      </div>
    </div>

    <div class="card">
      <div class="card-body" style="padding:0">
        ${UI.table({
          columns: [
            { key: 'title', label: '标题' },
            { key: 'type', label: '类型', type: 'tag' },
            { key: 'time', label: '发布时间' },
            { key: 'read', label: '阅读量' },
            {
              key: 'status',
              label: '状态',
              render: (value) => `<span class="status-pill" style="background:${value === '已发布' ? '#e9f7f0' : '#fff4df'};color:${value === '已发布' ? '#128062' : '#9d6904'}">${value}</span>`,
            },
          ],
          rows,
          actions: (row) => `
            <button class="btn btn-ghost btn-sm" onclick="UI.toast('编辑 ${row.title}','info')">编辑</button>
            <button class="btn btn-outline btn-sm" style="margin-left:6px" onclick="UI.confirm('确认下架“${row.title}”吗？', ()=>UI.toast('内容已下架','warning'))">下架</button>`,
        })}
      </div>
    </div>`;
}

function renderPatientPage({ title, subtitle, content, notes = [], activeTab = 'home', floatingHelp = false, backPage = null }) {
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
          ${floatingHelp ? '<button class="floating-help" onclick="UI.toast(\'已呼起紧急求助热线\',\'warning\')">紧急求助</button>' : ''}
          <div class="phone-bottom-nav">
            ${mobileTab('🏠', '首页', 'c-home', activeTab === 'home')}
            ${mobileTab('🩺', '预约', 'c-doctors', activeTab === 'reserve')}
            ${mobileTab('👨‍👩‍👧', '我的', 'c-me', activeTab === 'me')}
          </div>
        </div>
      </div>
      <div class="prototype-notes">
        <div class="flow-card">
          <div class="card-title" style="margin-bottom:12px">页面说明</div>
          <div class="detail-list">
            ${notes.map((note, index) => detailListRow(`要点 ${index + 1}`, note)).join('')}
          </div>
        </div>
        <div class="flow-card">
          <div class="card-title" style="margin-bottom:12px">推荐演示路径</div>
          <div class="timeline">
            ${timelineRow('预约主链路', '首页 → 门诊预约 → 医生详情 → 预约确认 → 预约成功 → 我的预约')}
            ${timelineRow('科普沉淀链路', '首页 → 心理科普 → 科普详情 → 收藏 → 我的收藏')}
          </div>
        </div>
      </div>
    </div>`;
}

function mobileTab(icon, label, page, active) {
  return `<button class="${active ? 'active' : ''}" onclick="Router.navigate('${page}')"><span>${icon}</span><span>${label}</span></button>`;
}

function quickItem(icon, label, page) {
  const action = page ? `onclick="Router.navigate('${page}')"` : '';
  return `<button class="quick-item" ${action}><span>${icon}</span><span>${label}</span></button>`;
}

function overviewCard(icon, title, desc, page) {
  return `
    <button class="journey-card" onclick="Router.navigate('${page}')">
      <div style="font-size:28px">${icon}</div>
      <strong>${title}</strong>
      <div class="muted" style="line-height:1.7">${desc}</div>
    </button>`;
}

function timelineRow(title, desc) {
  return `
    <div class="timeline-item">
      <div class="timeline-body">
        <div style="font-weight:700;margin-bottom:6px">${title}</div>
        <div class="muted" style="line-height:1.7">${desc}</div>
      </div>
    </div>`;
}

function detailListRow(label, value) {
  return `<div class="detail-list-item"><span class="muted">${label}</span><span>${value}</span></div>`;
}

function orderStatusColor(status) {
  const map = {
    '待就诊': { bg: '#eef6ff', color: '#2d6f9f' },
    '已预约': { bg: '#eaf8f3', color: '#128062' },
    '已完成': { bg: '#eef2f5', color: '#657b8c' },
    '已取消': { bg: '#fff0f2', color: '#d93f5d' },
  };
  return map[status] || { bg: '#eef6ff', color: '#2d6f9f' };
}

function confirmAppointment() {
  Router.navigate('c-appt-success');
}

function pageCApptSuccess() {
  const content = `
    <div style="text-align:center;padding:32px 16px 20px">
      <div class="success-ring">✓</div>
      <div style="font-size:21px;font-weight:700;margin-bottom:8px">预约成功！</div>
      <div class="muted" style="line-height:1.8">已成功预约刘敏主任医师<br/>2026年5月18日 09:30 – 10:00</div>
    </div>
    <div class="appointment-summary" style="margin-bottom:14px">
      ${detailListRow('订单编号', 'SJ20260518001')}
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

  return renderPatientPage({
    title: '预约成功',
    subtitle: '预约已确认，短信通知已发送，流程完整闭环。',
    activeTab: 'reserve',
    content,
    notes: ['预约成功后给出订单号和就诊提醒，引导进入"我的预约"或返回首页，形成完整预约链路闭环。'],
  });
}

function showOrderDetail(orderId) {
  UI.openModal({
    title: `订单详情 · ${orderId}`,
    body: `
      <div class="detail-list">
        ${detailListRow('患者姓名', '沈小安')}
        ${detailListRow('医生', '刘敏 主任医师')}
        ${detailListRow('预约时间', '2026-05-18 09:30')}
        ${detailListRow('状态', '待就诊')}
        ${detailListRow('症状描述', '早晨抗拒上学、睡前紧张、近两周频繁说肚子疼')}
      </div>`,
    footer: `
      <button class="btn btn-outline" onclick="UI.closeModal()">关闭</button>
      <button class="btn btn-primary" onclick="UI.closeModal();UI.toast('已通知门诊前台','success')">通知前台</button>`,
    width: 620,
  });
}

function showPublishModal() {
  UI.openModal({
    title: '发布新内容',
    body: `
      <div class="form-group">
        <label class="form-label">内容标题</label>
        <input class="form-control" placeholder="请输入文章或视频标题" />
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">内容类型</label>
          <select class="form-control"><option>图文</option><option>视频</option></select>
        </div>
        <div class="form-group">
          <label class="form-label">所属分类</label>
          <select class="form-control"><option>情绪管理</option><option>学习压力</option><option>专家讲座</option></select>
        </div>
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label">内容摘要</label>
        <textarea class="form-control" rows="4" placeholder="输入摘要"></textarea>
      </div>`,
    footer: `
      <button class="btn btn-outline" onclick="UI.closeModal()">取消</button>
      <button class="btn btn-primary" onclick="UI.closeModal();UI.toast('内容已创建，待发布')">保存草稿</button>`,
    width: 680,
  });
}
