/* ============================================
   Clash of Armored - Full Game Loop with Combat
   ============================================ */
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const cfg = window.GAME_CONFIG || { display: {}, performance: {} };
  const controls = window.CONTROLS_CONFIG || { sensitivity: {}, keyboard: {} };
  const mapCfg = (window.MAP_CONFIG && window.MAP_CONFIG.map_01) || {};

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const dprCap = (cfg.display && cfg.display.pixelRatioCap) || 2;
  const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  ctx.scale(dpr, dpr);

  // ===== إنشاء الأنظمة =====
  const map = new TestMap(canvas.width, canvas.height);
  const combat = new CombatSystem();

  const spawn = mapCfg.playerSpawn || { x: canvas.width / 2 - 25, y: canvas.height / 2 - 35, rotation: 0 };
  const tank = new Tank(spawn.x, spawn.y);
  tank.rotation = spawn.rotation || 0;

  // العقبات من الإعدادات
  const obstacles = (mapCfg.obstacles || []).slice();

  // الأعداء من الإعدادات
  const enemies = (mapCfg.enemySpawns || []).map(s => new Enemy(s.x, s.y, s.type));

  // القذائف
  let projectiles = [];
  let fireCooldown = 0;
  const FIRE_INTERVAL = 30; // إطارات بين كل طلقة (0.5 ثانية)

  // حالة اللعبة
  let gameState = 'playing'; // 'playing' | 'win' | 'lose'
  let explosions = [];       // تأثيرات الانفجار

  // ===== الإدخال =====
  const input = { up: false, down: false, left: false, right: false, fire: false };

  const kb = controls.keyboard || {
    up: ['ArrowUp', 'w', 'W'], down: ['ArrowDown', 's', 'S'],
    left: ['ArrowLeft', 'a', 'A'], right: ['ArrowRight', 'd', 'D'],
    fire: ['Space', ' ']
  };

  function matchKey(keys, key) {
    return Array.isArray(keys) && keys.includes(key);
  }

  window.addEventListener('keydown', e => {
    if (matchKey(kb.up, e.key))    input.up = true;
    if (matchKey(kb.down, e.key))  input.down = true;
    if (matchKey(kb.left, e.key))  input.left = true;
    if (matchKey(kb.right, e.key)) input.right = true;
    if (matchKey(kb.fire, e.key))  input.fire = true;
  });

  window.addEventListener('keyup', e => {
    if (matchKey(kb.up, e.key))    input.up = false;
    if (matchKey(kb.down, e.key))  input.down = false;
    if (matchKey(kb.left, e.key))  input.left = false;
    if (matchKey(kb.right, e.key)) input.right = false;
    if (matchKey(kb.fire, e.key))  input.fire = false;
  });

  // أزرار اللمس
  document.querySelectorAll('[data-dir]').forEach(btn => {
    const dir = btn.getAttribute('data-dir');
    const set = (v) => (e) => {
      e.preventDefault();
      input[dir] = v;
      if (v && controls.touch && controls.touch.vibrationMs && navigator.vibrate) {
        navigator.vibrate(controls.touch.vibrationMs);
      }
    };
    btn.addEventListener('touchstart', set(true), { passive: false });
    btn.addEventListener('touchend', set(false), { passive: false });
    btn.addEventListener('mousedown', set(true));
    btn.addEventListener('mouseup', set(false));
    btn.addEventListener('mouseleave', set(false));
  });

  if (controls.sensitivity && controls.sensitivity.moveSpeed) {
    tank.speed = controls.sensitivity.moveSpeed;
  }

  // ===== دوال مساعدة =====
  function createExplosion(x, y, color) {
    explosions.push({ x, y, radius: 5, maxRadius: 30, life: 20, color: color || '#ff7b00' });
  }

  function updateHUD() {
    const hpFill = document.getElementById('hpFill');
    const hpText = document.getElementById('hpText');
    const scoreText = document.getElementById('scoreText');

    if (hpFill) hpFill.style.width = Math.max(0, (tank.hp / tank.maxHp) * 100) + '%';
    if (hpText) hpText.textContent = Math.max(0, tank.hp);
    if (scoreText) scoreText.textContent = combat.score;
  }

  // ===== حلقة اللعبة =====
  let lastTime = performance.now();
  const maxDT = (cfg.performance && cfg.performance.maxDT) || 2;

  function gameLoop(now) {
    const dt = Math.min((now - lastTime) / 16.67, maxDT);
    lastTime = now;

    if (gameState === 'playing') {
      // تحديث اللاعب
      tank.update(dt, input);
      combat.resolveTankObstacles(tank, obstacles);

      // حدود الشاشة
      tank.x = Math.max(0, Math.min(canvas.width - tank.width, tank.x));
      tank.y = Math.max(0, Math.min(canvas.height - tank.height, tank.y));

      // إطلاق النار
      fireCooldown -= dt;
      if (input.fire && fireCooldown <= 0) {
        fireCooldown = FIRE_INTERVAL;
        const muzzleX = tank.x + tank.width / 2 + Math.sin(tank.rotation) * 35;
        const muzzleY = tank.y + tank.height / 2 - Math.cos(tank.rotation) * 35;
        projectiles.push(new Projectile(muzzleX, muzzleY, tank.rotation, 'player'));
        combat.shotsFired++;
      }

      // تحديث الأعداء
      enemies.forEach(e => e.update(dt, tank, projectiles));

      // تحديث القذائف
      projectiles.forEach(p => p.update());
      projectiles = projectiles.filter(p => p.active &&
        p.x > -50 && p.x < canvas.width + 50 &&
        p.y > -50 && p.y < canvas.height + 50);

      // معالجة الاصطدامات
      combat.processProjectileHits(
        projectiles, enemies, tank, obstacles,
        (x, y, isHit) => createExplosion(x, y, isHit ? '#ff7b00' : '#666'),
        (enemy) => createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#dc2626')
      );

      // فحص حالة اللعبة
      gameState = combat.checkGameState(tank, enemies);
      if (gameState !== 'playing') {
        setTimeout(() => {
          alert(gameState === 'win'
            ? `🏆 فوز! النقاط: ${combat.score} | الدقة: ${combat.getAccuracy()}%`
            : `💀 خسارة! النقاط: ${combat.score}`);
          if (gameState === 'win') {
            tank.hp = tank.maxHp;
            enemies.forEach(e => { e.active = true; e.hp = e.maxHp; });
            projectiles = [];
            gameState = 'playing';
          }
        }, 100);
      }
    }

    // تحديث الانفجارات
    explosions.forEach(ex => {
      ex.radius += (ex.maxRadius - ex.radius) * 0.15;
      ex.life--;
    });
    explosions = explosions.filter(ex => ex.life > 0);

    // ===== الرسم =====
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    map.draw(ctx);

    enemies.forEach(e => e.draw(ctx));
    projectiles.forEach(p => p.draw(ctx));
    if (gameState === 'playing' || tank.hp > 0) tank.draw(ctx);

    // رسم الانفجارات
    explosions.forEach(ex => {
      ctx.globalAlpha = ex.life / 20;
      ctx.fillStyle = ex.color;
      ctx.beginPath();
      ctx.arc(ex.x, ex.y, ex.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    updateHUD();
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);

  // حفظ تلقائي
  const autoSaveMs = (cfg.gameplay && cfg.gameplay.autoSaveInterval) || 30000;
  setInterval(() => {
    if (window.COA && window.COA.saves) {
      window.COA.saves.autoSave({
        tank: { x: tank.x, y: tank.y, rotation: tank.rotation, hp: tank.hp },
        score: combat.score,
        kills: combat.kills,
        mapId: mapCfg.id || 'map_01'
      });
    }
  }, autoSaveMs);

  console.log('🎮 Clash of Armored — Combat system ready');
});
