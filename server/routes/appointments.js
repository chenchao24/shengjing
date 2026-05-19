/**
 * routes/appointments.js — 预约 API（纯 Node 内置）
 */
module.exports = function appointmentsRouter(on, db) {

  const STATUS_LABEL = { pending: '已预约', completed: '已完成', cancelled: '已取消' };

  function enrichAppt(a) {
    const doctor = db.getById('doctors', a.doctorId);
    const slot   = db.getById('slots',   a.slotId);
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

  // GET /api/appointments  ?userId=demo-user
  on('GET', '/api/appointments', (req, res, _p, query) => {
    const { userId = 'demo-user' } = query;
    let appts = db.getAll('appointments', { userId }).map(enrichAppt);
    appts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json(appts);
  });

  // POST /api/appointments
  on('POST', '/api/appointments', (req, res, _p, _q, body) => {
    const { doctorId, slotId, childName, age, symptoms, userId = 'demo-user' } = body;
    if (!doctorId || !slotId || !childName) {
      return res.status(400).json({ error: '缺少必要字段：doctorId / slotId / childName' });
    }
    const slot = db.getById('slots', slotId);
    if (!slot) return res.status(400).json({ error: '时段不存在' });
    if (slot.remain <= 0) return res.status(400).json({ error: '该时段号源已约满，请选择其他时间' });

    db.update('slots', slotId, { remain: slot.remain - 1 });

    const appt = db.insert('appointments', {
      id: 'SJ' + Date.now(),
      userId, doctorId, slotId,
      childName, age: age || '',
      symptoms: symptoms || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    res.status(201).json(enrichAppt(appt));
  });

  // PATCH /api/appointments/:id/cancel
  on('PATCH', '/api/appointments/:id/cancel', (req, res, params) => {
    const appt = db.getById('appointments', params.id);
    if (!appt) return res.status(404).json({ error: '预约不存在' });
    if (appt.status === 'cancelled') return res.status(400).json({ error: '该预约已取消' });

    const slot = db.getById('slots', appt.slotId);
    if (slot) db.update('slots', appt.slotId, { remain: slot.remain + 1 });

    const updated = db.update('appointments', params.id, { status: 'cancelled' });
    res.json(enrichAppt(updated));
  });
};
