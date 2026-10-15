/* ============================================
   Clash of Armored - Projectile Entity
   ============================================ */
class Projectile {
  constructor(x, y, angle, owner) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.owner = owner;         // 'player' أو 'enemy'
    this.speed = 8;
    this.radius = 5;
    this.damage = 25;
    this.life = 200;            // عدد الإطارات قبل التلاشي
    this.active = true;
    this.color = owner === 'player' ? '#ff7b00' : '#ff4444';
  }

  update() {
    this.x += Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
    this.life--;

    if (this.life <= 0) this.active = false;
  }

  draw(ctx) {
    // توهج
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, 'rgba(255, 123, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
    ctx.fill();

    // القذيفة
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // الظل
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // فحص الاصطدام بدائرة
  hits(target) {
    const dx = this.x - (target.x + target.width / 2);
    const dy = this.y - (target.y + target.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < (target.width / 2 + this.radius);
  }

  // فحص اصطدام بعقبة مستطيلة
  hitsRect(rect) {
    return this.x >= rect.x && this.x <= rect.x + rect.w &&
           this.y >= rect.y && this.y <= rect.y + rect.h;
  }
}

window.Projectile = Projectile;
