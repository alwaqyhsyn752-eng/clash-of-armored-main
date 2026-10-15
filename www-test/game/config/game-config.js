/* ============================================
   Clash of Armored - General Game Configuration
   ============================================ */
window.GAME_CONFIG = {
  version: '0.1.0',
  title: 'Clash of Armored',
  titleAr: 'كلاش اوف مدرعة',

  // إعدادات الشاشة
  display: {
    fitToScreen: true,
    minWidth: 320,
    maxWidth: 1920,
    orientation: 'landscape', // 'portrait' أو 'landscape'
    pixelRatioCap: 2          // حد DPR لأداء أفضل
  },

  // إعدادات الأداء
  performance: {
    targetFPS: 60,
    maxDT: 2,                 // حد أقصى لدلتا الزمن
    enableVsync: true,
    lowPowerMode: false       // يقلل الجودة عند البطارية المنخفضة
  },

  // إعدادات عامة
  gameplay: {
    autoSaveInterval: 30000,  // كل 30 ثانية
    maxEnemies: 10,
    respawnDelay: 3000
  },

  // معلومات المطور
  meta: {
    author: 'alwaqyhsyn752-eng',
    repo: 'https://github.com/alwaqyhsyn752-eng/clash-of-armored-main'
  }
};

// تحميل الإعدادات المحفوظة من الكاش إن وُجد
if (window.COA && window.COA.cache) {
  const saved = window.COA.cache.get('user_settings');
  if (saved) {
    if (saved.sensitivity)
      window.CONTROLS_CONFIG.sensitivity.rotation =
        window.CONTROLS_CONFIG.ranges.rotation.min +
        (saved.sensitivity / 10) *
        (window.CONTROLS_CONFIG.ranges.rotation.max -
         window.CONTROLS_CONFIG.ranges.rotation.min);
  }
}
