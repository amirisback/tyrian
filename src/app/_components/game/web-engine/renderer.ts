import { Enemy, Particle, PlayerState, Powerup, Projectile, ShipConfig } from "./types";
import { Starfield } from "./starfield";

interface SpriteAssets {
  talon?: HTMLImageElement;
  phoenix?: HTMLImageElement;
  stalker?: HTMLImageElement;
  scout?: HTMLImageElement;
  interceptor?: HTMLImageElement;
  gunship?: HTMLImageElement;
  asteroid?: HTMLImageElement;
  boss?: HTMLImageElement;
  powerup_shield?: HTMLImageElement;
  powerup_weapon?: HTMLImageElement;
  powerup_bomb?: HTMLImageElement;
  powerup_credit?: HTMLImageElement;
}

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private screenShake: number = 0;
  private enableScanlines: boolean = true;
  private sprites: SpriteAssets = {};

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.loadSprites();
  }

  private loadSprites() {
    if (typeof window === "undefined") return;

    const createImg = (src: string): HTMLImageElement => {
      const img = new Image();
      img.src = src;
      return img;
    };

    this.sprites = {
      talon: createImg("/sprites/ship_talon.png"),
      phoenix: createImg("/sprites/ship_phoenix.png"),
      stalker: createImg("/sprites/ship_stalker.png"),
      scout: createImg("/sprites/enemy_scout.png"),
      interceptor: createImg("/sprites/enemy_interceptor.png"),
      gunship: createImg("/sprites/enemy_gunship.png"),
      asteroid: createImg("/sprites/enemy_asteroid.png"),
      boss: createImg("/sprites/boss_dreadnought.png"),
      powerup_shield: createImg("/sprites/powerup_shield.png"),
      powerup_weapon: createImg("/sprites/powerup_weapon.png"),
      powerup_bomb: createImg("/sprites/powerup_bomb.png"),
      powerup_credit: createImg("/sprites/powerup_credit.png"),
    };
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public setScanlines(enabled: boolean) {
    this.enableScanlines = enabled;
  }

  public addScreenShake(amount: number) {
    this.screenShake = Math.min(18, this.screenShake + amount);
  }

  public clear() {
    this.ctx.fillStyle = "#030712";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  public render(
    starfield: Starfield,
    player: PlayerState,
    shipConfig: ShipConfig,
    enemies: Enemy[],
    projectiles: Projectile[],
    powerups: Powerup[],
    particles: Particle[],
    wave: number,
    highScore: number,
    fps: number
  ) {
    this.ctx.save();

    // Screen Shake effect
    if (this.screenShake > 0.1) {
      const offsetX = (Math.random() - 0.5) * this.screenShake;
      const offsetY = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(offsetX, offsetY);
      this.screenShake *= 0.88;
    } else {
      this.screenShake = 0;
    }

    // 1. Starfield background
    starfield.render(this.ctx);

    // 2. Powerups
    this.renderPowerups(powerups);

    // 3. Enemies & Boss
    this.renderEnemies(enemies);

    // 4. Projectiles
    this.renderProjectiles(projectiles);

    // 5. Player
    if (player.isAlive) {
      this.renderPlayer(player, shipConfig);
    }

    // 6. Particles & Explosions
    this.renderParticles(particles);

    this.ctx.restore();

    // 7. CRT Scanline Grid & Phosphor Overlay
    if (this.enableScanlines) {
      this.renderScanlines();
    }

    // 8. Authentic Cockpit HUD
    this.renderHUD(player, shipConfig, wave, highScore, fps);
  }

  private isSpriteReady(img?: HTMLImageElement): img is HTMLImageElement {
    return Boolean(img && img.complete && img.naturalWidth > 0);
  }

  private renderPlayer(player: PlayerState, ship: ShipConfig) {
    const ctx = this.ctx;
    const { x, y, invulnerableFrames, shipId } = player;

    // Invulnerability blinking
    if (invulnerableFrames > 0 && Math.floor(invulnerableFrames / 4) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(x, y);

    // Animated Thruster Exhaust Flames
    const flameHeight = 8 + Math.random() * 8;
    const flameGrad = ctx.createLinearGradient(0, 14, 0, 14 + flameHeight);
    flameGrad.addColorStop(0, "#ffffff"); // Blazing white core
    flameGrad.addColorStop(0.2, "#fde047"); // Hot yellow
    flameGrad.addColorStop(0.6, "#f97316"); // Orange
    flameGrad.addColorStop(1, "transparent");

    ctx.fillStyle = flameGrad;
    // Dual thrusters
    ctx.beginPath();
    ctx.moveTo(-6, 14);
    ctx.lineTo(-4, 14 + flameHeight);
    ctx.lineTo(-2, 14);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(2, 14);
    ctx.lineTo(4, 14 + flameHeight);
    ctx.lineTo(6, 14);
    ctx.fill();

    // Render Authentic Pixel-Art Ship Sprite
    const sprite = this.sprites[shipId];
    if (this.isSpriteReady(sprite)) {
      const sw = sprite.naturalWidth;
      const sh = sprite.naturalHeight;
      ctx.drawImage(sprite, -sw / 2, -sh / 2, sw, sh);
    } else {
      // Fallback
      ctx.fillStyle = ship.hullColor;
      ctx.fillRect(-12, -12, 24, 24);
    }

    // Shield Bubble effect when damaged
    if (player.invulnerableFrames > 0) {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
      ctx.fill();
    }

    // Sidekicks (Orbital Drone Escorts)
    if (player.weaponLevel >= 2) {
      this.renderSidekick(-24, 4);
      this.renderSidekick(24, 4);
    }

    ctx.restore();
  }

  private renderSidekick(ox: number, oy: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(ox, oy);

    // Miniature Shaded Satellite Drone
    const grad = ctx.createRadialGradient(-1, -1, 1, 0, 0, 5);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.4, "#38bdf8");
    grad.addColorStop(1, "#0369a1");

    ctx.fillStyle = grad;
    ctx.strokeStyle = "#082f49";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Laser Optics
    ctx.fillStyle = "#facc15";
    ctx.fillRect(-0.5, -6, 1.5, 3);
    ctx.restore();
  }

  private renderEnemies(enemies: Enemy[]) {
    const ctx = this.ctx;

    for (const e of enemies) {
      ctx.save();
      ctx.translate(e.x, e.y);

      if (e.type === "scout") {
        const sprite = this.sprites.scout;
        if (this.isSpriteReady(sprite)) {
          ctx.drawImage(sprite, -sprite.naturalWidth / 2, -sprite.naturalHeight / 2);
        } else {
          ctx.fillStyle = "#10b981";
          ctx.fillRect(-10, -10, 20, 20);
        }
      } else if (e.type === "interceptor") {
        const sprite = this.sprites.interceptor;
        if (this.isSpriteReady(sprite)) {
          ctx.drawImage(sprite, -sprite.naturalWidth / 2, -sprite.naturalHeight / 2);
        } else {
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(-12, -12, 24, 24);
        }
      } else if (e.type === "gunship") {
        const sprite = this.sprites.gunship;
        if (this.isSpriteReady(sprite)) {
          ctx.drawImage(sprite, -sprite.naturalWidth / 2, -sprite.naturalHeight / 2);
        } else {
          ctx.fillStyle = "#7c3aed";
          ctx.fillRect(-18, -14, 36, 28);
        }
      } else if (e.type === "asteroid") {
        const sprite = this.sprites.asteroid;
        if (this.isSpriteReady(sprite)) {
          ctx.rotate(e.timeAlive * 0.03);
          ctx.drawImage(sprite, -sprite.naturalWidth / 2, -sprite.naturalHeight / 2);
        } else {
          ctx.fillStyle = "#64748b";
          ctx.fillRect(-12, -12, 24, 24);
        }
      } else if (e.type === "boss") {
        this.renderBoss(e);
      }

      // HP bar for damaged heavy enemies
      if (e.type !== "boss" && e.hp < e.maxHp) {
        const hpPercent = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(-14, -e.height / 2 - 8, 28, 4);
        ctx.fillStyle = hpPercent > 0.4 ? "#22c55e" : "#ef4444";
        ctx.fillRect(-14, -e.height / 2 - 8, 28 * hpPercent, 4);
      }

      ctx.restore();
    }
  }

  private renderBoss(boss: Enemy) {
    const ctx = this.ctx;
    const sprite = this.sprites.boss;
    const hpPercent = Math.max(0, boss.hp / boss.maxHp);

    if (this.isSpriteReady(sprite)) {
      // Draw authentic 128x128 OpenTyrian Dreadnought Flagship
      const bw = 100;
      const bh = 100;

      // Core engine glow underneath
      const pulse = (Math.sin(Date.now() / 150) + 1) / 2;
      ctx.fillStyle = `rgba(239, 68, 68, ${0.3 + pulse * 0.4})`;
      ctx.beginPath();
      ctx.arc(0, 5, 26 + pulse * 4, 0, Math.PI * 2);
      ctx.fill();

      // Sprite render
      ctx.drawImage(sprite, -bw / 2, -bh / 2, bw, bh);

      // Flashing damaged glow
      if (boss.hp < boss.maxHp * 0.3) {
        ctx.fillStyle = `rgba(249, 115, 22, ${0.2 + pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(0, 0, 35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Top Dreadnought Health Bar
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const barWidth = Math.min(360, this.width - 40);
    const barX = (this.width - barWidth) / 2;
    const barY = 34;

    ctx.font = "bold 10px monospace";
    ctx.fillStyle = "#f43f5e";
    ctx.textAlign = "center";
    ctx.fillText("⚠️ MICROSOL DREADNOUGHT WARSHIP ⚠️", this.width / 2, barY - 6);

    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.strokeStyle = "#e11d48";
    ctx.lineWidth = 1.5;
    ctx.fillRect(barX, barY, barWidth, 10);
    ctx.strokeRect(barX, barY, barWidth, 10);

    const hpGrad = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
    hpGrad.addColorStop(0, "#ef4444");
    hpGrad.addColorStop(0.5, "#f59e0b");
    hpGrad.addColorStop(1, "#22c55e");

    ctx.fillStyle = hpGrad;
    ctx.fillRect(barX + 2, barY + 2, (barWidth - 4) * hpPercent, 6);

    ctx.restore();
  }

  private renderProjectiles(projectiles: Projectile[]) {
    const ctx = this.ctx;

    for (const p of projectiles) {
      if (p.isPlayer) {
        // High-energy laser bolt with white-hot core
        const w = p.width;
        const h = p.height;

        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fillRect(p.x - w / 2, p.y - h / 2, w, h);

        // Bright white center core
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(p.x - (w * 0.4) / 2, p.y - h / 2 + 1, w * 0.4, h - 2);
        ctx.shadowBlur = 0;
      } else {
        // Red enemy plasma sphere with hot core
        ctx.fillStyle = "#ef4444";
        ctx.shadowColor = "#f43f5e";
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.width / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.arc(p.x - 0.5, p.y - 0.5, p.width / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  private renderPowerups(powerups: Powerup[]) {
    const ctx = this.ctx;

    for (const p of powerups) {
      ctx.save();
      ctx.translate(p.x, p.y);

      const pulse = Math.sin(p.pulsePhase) * 1.5;
      const drawSize = p.size * 2 + pulse;

      let sprite: HTMLImageElement | undefined;
      if (p.type === "shield") sprite = this.sprites.powerup_shield;
      else if (p.type === "weapon_upgrade") sprite = this.sprites.powerup_weapon;
      else if (p.type === "superbomb") sprite = this.sprites.powerup_bomb;
      else if (p.type === "credit") sprite = this.sprites.powerup_credit;

      if (this.isSpriteReady(sprite)) {
        ctx.drawImage(sprite, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
      } else {
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  private renderParticles(particles: Particle[]) {
    const ctx = this.ctx;

    for (const p of particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1.0;
  }

  private renderScanlines() {
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    for (let y = 0; y < this.height; y += 3) {
      ctx.fillRect(0, y, this.width, 1);
    }

    const vignette = ctx.createRadialGradient(
      this.width / 2,
      this.height / 2,
      this.width * 0.35,
      this.width / 2,
      this.height / 2,
      this.width * 0.72
    );
    vignette.addColorStop(0, "transparent");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.45)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  private renderHUD(
    player: PlayerState,
    ship: ShipConfig,
    wave: number,
    highScore: number,
    fps: number
  ) {
    const ctx = this.ctx;
    const hudY = this.height - 28;

    // Cockpit Bezel Console
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, hudY, this.width, 28);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, hudY, this.width, 28);

    // Segmented Illuminated Digital LED Meters
    const segWidth = 5;
    const segHeight = 6;
    const segGap = 1.5;
    const maxSegs = 10;

    // Shield LED Meter (Cyan)
    ctx.font = "bold 8px monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "left";
    ctx.fillText("SHD", 6, hudY + 11);

    const activeShieldSegs = Math.round((player.shield / player.maxShield) * maxSegs);
    for (let i = 0; i < maxSegs; i++) {
      const sx = 28 + i * (segWidth + segGap);
      const sy = hudY + 5;
      if (i < activeShieldSegs) {
        ctx.fillStyle = "#0284c7";
        ctx.fillRect(sx, sy, segWidth, segHeight);
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(sx, sy, segWidth, 1.5);
      } else {
        ctx.fillStyle = "#082f49";
        ctx.fillRect(sx, sy, segWidth, segHeight);
      }
    }

    // Armor LED Meter (Green to Red)
    ctx.fillStyle = "#22c55e";
    ctx.fillText("ARM", 6, hudY + 22);

    const activeArmorSegs = Math.round((player.armor / player.maxArmor) * maxSegs);
    for (let i = 0; i < maxSegs; i++) {
      const sx = 28 + i * (segWidth + segGap);
      const sy = hudY + 16;
      if (i < activeArmorSegs) {
        ctx.fillStyle = activeArmorSegs > 3 ? "#16a34a" : "#dc2626";
        ctx.fillRect(sx, sy, segWidth, segHeight);
        ctx.fillStyle = activeArmorSegs > 3 ? "#4ade80" : "#f87171";
        ctx.fillRect(sx, sy, segWidth, 1.5);
      } else {
        ctx.fillStyle = "#14532d";
        ctx.fillRect(sx, sy, segWidth, segHeight);
      }
    }

    // Center: Score & Weapon Level
    ctx.font = "bold 10px monospace";
    ctx.fillStyle = "#facc15";
    ctx.textAlign = "center";
    ctx.fillText(`SCORE: ${player.score.toLocaleString()}`, this.width / 2 - 25, hudY + 12);

    ctx.font = "9px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`CREDITS: $${player.credits} • LVL ${player.weaponLevel}`, this.width / 2 - 25, hudY + 23);

    // Right: Wave & Superbombs
    ctx.textAlign = "right";
    ctx.font = "bold 10px monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(`WAVE ${wave}`, this.width - 10, hudY + 12);

    ctx.font = "9px monospace";
    ctx.fillStyle = "#ef4444";
    const bombIcons = "💣".repeat(player.superbombs) || "EMPTY";
    ctx.fillText(`BOMBS: ${bombIcons}`, this.width - 10, hudY + 23);

    // Top Header Status
    ctx.textAlign = "left";
    ctx.font = "9px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fillText(`HIGH: ${highScore.toLocaleString()}`, 10, 14);

    ctx.textAlign = "right";
    ctx.fillText(`${fps} FPS • ${ship.name}`, this.width - 10, 14);
  }
}
