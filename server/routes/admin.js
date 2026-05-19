/**
 * routes/admin.js — 后台 API（纯 Node 内置）
 */
module.exports = function adminRouter(on, db) {

  // GET /api/admin/dashboard
  on('GET', '/api/admin/dashboard', (req, res) => {
    const today        = new Date().toISOString().slice(0, 10);
    const appointments = db.getAll('appointments');
    const articles     = db.getAll('articles');

    const todayCount   = appointments.filter(a => a.createdAt?.startsWith(today)).length;
    const pendingCount = appointments.filter(a => a.status === 'pending').length;

    const topArticles = [...articles]
      .filter(a => a.status === 'published')
      .sort((a, b) => (b.reads || 0) - (a.reads || 0))
      .slice(0, 5)
      .map(a => ({ id: a.id, title: a.title, reads: a.reads || 0 }));

    const trend = [42, 56, 49, 68, 73, 65, appointments.length + 20];

    res.json({
      todayAppointments: todayCount,
      pendingOrders:     pendingCount,
      totalUsers:        37 + appointments.length,
      topArticles,
      trend,
    });
  });

  // GET /api/admin/orders  ?doctor=&patient=&status=&from=&to=
  on('GET', '/api/admin/orders', (req, res, _p, query) => {
    const { doctor, patient, status, from, to } = query;

    let appts = db.getAll('appointments').map(a => {
      const doc  = db.getById('doctors', a.doctorId);
      const slot = db.getById('slots',   a.slotId);
      const statusLabel = { pending: '已预约', completed: '已完成', cancelled: '已取消' };
      return {
        ...a,
        doctorName:  doc?.name  || '',
        doctorTitle: doc?.title || '',
        dept:        doc?.dept  || '',
        displayTime: slot ? `${slot.date} ${slot.time}` : (a.createdAt?.slice(0, 16) || ''),
        statusLabel: statusLabel[a.status] || a.status,
        slotDate:    slot?.date || a.createdAt?.slice(0, 10) || '',
      };
    });

    if (doctor)                         appts = appts.filter(a => a.doctorName.includes(doctor));
    if (patient)                        appts = appts.filter(a => a.childName.includes(patient));
    if (status && status !== '全部状态') {
      const inner = { '已预约': 'pending', '待就诊': 'pending', '已完成': 'completed', '已取消': 'cancelled' };
      appts = appts.filter(a => a.status === (inner[status] || status));
    }
    if (from) appts = appts.filter(a => a.slotDate >= from);
    if (to)   appts = appts.filter(a => a.slotDate <= to);

    appts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json(appts);
  });
};
