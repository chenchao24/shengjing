/**
 * db/index.js — 内存数据库 + JSON 文件持久化
 */
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'seed.json');

// 启动时从文件加载到内存
let db = {};
try {
  db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
} catch (e) {
  console.error('[DB] 读取种子数据失败:', e.message);
  db = { articles: [], doctors: [], slots: [], appointments: [], favorites: [], users: [] };
}

// 写操作后异步持久化到文件
function persist() {
  fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8', (err) => {
    if (err) console.error('[DB] 写入失败:', err.message);
  });
}

function getAll(table, filter) {
  const rows = db[table] || [];
  if (!filter) return [...rows];
  return rows.filter(row =>
    Object.entries(filter).every(([k, v]) => row[k] === v)
  );
}

function getById(table, id) {
  return (db[table] || []).find(r => r.id === id) || null;
}

function insert(table, item) {
  if (!db[table]) db[table] = [];
  db[table].push(item);
  persist();
  return item;
}

function update(table, id, patch) {
  const row = (db[table] || []).find(r => r.id === id);
  if (!row) return null;
  Object.assign(row, patch);
  persist();
  return row;
}

function remove(table, id) {
  const arr = db[table] || [];
  const idx = arr.findIndex(r => r.id === id);
  if (idx === -1) return false;
  arr.splice(idx, 1);
  persist();
  return true;
}

module.exports = { getAll, getById, insert, update, remove };
