/**
 * api.js — Mock API for GitHub Pages (纯前端，无需后端)
 * 完整实现所有接口逻辑，数据存储在内存中，刷新后重置
 */
window.API = (() => {

  /* ── 内嵌种子数据 ── */
  const SEED = {"articles":[{"id":"a1","title":"孩子发脾气时，家长如何做情绪接纳","type":"图文","tag":"情绪管理","summary":"用陪伴、命名情绪和稳定边界，帮助孩子更快恢复情绪平衡。","reads":1291,"status":"published","createdAt":"2026-05-13T10:20:00.000Z"},{"id":"a2","title":"学习压力识别与家庭支持技巧","type":"视频","tag":"学习压力","summary":"从睡眠、回避和注意力变化识别预警信号，配合校园支持策略。","reads":971,"status":"published","createdAt":"2026-05-11T15:40:00.000Z"},{"id":"a3","title":"专家讲座：多动症干预的家庭协同","type":"视频","tag":"专家讲座","summary":"行为训练、校园协作与门诊随访的完整思路，帮助家长少走弯路。","reads":842,"status":"published","createdAt":"2026-05-08T09:30:00.000Z"},{"id":"a4","title":"门诊前如何帮助孩子减压","type":"视频","tag":"亲子沟通","summary":"减少就医抵触，让孩子理解看诊过程，提升家长沟通信心。","reads":653,"status":"published","createdAt":"2026-05-06T17:00:00.000Z"},{"id":"a5","title":"儿童焦虑的早期信号识别","type":"图文","tag":"情绪管理","summary":"从睡眠、饮食和回避行为识别情绪问题，建立早期预警意识。","reads":512,"status":"published","createdAt":"2026-05-04T14:10:00.000Z"},{"id":"a6","title":"青春期孩子的亲子沟通秘籍","type":"图文","tag":"亲子沟通","summary":"5 个实用沟通技巧，帮助家长与青春期孩子建立信任关系。","reads":0,"status":"draft","createdAt":"2026-05-14T11:00:00.000Z"}],"doctors":[{"id":"1","name":"刘敏","title":"主任医师","dept":"儿童心理门诊","skill":"儿童焦虑 / 情绪障碍","score":"4.9","intro":"擅长儿童焦虑、睡眠问题与家庭沟通指导。同时具备家庭访谈、量表评估和门诊随访经验，能为家长提供清晰的干预建议。"},{"id":"2","name":"周岚","title":"副主任医师","dept":"发育行为门诊","skill":"多动症 / 学习困难","score":"4.8","intro":"长期从事多动症、注意缺陷和学习压力干预。擅长多学科联合评估，帮助家长制定家庭管理方案。"},{"id":"3","name":"王璇","title":"主治医师","dept":"儿童心理咨询","skill":"社交退缩 / 青春期适应","score":"4.7","intro":"关注青春期心理发展、亲子关系和学校适应。擅长认知行为治疗，对拒学、社交回避有丰富的干预经验。"}],"slots":[{"id":"slot-1-2026-05-18-am","doctorId":"1","date":"2026-05-18","period":"am","time":"09:30","total":18,"remain":16},{"id":"slot-1-2026-05-18-pm","doctorId":"1","date":"2026-05-18","period":"pm","time":"14:00","total":12,"remain":12},{"id":"slot-1-2026-05-19-am","doctorId":"1","date":"2026-05-19","period":"am","time":"09:30","total":18,"remain":18},{"id":"slot-1-2026-05-19-pm","doctorId":"1","date":"2026-05-19","period":"pm","time":"14:00","total":12,"remain":10},{"id":"slot-1-2026-05-20-am","doctorId":"1","date":"2026-05-20","period":"am","time":"09:30","total":18,"remain":15},{"id":"slot-1-2026-05-20-pm","doctorId":"1","date":"2026-05-20","period":"pm","time":"14:00","total":12,"remain":12},{"id":"slot-1-2026-05-21-am","doctorId":"1","date":"2026-05-21","period":"am","time":"09:30","total":18,"remain":16},{"id":"slot-1-2026-05-21-pm","doctorId":"1","date":"2026-05-21","period":"pm","time":"14:00","total":12,"remain":11},{"id":"slot-1-2026-05-22-am","doctorId":"1","date":"2026-05-22","period":"am","time":"09:30","total":18,"remain":18},{"id":"slot-1-2026-05-22-pm","doctorId":"1","date":"2026-05-22","period":"pm","time":"14:00","total":12,"remain":12},{"id":"slot-1-2026-05-23-am","doctorId":"1","date":"2026-05-23","period":"am","time":"09:30","total":10,"remain":10},{"id":"slot-1-2026-05-23-pm","doctorId":"1","date":"2026-05-23","period":"pm","time":"14:00","total":10,"remain":10},{"id":"slot-1-2026-05-24-am","doctorId":"1","date":"2026-05-24","period":"am","time":"09:30","total":0,"remain":0},{"id":"slot-1-2026-05-24-pm","doctorId":"1","date":"2026-05-24","period":"pm","time":"14:00","total":0,"remain":0},{"id":"slot-2-2026-05-18-am","doctorId":"2","date":"2026-05-18","period":"am","time":"09:00","total":15,"remain":15},{"id":"slot-2-2026-05-18-pm","doctorId":"2","date":"2026-05-18","period":"pm","time":"14:00","total":10,"remain":9},{"id":"slot-2-2026-05-19-am","doctorId":"2","date":"2026-05-19","period":"am","time":"09:00","total":15,"remain":13},{"id":"slot-2-2026-05-19-pm","doctorId":"2","date":"2026-05-19","period":"pm","time":"14:00","total":10,"remain":10},{"id":"slot-2-2026-05-20-am","doctorId":"2","date":"2026-05-20","period":"am","time":"09:00","total":15,"remain":15},{"id":"slot-2-2026-05-20-pm","doctorId":"2","date":"2026-05-20","period":"pm","time":"14:00","total":10,"remain":8},{"id":"slot-2-2026-05-21-am","doctorId":"2","date":"2026-05-21","period":"am","time":"09:00","total":15,"remain":15},{"id":"slot-2-2026-05-21-pm","doctorId":"2","date":"2026-05-21","period":"pm","time":"14:00","total":10,"remain":10},{"id":"slot-2-2026-05-22-am","doctorId":"2","date":"2026-05-22","period":"am","time":"09:00","total":15,"remain":15},{"id":"slot-2-2026-05-22-pm","doctorId":"2","date":"2026-05-22","period":"pm","time":"14:00","total":10,"remain":10},{"id":"slot-2-2026-05-23-am","doctorId":"2","date":"2026-05-23","period":"am","time":"09:00","total":8,"remain":8},{"id":"slot-2-2026-05-23-pm","doctorId":"2","date":"2026-05-23","period":"pm","time":"14:00","total":8,"remain":8},{"id":"slot-2-2026-05-24-am","doctorId":"2","date":"2026-05-24","period":"am","time":"09:00","total":0,"remain":0},{"id":"slot-2-2026-05-24-pm","doctorId":"2","date":"2026-05-24","period":"pm","time":"14:00","total":0,"remain":0},{"id":"slot-3-2026-05-18-am","doctorId":"3","date":"2026-05-18","period":"am","time":"10:00","total":12,"remain":12},{"id":"slot-3-2026-05-18-pm","doctorId":"3","date":"2026-05-18","period":"pm","time":"15:00","total":8,"remain":7},{"id":"slot-3-2026-05-19-am","doctorId":"3","date":"2026-05-19","period":"am","time":"10:00","total":12,"remain":10},{"id":"slot-3-2026-05-19-pm","doctorId":"3","date":"2026-05-19","period":"pm","time":"15:00","total":8,"remain":8},{"id":"slot-3-2026-05-20-am","doctorId":"3","date":"2026-05-20","period":"am","time":"10:00","total":12,"remain":12},{"id":"slot-3-2026-05-20-pm","doctorId":"3","date":"2026-05-20","period":"pm","time":"15:00","total":8,"remain":6},{"id":"slot-3-2026-05-21-am","doctorId":"3","date":"2026-05-21","period":"am","time":"10:00","total":12,"remain":12},{"id":"slot-3-2026-05-21-pm","doctorId":"3","date":"2026-05-21","period":"pm","time":"15:00","total":8,"remain":8},{"id":"slot-3-2026-05-22-am","doctorId":"3","date":"2026-05-22","period":"am","time":"10:00","total":12,"remain":12},{"id":"slot-3-2026-05-22-pm","doctorId":"3","date":"2026-05-22","period":"pm","time":"15:00","total":8,"remain":8},{"id":"slot-3-2026-05-23-am","doctorId":"3","date":"2026-05-23","period":"am","time":"10:00","total":6,"remain":6},{"id":"slot-3-2026-05-23-pm","doctorId":"3","date":"2026-05-23","period":"pm","time":"15:00","total":6,"remain":6},{"id":"slot-3-2026-05-24-am","doctorId":"3","date":"2026-05-24","period":"am","time":"10:00","total":0,"remain":0},{"id":"slot-3-2026-05-24-pm","doctorId":"3","date":"2026-05-24","period":"pm","time":"15:00","total":0,"remain":0}],"appointments":[{"id":"SJ20260515001","userId":"demo-user","doctorId":"1","slotId":"slot-1-2026-05-18-am","childName":"沈小安","age":"8","symptoms":"最近 2 周早晨抗拒上学，睡前情绪紧张，频繁说肚子疼。","status":"pending","createdAt":"2026-05-15T08:30:00.000Z"},{"id":"SJ20260514002","userId":"demo-user","doctorId":"2","slotId":"slot-2-2026-05-18-pm","childName":"沈小安","age":"8","symptoms":"注意力不集中，上课发呆，作业完成质量下降。","status":"completed","createdAt":"2026-05-07T14:00:00.000Z"},{"id":"SJ20260513003","userId":"demo-user","doctorId":"3","slotId":"slot-3-2026-05-18-pm","childName":"沈小安","age":"8","symptoms":"不愿意和同学交流，课间总是一个人待着。","status":"cancelled","createdAt":"2026-05-13T10:00:00.000Z"}],"favorites":[{"id":"fav1","articleId":"a1","userId":"demo-user","title":"孩子发脾气时，家长如何做情绪接纳","type":"图文","desc":"用陪伴、命名情绪和稳定边界，帮助孩子更快恢复。"},{"id":"fav2","articleId":"a4","userId":"demo-user","title":"门诊前如何帮助孩子减压","type":"视频","desc":"减少就医抵触，让孩子理解看诊过程。"}],"users":[{"id":"demo-user","name":"沈妈妈","phone":"138****8888","childName":"沈小安","childAge":8}]};

  /* ── 深拷贝种子数据到内存 DB ── */
  const db = JSON.parse(JSON.stringify(SEED));

  /* ── DB 基础操作 ── */
  function getAll(table, filter) {
    const rows = db[table] || [];
    if (!filter) return [...rows];
    return rows.filter(row => Object.entries(filter).every(([k, v]) => row[k] === v));
  }
  function getById(table, id) {
    return (db[table] || []).find(r => r.id === id) || null;
  }
  function insert(table, item) {
    if (!db[table]) db[table] = [];
    db[table].push(item);
    return item;
  }
  function update(table, id, patch) {
    const row = (db[table] || []).find(r => r.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    return row;
  }
  function remove(table, id) {
    const arr = db[table] || [];
    const idx = arr.findIndex(r => r.id === id);
    if (idx === -1) return false;
    arr.splice(idx, 1);
    return true;
  }

  /* ── 错误辅助 ── */
  function err(msg, code) {
    const e = new Error(msg);
    e.status = code || 400;
    e.handled = true;
    if (typeof UI !== 'undefined') UI.toast(msg, 'error');
    return e;
  }

  /* ── 路由处理 ── */
  function handle(method, path, body) {
    const [rawPath, qs = ''] = path.split('?');
    const query = {};
    qs.split('&').filter(Boolean).forEach(p => {
      const [k, v] = p.split('=');
      query[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });

    // ── articles ──
    if (method === 'GET' && rawPath === '/articles') {
      let list = getAll('articles');
      if (!query.all) list = list.filter(a => a.status === 'published');
      if (query.tag && query.tag !== '全部') list = list.filter(a => a.tag === query.tag);
      list.sort((a, b) => (b.reads || 0) - (a.reads || 0));
      return list;
    }
    if (method === 'GET' && rawPath.startsWith('/articles/')) {
      const id = rawPath.split('/')[2];
      const a = getById('articles', id);
      if (!a) throw err('文章不存在', 404);
      update('articles', id, { reads: (a.reads || 0) + 1 });
      return { ...a, reads: (a.reads || 0) + 1 };
    }
    if (method === 'POST' && rawPath === '/articles') {
      const { title, type, tag, summary, status = 'published' } = body;
      if (!title || !title.trim()) throw err('标题不能为空');
      return insert('articles', {
        id: 'a' + Date.now(), title: title.trim(),
        type: type || '图文', tag: tag || '情绪管理',
        summary: summary || '', reads: 0, status,
        createdAt: new Date().toISOString(),
      });
    }
    const unpublishM = rawPath.match(/^\/articles\/([^/]+)\/unpublish$/);
    if (method === 'PATCH' && unpublishM) {
      const a = update('articles', unpublishM[1], { status: 'unpublished' });
      if (!a) throw err('文章不存在', 404);
      return a;
    }

    // ── doctors ──
    if (method === 'GET' && rawPath === '/doctors') {
      let list = getAll('doctors');
      if (query.skill && query.skill !== '全部科室')
        list = list.filter(d => d.skill.includes(query.skill));
      return list;
    }
    const doctorSlotsM = rawPath.match(/^\/doctors\/([^/]+)\/slots$/);
    if (method === 'GET' && doctorSlotsM) {
      const slots = getAll('slots', { doctorId: doctorSlotsM[1] });
      slots.sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.period.localeCompare(b.period));
      return slots;
    }
    if (method === 'POST' && doctorSlotsM) {
      const { slots } = body;
      if (!Array.isArray(slots)) throw err('格式错误：slots 必须是数组');
      return slots.map(s => {
        const existing = getAll('slots').find(
          sl => sl.doctorId === doctorSlotsM[1] && sl.date === s.date && sl.period === s.period
        );
        if (existing) return update('slots', existing.id, { total: s.total, remain: s.total });
        return insert('slots', {
          id: `slot-${doctorSlotsM[1]}-${s.date}-${s.period}`,
          doctorId: doctorSlotsM[1], date: s.date, period: s.period,
          time: s.period === 'am' ? '09:30' : '14:00', total: s.total, remain: s.total,
        });
      });
    }
    const doctorM = rawPath.match(/^\/doctors\/([^/]+)$/);
    if (method === 'GET' && doctorM) {
      const d = getById('doctors', doctorM[1]);
      if (!d) throw err('医生不存在', 404);
      return d;
    }

    // ── appointments ──
    const STATUS_LABEL = { pending: '已预约', completed: '已完成', cancelled: '已取消' };
    function enrichAppt(a) {
      const doctor = getById('doctors', a.doctorId);
      const slot   = getById('slots', a.slotId);
      return {
        ...a,
        doctorName:  doctor?.name  || '',
        doctorTitle: doctor?.title || '',
        dept:        doctor?.dept  || '',
        slotInfo:    slot || null,
        displayTime: slot ? `${slot.date} ${slot.time}` : (a.createdAt?.slice(0, 16) || ''),
        statusLabel: STATUS_LABEL[a.status] || a.status,
      };
    }
    if (method === 'GET' && rawPath === '/appointments') {
      const userId = query.userId || 'demo-user';
      return getAll('appointments', { userId }).map(enrichAppt)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    if (method === 'POST' && rawPath === '/appointments') {
      const { doctorId, slotId, childName, age, symptoms, userId = 'demo-user' } = body;
      if (!doctorId || !slotId || !childName) throw err('缺少必要字段：doctorId / slotId / childName');
      const slot = getById('slots', slotId);
      if (!slot) throw err('时段不存在');
      if (slot.remain <= 0) throw err('该时段号源已约满，请选择其他时间');
      update('slots', slotId, { remain: slot.remain - 1 });
      const appt = insert('appointments', {
        id: 'SJ' + Date.now(), userId, doctorId, slotId,
        childName, age: age || '', symptoms: symptoms || '',
        status: 'pending', createdAt: new Date().toISOString(),
      });
      return enrichAppt(appt);
    }
    const cancelM = rawPath.match(/^\/appointments\/([^/]+)\/cancel$/);
    if (method === 'PATCH' && cancelM) {
      const appt = getById('appointments', cancelM[1]);
      if (!appt) throw err('预约不存在', 404);
      if (appt.status === 'cancelled') throw err('该预约已取消');
      const slot = getById('slots', appt.slotId);
      if (slot) update('slots', appt.slotId, { remain: slot.remain + 1 });
      return enrichAppt(update('appointments', cancelM[1], { status: 'cancelled' }));
    }

    // ── favorites ──
    if (method === 'GET' && rawPath === '/favorites') {
      return getAll('favorites', { userId: query.userId || 'demo-user' });
    }
    if (method === 'POST' && rawPath === '/favorites') {
      const { articleId, title, type, desc, userId = 'demo-user' } = body;
      const exists = getAll('favorites').find(f => f.articleId === articleId && f.userId === userId);
      if (exists) return exists;
      return insert('favorites', {
        id: 'fav' + Date.now(), articleId, userId, title, type, desc,
        createdAt: new Date().toISOString(),
      });
    }
    const favDelM = rawPath.match(/^\/favorites\/([^/]+)$/);
    if (method === 'DELETE' && favDelM) {
      remove('favorites', favDelM[1]);
      return { ok: true };
    }

    // ── admin dashboard ──
    if (method === 'GET' && rawPath === '/admin/dashboard') {
      const today        = new Date().toISOString().slice(0, 10);
      const appointments = getAll('appointments');
      const articles     = getAll('articles');
      return {
        todayAppointments: appointments.filter(a => a.createdAt?.startsWith(today)).length,
        pendingOrders:     appointments.filter(a => a.status === 'pending').length,
        totalUsers:        37 + appointments.length,
        topArticles: [...articles].filter(a => a.status === 'published')
          .sort((a, b) => (b.reads || 0) - (a.reads || 0))
          .slice(0, 5).map(a => ({ id: a.id, title: a.title, reads: a.reads || 0 })),
        trend: [42, 56, 49, 68, 73, 65, appointments.length + 20],
      };
    }

    // ── admin orders ──
    if (method === 'GET' && rawPath === '/admin/orders') {
      const { doctor, patient, status, from, to } = query;
      let appts = getAll('appointments').map(a => {
        const doc  = getById('doctors', a.doctorId);
        const slot = getById('slots', a.slotId);
        return {
          ...a,
          doctorName:  doc?.name  || '',
          doctorTitle: doc?.title || '',
          dept:        doc?.dept  || '',
          displayTime: slot ? `${slot.date} ${slot.time}` : (a.createdAt?.slice(0, 16) || ''),
          statusLabel: STATUS_LABEL[a.status] || a.status,
          slotDate:    slot?.date || a.createdAt?.slice(0, 10) || '',
        };
      });
      if (doctor)  appts = appts.filter(a => a.doctorName.includes(doctor));
      if (patient) appts = appts.filter(a => a.childName.includes(patient));
      if (status && status !== '全部状态') {
        const inner = { '已预约': 'pending', '待就诊': 'pending', '已完成': 'completed', '已取消': 'cancelled' };
        appts = appts.filter(a => a.status === (inner[status] || status));
      }
      if (from) appts = appts.filter(a => a.slotDate >= from);
      if (to)   appts = appts.filter(a => a.slotDate <= to);
      return appts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    throw err('接口不存在: ' + method + ' ' + rawPath, 404);
  }

  async function request(method, path, body) {
    try {
      return handle(method, path, body);
    } catch (e) {
      if (!e.handled && typeof UI !== 'undefined') UI.toast(e.message || '请求失败', 'error');
      throw e;
    }
  }

  return {
    get:   (path)       => request('GET',    path),
    post:  (path, body) => request('POST',   path, body),
    patch: (path, body) => request('PATCH',  path, body),
    del:   (path)       => request('DELETE', path),
  };
})();

