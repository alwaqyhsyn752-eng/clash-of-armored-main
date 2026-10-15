/* ============================================
   Clash of Armored - Controls Configuration
   الإعدادات الكاملة: الحساسية + الصوت + الشاشة
   ============================================ */
window.CONTROLS_CONFIG = {

  /* ===== 1) حساسية الحركة ===== */
  sensitivity: {
    rotation: 0.05,      // سرعة الدوران
    moveSpeed: 3,        // سرعة الحركة للأمام/الخلف
    acceleration: 0.8,   // تسريع سلس
    deadZone: 0.1        // منطقة ميتة للعصا
  },

  /* نطاقات التعديل من واجهة الإعدادات */
  ranges: {
    sensitivity: { min: 1, max: 10, default: 5 },
    rotation:    { min: 0.01, max: 0.15, default: 0.05 },
    moveSpeed:   { min: 1, max: 8, default: 3 }
  },

  /* ===== 2) إعدادات الصوت ===== */
  audio: {
    masterVolume: 0.7,    // 0.0 إلى 1.0
    musicVolume: 0.5,     // الموسيقى الخلفية
    sfxVolume: 0.8,       // المؤثرات الصوتية
    muted: false,         // كتم عام
    musicEnabled: true,
    sfxEnabled: true,

    // نطاقات التعديل
    ranges: {
      masterVolume: { min: 0, max: 1, step: 0.1, default: 0.7 },
      musicVolume:  { min: 0, max: 1, step: 0.1, default: 0.5 },
      sfxVolume:    { min: 0, max: 1, step: 0.1, default: 0.8 }
    },

    // أسماء ملفات الصوت (سنستخدمها لاحقاً في clash-cache)
    sounds: {
      fire:     'fire.mp3',
      explosion:'explosion.mp3',
      engine:   'engine.mp3',
      hit:      'hit.mp3',
      click:    'click.mp3'
    }
  },

  /* ===== 3) إعدادات الشاشة للهاتف ===== */
  screen: {
    // الوضع الافتراضي
    orientation: 'landscape',   // 'portrait' أو 'landscape'

    // القياسات المرجعية
    referenceWidth: 1280,
    referenceHeight: 720,

    // الحجم الفعلي (يُحدّث تلقائياً عند التشغيل)
    currentWidth:  0,
    currentHeight: 0,
    devicePixelRatio: 1,

    // حدود الدقة لأداء أفضل
    pixelRatioCap: 2,           // لا يزيد DPR عن 2 حتى على شاشات 3x
    minCanvasWidth: 320,
    minCanvasHeight: 240,

    // ملاءمة الشاشة
    fitMode: 'stretch',         // 'stretch' | 'contain' | 'cover'
    safeAreaPadding: 10,        // هامش آمن للشاشات ذات الحواف
    fullscreen: true,           // ملء الشاشة على الجوال

    // كشف الجهاز
    isMobile: true,
    isTouchDevice: true,

    // إعدادات إضافية للأداء
    targetFPS: 60,
    adaptiveQuality: true       // يقلل الجودة تلقائياً عند البطء
  },

  /* ===== 4) إعدادات اللمس ===== */
  touch: {
    enabled: true,
    joystickSize: 120,
    buttonSize: 70,
    fireButtonSize: 80,
    vibrationMs: 30,            // اهتزاز عند الضغط
    longPressMs: 500,           // ضغط مطول
    doubleTapMs: 250            // نقرة مزدوجة
  },

  /* ===== 5) لوحة المفاتيح (للتطوير) ===== */
  keyboard: {
    up:    ['ArrowUp', 'w', 'W'],
    down:  ['ArrowDown', 's', 'S'],
    left:  ['ArrowLeft', 'a', 'A'],
    right: ['ArrowRight', 'd', 'D'],
    fire:  ['Space', ' '],
    pause: ['Escape', 'p', 'P']
  },

  /* ===== 6) أزرار الواجهة ===== */
  buttons: {
    showRotateLeft:  true,
    showRotateRight: true,
    showForward:     true,
    showBackward:    true,
    showFire:        true,
    showPause:       true
  }
};

/* ============================================
   دالة تطبيق الإعدادات على الشاشة تلقائياً
   ============================================ */
window.applyScreenConfig = function() {
  const s = window.CONTROLS_CONFIG.screen;
  s.currentWidth     = window.innerWidth;
  s.currentHeight    = window.innerHeight;
  s.devicePixelRatio = window.devicePixelRatio || 1;
  s.isTouchDevice    = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  s.isMobile         = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  console.log('📱 Screen config:', {
    size: `${s.currentWidth}x${s.currentHeight}`,
    dpr: s.devicePixelRatio,
    isMobile: s.isMobile,
    isTouch: s.isTouchDevice
  });
};

/* ============================================
   دالة تحميل الإعدادات المحفوظة من الكاش
   ============================================ */
window.loadUserSettings = function() {
  if (!window.COA || !window.COA.cache) return;

  const saved = window.COA.cache.get('user_settings');
  if (!saved) return;

  const c = window.CONTROLS_CONFIG;

  // الحساسية
  if (saved.sensitivity !== undefined) {
    const r = c.ranges.sensitivity;
    c.sensitivity.rotation  = r.min + (saved.sensitivity / 10) * (c.ranges.rotation.max - c.ranges.rotation.min);
    c.sensitivity.moveSpeed = r.min + (saved.sensitivity / 10) * (c.ranges.moveSpeed.max - c.ranges.moveSpeed.min);
  }

  // الصوت
  if (saved.volume !== undefined)   c.audio.masterVolume = saved.volume / 100;
  if (saved.sound !== undefined)    c.audio.sfxEnabled   = saved.sound;
  if (saved.music !== undefined)    c.audio.musicEnabled = saved.music;
  if (saved.muted !== undefined)    c.audio.muted        = saved.muted;

  // الاهتزاز
  if (saved.vibration !== undefined) c.touch.vibrationMs = saved.vibration ? 30 : 0;

  console.log('⚙️ User settings loaded:', saved);
};

/* ============================================
   تطبيق فوري عند التحميل
   ============================================ */
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.applyScreenConfig();
    window.loadUserSettings();
  });
}
