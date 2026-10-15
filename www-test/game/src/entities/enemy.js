/* ============================================
   Clash of Armored - Enemy Tank Entity
   ============================================ */
class Enemy {
  constructor(x, y, type = 'scout') {
    this.x = x;
    this.y = y;
    this.width = 45;
    this.height = 60;
    this.rotation = Math.PI;    // متجه للأسفل
    this.speed = 1.2;
    this.hp = 60;
    this.maxHp = 60;
    this.type = type;
    this.color = '#7a2020';     // أحمر داكن
    this.turretColor = '#4a1010';
    this.active = true;
    this.shootCooldown = 0;
    this.shootInterval = 120;   // إطارات بين كل طلقة
    this.detectionRange = 400;
  }

  update(dt, player, projectiles) {
    if (!this.active) return;

    // حساب المسافة من اللاعب
    const dx = (player.x + player.width / 2) - (this.x + this.width / 2);
    const dy = (player.y + player.height / 2) - (this.y + this.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);

    // تتبع اللاعب إذا كان قريباً
    if (dist < this.detectionRange) {
      const targetAngle = Math.atan2(dx, -dy);
      this.rotation = targetAngle;

      if (dist > 150) {
        this.x += Math.sin(this.rotation) * this.speed * dt;
        this.y -= Math.cos(this.rotation) * this.speed * dt;
      }

      // إطلاق نار
      this.shootCooldown -= dt;
      if (this.shootCooldown <= 0 && dist < 350) {
        this.shootCooldown = this.shootInterval;
        const muzzleX = this.x + this.width / 2 + Math.sin(this.rotation) * 35;
        const muzzleY = this.y + this.height / 2 - Math.cos(this.rotation) * 35;
        projectiles.push(new Projectile(muzzleX, muzzleY, this.rotation, 'enemy'));
      }
    }
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);

    // الجنازير
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-this.width / 2 - 6, -this.height / 2, 6, this.height);
    ctx.fillRect(this.width / 2, -this.height / 2, 6, this.height);

    // الجسم
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // البرج
    ctx.fillStyle = this.turretColor;
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();

    // المدفع
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(-3, -28, 6, 28);

    ctx.restore();

    this.drawHealthBar(ctx);
  }

  drawHealthBar(ctx) {
    const barW = this.width + 12;
    const barH = 5;
    const bx = this.x - 6;
    const by = this.y - 14;

    ctx.fillStyle = '#000';
    ctx.fillRect(bx, by, barW, barH);

    const ratio = this.hp / this.maxHp;
    ctx.fillStyle = ratio > 0.5 ? '#4ade80' : ratio > 0.25 ? '#facc15' : '#dc2626';
    ctx.fillRect(bx, by, barW * ratio, barH);

    ctx.strokeStyle = '#4a4a4a';
    ctx.strokeRect(bx, by, barW, barH);
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.active = false;
    }
  }
}

window.Enemy = Enemy;
