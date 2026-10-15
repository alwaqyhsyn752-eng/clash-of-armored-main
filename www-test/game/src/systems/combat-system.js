/* ============================================
   Clash of Armored - Combat System
   ============================================ */
class CombatSystem {
  constructor() {
    this.score = 0;
    this.kills = 0;
    this.shotsFired = 0;
    this.shotsHit = 0;
  }

  processProjectileHits(projectiles, enemies, player, obstacles, onHit, onKill) {
    projectiles.forEach(proj => {
      if (!proj.active) return;

      for (const obs of obstacles) {
        if (proj.hitsRect(obs)) {
          proj.active = false;
          if (onHit) onHit(proj.x, proj.y, false);
          return;
        }
      }

      if (proj.owner === 'player') {
        for (const enemy of enemies) {
          if (!enemy.active) continue;
          if (proj.hits(enemy)) {
            enemy.takeDamage(proj.damage);
            proj.active = false;
            this.shotsHit++;
            this.score += 10;
            if (onHit) onHit(proj.x, proj.y, true);
            if (!enemy.active) {
              this.kills++;
              this.score += 100;
              if (onKill) onKill(enemy);
            }
            break;
          }
        }
      }

      if (proj.owner === 'enemy') {
        if (proj.hits(player)) {
          player.hp -= proj.damage;
          proj.active = false;
          if (onHit) onHit(proj.x, proj.y, false);
        }
      }
    });
  }

  resolveTankObstacles(tank, obstacles) {
    for (const obs of obstacles) {
      const tx = tank.x, ty = tank.y, tw = tank.width, th = tank.height;

      if (tx < obs.x + obs.w && tx + tw > obs.x &&
          ty < obs.y + obs.h && ty + th > obs.y) {

        const overlapLeft   = (tx + tw) - obs.x;
        const overlapRight  = (obs.x + obs.w) - tx;
        const overlapTop    = (ty + th) - obs.y;
        const overlapBottom = (obs.y + obs.h) - ty;

        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (minOverlap === overlapLeft)        tank.x = obs.x - tw;
        else if (minOverlap === overlapRight)  tank.x = obs.x + obs.w;
        else if (minOverlap === overlapTop)    tank.y = obs.y - th;
        else if (minOverlap === overlapBottom) tank.y = obs.y + obs.h;
      }
    }
  }

  checkGameState(player, enemies) {
    if (player.hp <= 0) return 'lose';
    const aliveEnemies = enemies.filter(e => e.active).length;
    if (aliveEnemies === 0 && enemies.length > 0) return 'win';
    return 'playing';
  }

  getAccuracy() {
    if (this.shotsFired === 0) return 0;
    return Math.round((this.shotsHit / this.shotsFired) * 100);
  }

  reset() {
    this.score = 0;
    this.kills = 0;
    this.shotsFired = 0;
    this.shotsHit = 0;
  }
}

window.CombatSystem = CombatSystem;
