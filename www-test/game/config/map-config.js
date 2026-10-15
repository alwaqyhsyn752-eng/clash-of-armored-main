/* ============================================
   Clash of Armored - Map Configuration
   ============================================ */
window.MAP_CONFIG = {
  // الخريطة الأولى
  map_01: {
    id: 'map_01',
    name: 'ساحة التدريب',
    nameEn: 'Training Ground',
    difficulty: 1,

    // الأبعاد
    width: 1200,
    height: 1600,
    gridSize: 50,

    // الألوان
    bgColor: '#0d0d0d',
    gridColor: 'rgba(90, 110, 61, 0.25)',
    borderColor: '#ff7b00',

    // نقطة ظهور المدرعة
    playerSpawn: {
      x: 575,
      y: 1400,
      rotation: 0 // متجه للأعلى
    },

    // العقبات (جدران/صناديق)
    obstacles: [
      { x: 200, y: 300,  w: 80,  h: 80,  type: 'crate' },
      { x: 900, y: 300,  w: 80,  h: 80,  type: 'crate' },
      { x: 550, y: 700,  w: 100, h: 200, type: 'wall'  },
      { x: 150, y: 1000, w: 120, h: 60,  type: 'wall'  },
      { x: 930, y: 1000, w: 120, h: 60,  type: 'wall'  }
    ],

    // نقاط ظهور الأعداء
    enemySpawns: [
      { x: 200, y: 100, type: 'scout' },
      { x: 1000, y: 100, type: 'scout' }
    ],

    // موارد الخريطة
    resources: {
      ambient: '#3d4a2b',
      fogEnabled: false,
      lightingEffect: false
    }
  },

  // إعدادات عامة لكل الخرائط
  defaults: {
    gridSize: 50,
    bgColor: '#0d0d0d',
    borderColor: '#ff7b00'
  }
};
