/**
 * api.js — 内嵌 Mock API（GitHub Pages 静态部署版）
 * 数据存于内存，完整模拟后端所有接口，刷新页面重置。
 */
const API = (() => {
  /* ─────────── 初始 Seed 数据 ─────────── */
  const SEED = {
    articles: [
      { id:'a1', title:'孩子发脾气时，家长如何做情绪接纳', type:'图文', tag:'情绪管理', summary:'用陪伴、命名情绪和稳定边界，帮助孩子更快恢复情绪平衡。', reads:1291, status:'published', createdAt:'2026-05-13T10:20:00.000Z' },
      { id:'a2', title:'学习压力识别与家庭支持技巧', type:'视频', tag:'学习压力', summary:'从睡眠、回避和注意力变化识别预警信号，配合校园支持策略。', reads:971, status:'published', createdAt:'2026-05-11T15:40:00.000Z' },
      { id:'a3', title:'专家讲座：多动症干预的家庭协同', type:'视频', tag:'专家讲座', summary:'行为训练、校园协作与门诊随访的完整思路，帮助家长少走弯路。', reads:842, status:'published', createdAt:'2026-05-08T09:30:00.000Z' },
      { id:'a4', title:'门诊前如何帮助孩子减压', type:'视频', tag:'亲子沟通', summary:'减少就医抵触，让孩子理解看诊过程，提升家长沟通信心。', reads:653, status:'published', createdAt:'2026-05-06T17:00:00.000Z' },
      { id:'a5', title:'儿童焦虑的早期信号识别', type:'图文', tag:'情绪管理', summary:'从睡眠、饮食和回避行为识别情绪问题，建立早期预警意识。', reads:512, status:'published', createdAt:'2026-05-04T14:10:00.000Z' },
      { id:'a6', title:'青春期孩子的亲子沟通秘籍', type:'图文', tag:'亲子沟通', summary:'5 个实用沟通技巧，帮助家长与青春期孩子建立信任关系。', reads:0, status:'draft', createdAt:'2026-05-14T11:00:00.000Z' },
    ],
    doctors: [
      { id:'1', name:'刘敏', title:'主任医师', dept:'儿童心理门诊', skill:'儿童焦虑 / 情绪障碍', score:'4.9', intro:'擅长儿童焦虑、睡眠问题与家庭沟通指导。同时具备家庭访谈、量表评估和门诊随访经验，能为家长提供清晰的干预建议。' },
      { id:'2', name:'周岚', title:'副主任医师', dept:'发育行为门诊', skill:'多动症 / 学习困难', score:'4.8', intro:'长期从事多动症、注意缺陷和学习压力干预。擅长多学科联合评估，帮助家长制定家庭管理方案。' },
      { id:'3', name:'王璇', title:'主治医师', dept:'儿童心理咨询', skill:'社交退缩 / 青春期适应', score:'4.7', intro:'关注青春期心理发展、亲子关系和学校适应。擅长认知行为治疗，对拒学、社交回避有丰富的干预经验。' },
    ],
    slots: [
      { id:'slot-1-2026-05-18-am', doctorId:'1', date:'2026-05-18', period:'am', time:'09:30', total:18, remain:16 },
      { id:'slot-1-2026-05-18-pm', doctorId:'1', date:'2026-05-18', period:'pm', time:'14:00', total:12, remain:12 },
      { id:'slot-1-2026-05-19-am', doctorId:'1', date:'2026-05-19', period:'am', time:'09:30', total:18, remain:18 },
      { id:'slot-1-2026-05-19-pm', doctorId:'1', date:'2026-05-19', period:'pm', time:'14:00', total:12, remain:10 },
      { id:'slot-1-2026-05-20-am', doctorId:'1', date:'2026-05-20', period:'am', time:'09:30', total:18, remain:15 },
      { id:'slot-1-2026-05-20-pm', doctorId:'1', date:'2026-05-20', period:'pm', time:'14:00', total:12, remain:12 },
      { id:'slot-1-2026-05-21-am', doctorId:'1', date:'2026-05-21', period:'am', time:'09:30', total:18, remain:16 },
      { id:'slot-1-2026-05-21-pm', doctorId:'1', date:'2026-05-21', period:'pm', time:'14:00', total:12, remain:11 },
      { id:'slot-1-2026-05-22-am', doctorId:'1', date:'2026-05-22', period:'am', time:'09:30', total:18, remain:18 },
      { id:'slot-1-2026-05-22-pm', doctorId:'1', date:'2026-05-22', period:'pm', time:'14:00', total:12, remain:12 },
      { id:'slot-1-2026-05-23-am', doctorId:'1', date:'2026-05-23', period:'am', time:'09:30', total:10, remain:10 },
      { id:'slot-1-2026-05-23-pm', doctorId:'1', date:'2026-05-23', period:'pm', time:'14:00', total:10, remain:10 },
      { id:'slot-1-2026-05-24-am', doctorId:'1', date:'2026-05-24', period:'am', time:'09:30', total:0,  remain:0  },
      { id:'slot-1-2026-05-24-pm', doctorId:'1', date:'2026-05-24', period:'pm', time:'14:00', total:0,  remain:0  },
      { id:'slot-2-2026-05-18-am', doctorId:'2', date:'2026-05-18', period:'am', time:'09:00', total:15, remain:15 },
      { id:'slot-2-2026-05-18-pm', doctorId:'2', date:'2026-05-18', period:'pm', time:'14:00', total:10, remain:9  },
      { id:'slot-2-2026-05-19-am', doctorId:'2', date:'2026-05-19', period:'am', time:'09:00', total:15, remain:13 },
      { id:'slot-2-2026-05-19-pm', doctorId:'2', date:'2026-05-19', period:'pm', time:'14:00', total:10, remain:10 },
      { id:'slot-2-2026-05-20-am', doctorId:'2', date:'2026-05-20', period:'am', time:'09:00', total:15, remain:15 },
      { id:'slot-2-2026-05-20-pm', doctorId:'2', date:'2026-05-20', period:'pm', time:'14:00', total:10, remain:8  },
      { id:'slot-2-2026-05-21-am', doctorId:'2', date:'2026-05-21', period:'am', time:'09:00', total:15, remain:15 },
      { id:'slot-2-2026-05-21-pm', doctorId:'2', date:'2026-05-21', period:'pm', time:'14:00', total:10, remain:10 },
      { id:'slot-2-2026-05-22-am', doctorId:'2', date:'2026-05-22', period:'am', time:'09:00', total:15, remain:15 },
      { id:'slot-2-2026-05-22-pm', doctorId:'2', date:'2026-05-22', period:'pm', time:'14:00', total:10, remain:10 },
      { id:'slot-2-2026-05-23-am', doctorId:'2', date:'2026-05-23', period:'am', time:'09:00', total:8,  remain:8  },
      { id:'slot-2-2026-05-23-pm', doctorId:'2', date:'2026-05-23', period:'pm', time:'14:00', total:8,  remain:8  },
      { id:'slot-2-2026-05-24-am', doctorId:'2', date:'2026-05-24', period:'am', time:'09:00', total:0,  remain:0  },
      { id:'slot-2-2026-05-24-pm', doctorId:'2', date:'2026-05-24', period:'pm', time:'14:00', total:0,  remain:0  },
      { id:'slot-3-2026-05-18-am', doctorId:'3', date:'2026-05-18', period:'am', time:'10:00', total:12, remain:12 },
      { id:'slot-3-2026-05-18-pm', doctorId:'3', date:'2026-05-18', period:'pm', time:'15:00', total:8,  remain:7  },
      { id:'slot-3-2026-05-19-am', doctorId:'3', date:'2026-05-19', period:'am', time:'10:00', total:12, remain:10 },
      { id:'slot-3-2026-05-19-pm', doctorId:'3', date:'2026-05-19', period:'pm', time:'15:00', total:8,  remain:8  },
      { id:'slot-3-2026-05-20-am', doctorId:'3', date:'2026-05-20', period:'am', time:'10:00', total:12, remain:12 },
      { id:'slot-3-2026-05-20-pm', doctorId:'3', date:'2026-05-20', period:'pm', time:'15:00', total:8,  remain:6  },
      { id:'slot-3-2026-05-21-am', doctorId:'3', date:'2026-05-21', period:'am', time:'10:00', total:12, remain:12 },
      { id:'slot-3-2026-05-21-pm', doctorId:'3', date:'2026-05-21', period:'pm', time:'15:00', total:8,  remain:8  },
      { id:'slot-3-2026-05-22-am', doctorId:'3', date:'2026-05-22', period:'am', time:'10:00', total:12, remain:12 },
      { id:'slot-3-2026-05-22-pm', doctorId:'3', date:'2026-05-22', period:'pm', time:'15:00', total:8,  remain:8  },
      { id:'slot-3-2026-05-23-am', doctorId:'3', date:'2026-05-23', period:'am', time:'10:00', total:6,  remain:6  },
      { id:'slot-3-2026-05-23-pm', doctorId:'3', date:'2026-05-23', period:'pm', time:'15:00', total:6,  remain:6  },
      { id:'slot-3-2026-05-24-am', doctorId:'3', date:'2026-05-24', period:'am', time:'10:00', total:0,  remain:0  },
      { id:'slot-3-2026-05-24-pm', doctorId:'3', date:'2026-05-24', period:'pm', time:'15:00', total:0,  remain:0  },
    ],
    appointments: [
      { id:'SJ20260515001', userId:'demo-user', doctorId:'1', slotId:'slot-1-2026-05-18-am', childName:'沈小安', age:'8', symptoms:'最近 2 周早晨抗拒上学，睡前情绪紧张，频繁说肚子疼。', status:'pending',   createdAt:'2026-05-15T08:30:00.000Z' },
      { id:'SJ20260514002', userId:'demo-user', doctorId:'2', slotId:'slot-2-2026-05-18-pm', childName:'沈小安', age:'8', symptoms:'注意力不集中，上课发呆，作业完成质量下降。',             status:'completed', createdAt:'2026-05-07T14:00:00.000Z' },
      { id:'SJ20260513003', userId:'demo-user', doctorId:'3', slotId:'slot-3-2026-05-18-pm', childName:'沈小安', age:'8', symptoms:'不愿意和同学交流，课间总是一个人待着。',               status:'cancelled', createdAt:'2026-05-13T10:00:00.000Z' },
    ],
    favorites: [
      { id:'fav1', articleId:'a1', userId:'demo-user', title:'孩子发脾气时，家长如何做情绪接纳', type:'图文', desc:'用陪伴、命名情绪和稳定边界，帮助孩子更快恢复。' },
      { id:'fav2', articleId:'a4', userId:'demo-user', title:'门诊前如何帮助孩子减压',           type:'视频', desc:'减少就医抵触，让孩子理解看诊过程。' },
    ],
  };

  /* ─────────── 深拷贝初始化内存数据库 ─────────── */
  const _db = JSON.parse(JSON.stringify(SEED));

  /* ─────────── DB 工具 ─────────── */
  function dbGetAll(table, filters) {
    let rows = _db[table] || [];
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') rows = rows.filter(r => r[k] === v);
      });
    }
    return rows;
  }
  function dbGetById(table, id) { return (_db[table] || []).find(r => r.id === id) || null; }
  function dbInsert(table, record) { (_db[table] = _db[table] || []).push(record); return record; }
  function dbUpdate(table, id, changes) {
    const idx = (_db[table] || []).findIndex(r => r.id === id);
    if (idx < 0) return null;
    _db[table][idx] = { ..._db[table][idx], ...changes };
    return _db[table][idx];
  }

  /* ─────────── 富化预约 ─────────── */
  const STATUS_LABEL = { pending:'已预约', completed:'已完成', cancelled:'已取消' };
  function enrichAppt(a) {
    const doctor = dbGetById('doctors', a.doctorId);
    const slot   = dbGetById('slots',   a.slotId);
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

  /* ─────────── 路由分发 ─────────── */
  function dispatch(method, rawPath, body) {
    // 解析 query string
    const [pathOnly, qs] = rawPath.split('?');
    const query = {};
    if (qs) qs.split('&').forEach(pair => { const [k,v] = pair.split('='); if (k) query[decodeURIComponent(k)] = decodeURIComponent(v||''); });

    // ── 文章 ──
    if (method === 'GET' && pathOnly === '/articles') {
      let rows = dbGetAll('articles');
      if (!query.all) rows = rows.filter(a => a.status === 'published');
      if (query.tag && query.tag !== '全部') rows = rows.filter(a => a.tag === query.tag);
      rows.sort((a, b) => (b.reads || 0) - (a.reads || 0));
      return rows;
    }
    const artDetailM = pathOnly.match(/^\/articles\/([^/]+)$/);
    if (method === 'GET' && artDetailM) {
      const art = dbGetById('articles', artDetailM[1]);
      if (!art) throw new Error('文章不存在');
      dbUpdate('articles', art.id, { reads: (art.reads || 0) + 1 });
      return { ...art, reads: (art.reads || 0) + 1 };
    }
    if (method === 'POST' && pathOnly === '/articles') {
      const { title, type = '图文', tag = '情绪管理', summary = '', status = 'published' } = body || {};
      if (!title?.trim()) throw new Error('标题不能为空');
      return dbInsert('articles', { id:'a'+Date.now(), title:title.trim(), type, tag, summary, reads:0, status, createdAt:new Date().toISOString() });
    }
    const artUnpubM = pathOnly.match(/^\/articles\/([^/]+)\/unpublish$/);
    if (method === 'PATCH' && artUnpubM) {
      const updated = dbUpdate('articles', artUnpubM[1], { status:'unpublished' });
      if (!updated) throw new Error('文章不存在');
      return updated;
    }

    // ── 医生 ──
    if (method === 'GET' && pathOnly === '/doctors') return dbGetAll('doctors');
    const docDetailM = pathOnly.match(/^\/doctors\/([^/]+)$/);
    if (method === 'GET' && docDetailM) {
      const doc = dbGetById('doctors', docDetailM[1]);
      if (!doc) throw new Error('医生不存在');
      return doc;
    }
    const docSlotsM = pathOnly.match(/^\/doctors\/([^/]+)\/slots$/);
    if (method === 'GET' && docSlotsM) {
      return dbGetAll('slots', { doctorId: docSlotsM[1] });
    }
    if (method === 'POST' && docSlotsM) {
      const { slots: updates = [] } = body || {};
      updates.forEach(({ date, period, total }) => {
        const existing = (_db.slots || []).find(s => s.doctorId === docSlotsM[1] && s.date === date && s.period === period);
        if (existing) {
          dbUpdate('slots', existing.id, { total: Number(total), remain: Math.min(existing.remain, Number(total)) });
        } else {
          const docInfo = dbGetById('doctors', docSlotsM[1]);
          const timeMap = { '1':{ am:'09:30', pm:'14:00' }, '2':{ am:'09:00', pm:'14:00' }, '3':{ am:'10:00', pm:'15:00' } };
          const t = timeMap[docSlotsM[1]]?.[period] || (period==='am'?'09:00':'14:00');
          dbInsert('slots', { id:`slot-${docSlotsM[1]}-${date}-${period}`, doctorId:docSlotsM[1], date, period, time:t, total:Number(total), remain:Number(total) });
        }
      });
      return dbGetAll('slots', { doctorId: docSlotsM[1] });
    }

    // ── 预约 ──
    if (method === 'GET' && pathOnly === '/appointments') {
      const { userId = 'demo-user' } = query;
      const appts = dbGetAll('appointments', { userId }).map(enrichAppt);
      appts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return appts;
    }
    if (method === 'POST' && pathOnly === '/appointments') {
      const { doctorId, slotId, childName, age = '', symptoms = '', userId = 'demo-user' } = body || {};
      if (!doctorId || !slotId || !childName) throw new Error('缺少必要字段：doctorId / slotId / childName');
      const slot = dbGetById('slots', slotId);
      if (!slot) throw new Error('时段不存在');
      if (slot.remain <= 0) throw new Error('该时段号源已约满，请选择其他时间');
      dbUpdate('slots', slotId, { remain: slot.remain - 1 });
      const appt = dbInsert('appointments', { id:'SJ'+Date.now(), userId, doctorId, slotId, childName, age, symptoms, status:'pending', createdAt:new Date().toISOString() });
      return enrichAppt(appt);
    }
    const cancelM = pathOnly.match(/^\/appointments\/([^/]+)\/cancel$/);
    if (method === 'PATCH' && cancelM) {
      const appt = dbGetById('appointments', cancelM[1]);
      if (!appt) throw new Error('预约不存在');
      if (appt.status === 'cancelled') throw new Error('该预约已取消');
      const slot = dbGetById('slots', appt.slotId);
      if (slot) dbUpdate('slots', appt.slotId, { remain: slot.remain + 1 });
      return enrichAppt(dbUpdate('appointments', cancelM[1], { status:'cancelled' }));
    }

    // ── 收藏 ──
    if (method === 'GET' && pathOnly === '/favorites') {
      const { userId = 'demo-user' } = query;
      return dbGetAll('favorites', { userId });
    }
    if (method === 'POST' && pathOnly === '/favorites') {
      const { articleId, title, type, desc, userId = 'demo-user' } = body || {};
      const exists = (_db.favorites || []).find(f => f.userId === userId && f.articleId === articleId);
      if (exists) return exists;
      return dbInsert('favorites', { id:'fav'+Date.now(), articleId, userId, title, type, desc, createdAt:new Date().toISOString() });
    }

    // ── 后台仪表盘 ──
    if (method === 'GET' && pathOnly === '/admin/dashboard') {
      const today = new Date().toISOString().slice(0, 10);
      const appointments = dbGetAll('appointments');
      const articles     = dbGetAll('articles');
      const topArticles  = [...articles].filter(a => a.status==='published').sort((a,b)=>(b.reads||0)-(a.reads||0)).slice(0,5).map(a=>({ id:a.id, title:a.title, reads:a.reads||0 }));
      return {
        todayAppointments: appointments.filter(a => a.createdAt?.startsWith(today)).length,
        pendingOrders:     appointments.filter(a => a.status==='pending').length,
        totalUsers:        37 + appointments.length,
        topArticles,
        trend: [42, 56, 49, 68, 73, 65, appointments.length + 20],
      };
    }

    // ── 后台订单 ──
    if (method === 'GET' && pathOnly === '/admin/orders') {
      const { doctor='', patient='', status='', from='', to='' } = query;
      let appts = dbGetAll('appointments').map(a => {
        const doc  = dbGetById('doctors', a.doctorId);
        const slot = dbGetById('slots',   a.slotId);
        return { ...a, doctorName:doc?.name||'', doctorTitle:doc?.title||'', dept:doc?.dept||'', displayTime:slot?`${slot.date} ${slot.time}`:(a.createdAt?.slice(0,16)||''), statusLabel:STATUS_LABEL[a.status]||a.status, slotDate:slot?.date||a.createdAt?.slice(0,10)||'' };
      });
      if (doctor)                        appts = appts.filter(a => a.doctorName.includes(doctor));
      if (patient)                       appts = appts.filter(a => a.childName.includes(patient));
      if (status && status !== '全部状态') {
        const inner = { '已预约':'pending','待就诊':'pending','已完成':'completed','已取消':'cancelled' };
        appts = appts.filter(a => a.status === (inner[status]||status));
      }
      if (from) appts = appts.filter(a => a.slotDate >= from);
      if (to)   appts = appts.filter(a => a.slotDate <= to);
      appts.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
      return appts;
    }

    throw new Error('未找到接口: ' + method + ' ' + rawPath);
  }

  /* ─────────── 公共调用接口 ─────────── */
  function request(method, path, body) {
    return new Promise((resolve, reject) => {
      try {
        const result = dispatch(method, path, body);
        resolve(result);
      } catch (e) {
        if (typeof UI !== 'undefined') UI.toast(e.message || '请求失败', 'error');
        reject(e);
      }
    });
  }

  return {
    get:   (path)        => request('GET',    path),
    post:  (path, body)  => request('POST',   path, body),
    patch: (path, body)  => request('PATCH',  path, body),
    del:   (path)        => request('DELETE', path),
  };
})();
