/**
 * config.js — 全局配置
 * 修改这里来定制系统标题、菜单和路由
 */
window.APP_CONFIG = {
  title: '沈阳盛京医疗联盟 · 儿童心理健康服务系统',
  logoText: '盛京医疗联盟',

  nav: [
    {
      group: '原型总览',
      items: [
        { id: 'overview', label: '项目总览', icon: '🌿', page: 'overview' },
      ]
    },
    {
      group: 'C端应用',
      items: [
        { id: 'c-home', label: '首页入口', icon: '🏠', page: 'c-home' },
        { id: 'c-education', label: '心理科普', icon: '📚', page: 'c-education' },
        { id: 'c-doctors', label: '门诊预约', icon: '🩺', page: 'c-doctors' },
        { id: 'c-me', label: '我的', icon: '👨‍👩‍👧', page: 'c-me' },
      ]
    },
    {
      group: '后台管理',
      items: [
        { id: 'admin-dashboard', label: '仪表盘', icon: '📊', page: 'admin-dashboard' },
        { id: 'admin-slots', label: '号源管理', icon: '🗓', page: 'admin-slots' },
        { id: 'admin-orders', label: '挂号订单', icon: '📋', page: 'admin-orders', badge: '12' },
        { id: 'admin-content', label: '科普内容', icon: '🎬', page: 'admin-content' },
      ]
    }
  ],

  defaultPage: 'overview',
};
