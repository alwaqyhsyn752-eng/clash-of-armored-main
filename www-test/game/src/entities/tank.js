/* ============================================
   Clash of Armored - Tank Entity
   ============================================ */
class Tank {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 70;
    this.speed = 3;
    this.rotation = 0;      // زاوية الدوران (0 = للأعلى)
    this.hp = 100;
    this.maxHp = 100;
    this.color = '#5a6e3d'; // أخضر زيتي
    this.turretColor = '#3d4a2b';
  }

  // حركة للأمام
  moveForward(dt) {
    this.x += Math.sin(this.rotation) * this.speed * dt;
    this.y -= Math.cos(this.rotation) * this.speed * dt;
  }

  // حركة للخلف
  moveBackward(dt) {
    this.x -= Math.sin(this.rotation) * this.speed * dt;
    this.y += Math.cos(this.rotation) * this.speed * dt;
  }

  // دوران يمين
  rotateRight(dt) {
    this.rotation += 0.05 * dt;
  }

  // دوران يسار
  rotateLeft(dt) {
    this.rotation -= 0.05 * dt;
  }

  // رسم المدرعة
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);

    // جسم المدرعة
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // الجانبان (الجنزير)
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(-this.width / 2 - 6, -this.height / 2, 6, this.height);
    ctx.fillRect(this.width / 2, -this.height / 2, 6, this.height);

    // البرج
    ctx.fillStyle = this.turretColor;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();

    // المدفع
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-3, -30, 6, 30);

    ctx.restore();

    // شريط الصحة (لا يدور مع المدرعة)
    this.drawHealthBar(ctx);
  }

  drawHealthBar(ctx) {
    const barW = this.width + 12;
    const barH = 6;
    const bx = this.x - 6;
    const by = this.y - 15;

    ctx.fillStyle = '#000';
    ctx.fillRect(bx, by, barW, barH);

    ctx.fillStyle = this.hp > 50 ? '#4ade80' : this.hp > 25 ? '#facc15' : '#dc2626';
    ctx.fillRect(bx, by, barW * (this.hp / this.maxHp), barH);

    ctx.strokeStyle = '#4a4a4a';
    ctx.strokeRect(bx, by, barW, barH);
  }

  update(dt, input) {
    if (input.up) this.moveForward(dt);
    if (input.down) this.moveBackward(dt);
    if (input.left) this.rotateLeft(dt);
    if (input.right) this.rotateRight(dt);
  }
}

window.Tank = Tank;
