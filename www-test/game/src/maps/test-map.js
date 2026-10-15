/* ============================================
   Clash of Armored - Test Map
   ============================================ */
class TestMap {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.gridSize = 50;
    this.bgColor = '#0d0d0d';
    this.gridColor = 'rgba(90, 110, 61, 0.25)'; // شبكة خضراء زيتية خفيفة
    this.borderColor = '#ff7b00';
  }

  // رسم الخريطة والشبكة
  draw(ctx) {
    // الخلفية
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, this.width, this.height);

    // الشبكة
    ctx.strokeStyle = this.gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 0; x <= this.width; x += this.gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for (let y = 0; y <= this.height; y += this.gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();

    // الإطار البرتقالي (حدود منطقة اللعب)
    ctx.strokeStyle = this.borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, this.width - 4, this.height - 4);

    // بعض العقبات التجريبية
    this.drawObstacle(ctx, 200, 200, 80, 80);
    this.drawObstacle(ctx, 400, 350, 60, 120);
  }

  drawObstacle(ctx, x, y, w, h) {
    ctx.fillStyle = '#3d4a2b';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#5a6e3d';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // نقش داخلي
    ctx.strokeStyle = 'rgba(255, 123, 0, 0.3)';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + h);
    ctx.moveTo(x + w, y);
    ctx.lineTo(x, y + h);
    ctx.stroke();
  }
}

window.TestMap = TestMap;
