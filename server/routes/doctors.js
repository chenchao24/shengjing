/**
 * routes/doctors.js — 医生 + 号源 API（纯 Node 内置）
 */
module.exports = function doctorsRouter(on, db) {

  // GET /api/doctors  ?skill=
  on('GET', '/api/doctors', (req, res, _p, query) => {
    let doctors = db.getAll('doctors');
    const { skill } = query;
    if (skill && skill !== '全部科室') {
      doctors = doctors.filter(d => d.skill.includes(skill));
    }
    res.json(doctors);
  });

  // GET /api/doctors/:id
  on('GET', '/api/doctors/:id', (req, res, params) => {
    const doctor = db.getById('doctors', params.id);
    if (!doctor) return res.status(404).json({ error: '医生不存在' });
    res.json(doctor);
  });

  // GET /api/doctors/:id/slots
  on('GET', '/api/doctors/:id/slots', (req, res, params) => {
    const slots = db.getAll('slots', { doctorId: params.id });
    slots.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.period.localeCompare(b.period);
    });
    res.json(slots);
  });

  // POST /api/doctors/:id/slots  — 批量设置号源
  on('POST', '/api/doctors/:id/slots', (req, res, params, _q, body) => {
    const { slots } = body;
    if (!Array.isArray(slots)) return res.status(400).json({ error: '格式错误：slots 必须是数组' });

    const result = [];
    slots.forEach(s => {
      const existing = db.getAll('slots').find(
        sl => sl.doctorId === params.id && sl.date === s.date && sl.period === s.period
      );
      if (existing) {
        result.push(db.update('slots', existing.id, { total: s.total, remain: s.total }));
      } else {
        result.push(db.insert('slots', {
          id:       `slot-${params.id}-${s.date}-${s.period}`,
          doctorId: params.id,
          date:     s.date,
          period:   s.period,
          time:     s.period === 'am' ? '09:30' : '14:00',
          total:    s.total,
          remain:   s.total,
        }));
      }
    });
    res.json(result);
  });
};
