import { Enemy, Particle, PlayerState, Powerup, Projectile, ShipConfig } from "./types";
import { Starfield } from "./starfield";

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private screenShake: number = 0;
  private enableScanlines: boolean = true;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
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

    // Apply Screen Shake
    if (this.screenShake > 0.1) {
      const offsetX = (Math.random() - 0.5) * this.screenShake;
      const offsetY = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(offsetX, offsetY);
      this.screenShake *= 0.88;
    } else {
      this.screenShake = 0;
    }

    // 1. Render Starfield
    starfield.render(this.ctx);

    // 2. Render Powerups
    this.renderPowerups(powerups);

    // 3. Render Enemies & Boss
    this.renderEnemies(enemies);

    // 4. Render Projectiles
    this.renderProjectiles(projectiles);

    // 5. Render Player
    if (player.isAlive) {
      this.renderPlayer(player, shipConfig);
    }

    // 6. Render Particles
    this.renderParticles(particles);

    this.ctx.restore();

    // 7. Render CRT Scanline Grid & Phosphor Overlay
    if (this.enableScanlines) {
      this.renderScanlines();
    }

    // 8. Render HUD (Fixed over screen shake)
    this.renderHUD(player, shipConfig, wave, highScore, fps);
  }

  private renderPlayer(player: PlayerState, ship: ShipConfig) {
    const ctx = this.ctx;
    const { x, y, invulnerableFrames } = player;

    // Invulnerability blinking
    if (invulnerableFrames > 0 && Math.floor(invulnerableFrames / 4) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(x, y);

    // Thruster Flames
    const flameHeight = 10 + Math.random() * 8;
    const grad = ctx.createLinearGradient(0, 16, 0, 16 + flameHeight);
    grad.addColorStop(0, "#fef08a"); // Light yellow
    grad.addColorStop(0.5, "#f97316"); // Orange
    grad.addColorStop(1, "transparent");

    ctx.fillStyle = grad;
    // Left thruster
    ctx.beginPath();
    ctx.moveTo(-7, 16);
    ctx.lineTo(-4, 16 + flameHeight);
    ctx.lineTo(-1, 16);
    ctx.fill();

    // Right thruster
    ctx.beginPath();
    ctx.moveTo(1, 16);
    ctx.lineTo(4, 16 + flameHeight);
    ctx.lineTo(7, 16);
    ctx.fill();

    // Player Hull
    ctx.fillStyle = ship.hullColor;
    ctx.strokeStyle = ship.accentColor;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(0, -18); // Nose
    ctx.lineTo(8, -4);
    ctx.lineTo(16, 12); // Right wing tip
    ctx.lineTo(8, 15);
    ctx.lineTo(0, 12); // Keel center
    ctx.lineTo(-8, 15);
    ctx.lineTo(-16, 12); // Left wing tip
    ctx.lineTo(-8, -4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cockpit Canopy (Cyan Glow)
    ctx.fillStyle = "#67e8f9";
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(3, -2);
    ctx.lineTo(0, 4);
    ctx.lineTo(-3, -2);
    ctx.closePath();
    ctx.fill();

    // Wing Cannons / Accents
    ctx.fillStyle = ship.accentColor;
    ctx.fillRect(-15, 4, 3, 8);
    ctx.fillRect(12, 4, 3, 8);

    // Shield Bubble effect when damaged
    if (player.invulnerableFrames > 0) {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Sidekicks (Orbital Drone Escorts)
    if (player.weaponLevel >= 2) {
      this.renderSidekick(-28, 4);
      this.renderSidekick(28, 4);
    }

    ctx.restore();
  }

  private renderSidekick(ox: number, oy: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(ox, oy);

    ctx.fillStyle = "#38bdf8";
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-1, -6, 2, 3); // Miniature cannon barrel
    ctx.restore();
  }

  private renderEnemies(enemies: Enemy[]) {
    const ctx = this.ctx;

    for (const e of enemies) {
      ctx.save();
      ctx.translate(e.x, e.y);

      if (e.type === "scout") {
        // Fast sleek green dart
        ctx.fillStyle = "#10b981";
        ctx.strokeStyle = "#047857";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 12);
        ctx.lineTo(10, -10);
        ctx.lineTo(0, -6);
        ctx.lineTo(-10, -10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.fillRect(-2, 2, 4, 4);
      } else if (e.type === "interceptor") {
        // Red aggressor
        ctx.fillStyle = "#ef4444";
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(14, -8);
        ctx.lineTo(5, -4);
        ctx.lineTo(0, -12);
        ctx.lineTo(-5, -4);
        ctx.lineTo(-14, -8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (e.type === "gunship") {
        // Heavy purple war frigate
        ctx.fillStyle = "#7c3aed";
        ctx.strokeStyle = "#c084fc";
        ctx.lineWidth = 2;
        ctx.fillRect(-18, -14, 36, 28);
        ctx.strokeRect(-18, -14, 36, 28);

        // Armor plating
        ctx.fillStyle = "#4c1d95";
        ctx.fillRect(-12, -8, 24, 16);

        // Twin cannons
        ctx.fillStyle = "#f43f5e";
        ctx.fillRect(-14, 14, 4, 6);
        ctx.fillRect(10, 14, 4, 6);
      } else if (e.type === "asteroid") {
        // Space debris
        ctx.fillStyle = "#64748b";
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-12, -8);
        ctx.lineTo(4, -14);
        ctx.lineTo(14, -4);
        ctx.lineTo(10, 12);
        ctx.lineTo(-6, 14);
        ctx.lineTo(-14, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (e.type === "boss") {
        this.renderBoss(e);
      }

      // Small HP bar above damaged heavy enemies
      if (e.type !== "boss" && e.hp < e.maxHp) {
        const hpPercent = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(-14, -e.height / 2 - 8, 28, 4);
        ctx.fillStyle = hpPercent > 0.4 ? "#22c55e" : "#ef4444";
        ctx.fillRect(-14, -e.height / 2 - 8, 28 * hpPercent, 4);
      }

      ctx.restore();
    }
  }

  private renderBoss(boss: Enemy) {
    const ctx = this.ctx;
    const hpPercent = Math.max(0, boss.hp / boss.maxHp);

    // MicroSol Flagship / Dreadnought
    ctx.fillStyle = "#1e1b4b"; // Dark deep navy
    ctx.strokeStyle = "#e11d48"; // Crimson edge
    ctx.lineWidth = 2.5;

    // Main Dreadnought Hull
    ctx.beginPath();
    ctx.moveTo(0, 48); // Spear tip
    ctx.lineTo(45, 10);
    ctx.lineTo(65, -35); // Right wing fin
    ctx.lineTo(35, -45);
    ctx.lineTo(15, -30);
    ctx.lineTo(0, -40); // Rear center
    ctx.lineTo(-15, -30);
    ctx.lineTo(-35, -45);
    ctx.lineTo(-65, -35); // Left wing fin
    ctx.lineTo(-45, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Core Reactor (Pulsing Glow)
    const pulse = (Math.sin(Date.now() / 150) + 1) / 2;
    ctx.fillStyle = `rgba(239, 68, 68, ${0.4 + pulse * 0.5})`;
    ctx.beginPath();
    ctx.arc(0, 0, 14 + pulse * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    // Left and Right Weapon Batteries
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(-48, -10, 8, 24);
    ctx.fillRect(40, -10, 8, 24);

    // Boss Name & Mega Health Bar (At top of screen)
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform to canvas space

    const barWidth = Math.min(360, this.width - 40);
    const barX = (this.width - barWidth) / 2;
    const barY = 36;

    // Header label
    ctx.font = "bold 11px monospace";
    ctx.fillStyle = "#f43f5e";
    ctx.textAlign = "center";
    ctx.fillText("⚠️ MICROSOL DREADNOUGHT WARSHIP ⚠️", this.width / 2, barY - 6);

    // Outer frame
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.strokeStyle = "#e11d48";
    ctx.lineWidth = 2;
    ctx.fillRect(barX, barY, barWidth, 12);
    ctx.strokeRect(barX, barY, barWidth, 12);

    // HP Bar
    const hpGrad = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
    hpGrad.addColorStop(0, "#ef4444");
    hpGrad.addColorStop(0.5, "#f59e0b");
    hpGrad.addColorStop(1, "#22c55e");

    ctx.fillStyle = hpGrad;
    ctx.fillRect(barX + 2, barY + 2, (barWidth - 4) * hpPercent, 8);

    ctx.restore();
  }

  private renderProjectiles(projectiles: Projectile[]) {
    const ctx = this.ctx;

    for (const p of projectiles) {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;

      if (p.isPlayer) {
        // Elongated laser bolt
        ctx.fillRect(p.x - p.width / 2, p.y - p.height / 2, p.width, p.height);
      } else {
        // Round enemy plasma pellet
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.width / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0; // reset shadow
    }
  }

  private renderPowerups(powerups: Powerup[]) {
    const ctx = this.ctx;

    for (const p of powerups) {
      ctx.save();
      ctx.translate(p.x, p.y);

      const pulse = Math.sin(p.pulsePhase) * 1.5;
      const size = p.size + pulse;

      let bgColor = "#38bdf8";
      let label = "W";

      if (p.type === "shield") {
        bgColor = "#22c55e";
        label = "S";
      } else if (p.type === "superbomb") {
        bgColor = "#ef4444";
        label = "B";
      } else if (p.type === "credit") {
        bgColor = "#facc15";
        label = "$";
      }

      // Outer glow circle
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();

      // Inner white text
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 0, 0);

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

    // CRT Vignette gradient on canvas borders
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
    const hudY = this.height - 30;

    // HUD Background Bar
    ctx.fillStyle = "rgba(5, 7, 17, 0.88)";
    ctx.fillRect(0, hudY, this.width, 30);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, hudY, this.width, 30);

    // Left: Shield & Armor Status
    const barW = 75;
    const barH = 6;

    // Shield Bar
    const shieldPct = Math.max(0, player.shield / player.maxShield);
    ctx.font = "8px monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("SHD", 8, hudY + 11);
    ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
    ctx.fillRect(30, hudY + 5, barW, barH);
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(30, hudY + 5, barW * shieldPct, barH);

    // Armor Bar
    const armorPct = Math.max(0, player.armor / player.maxArmor);
    ctx.fillStyle = "#22c55e";
    ctx.fillText("ARM", 8, hudY + 22);
    ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
    ctx.fillRect(30, hudY + 16, barW, barH);
    ctx.fillStyle = armorPct > 0.3 ? "#16a34a" : "#dc2626";
    ctx.fillRect(30, hudY + 16, barW * armorPct, barH);

    // Center: Score & Weapon Level
    ctx.font = "bold 10px monospace";
    ctx.fillStyle = "#facc15";
    ctx.textAlign = "center";
    ctx.fillText(`SCORE: ${player.score.toLocaleString()}`, this.width / 2 - 40, hudY + 13);

    ctx.font = "9px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`CREDITS: $${player.credits} • LVL ${player.weaponLevel}`, this.width / 2 - 40, hudY + 24);

    // Right: Superbombs & Wave
    ctx.textAlign = "right";
    ctx.font = "bold 10px monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(`WAVE ${wave}`, this.width - 12, hudY + 13);

    ctx.font = "9px monospace";
    ctx.fillStyle = "#ef4444";
    const bombIcons = "💣".repeat(player.superbombs) || "EMPTY";
    ctx.fillText(`BOMBS: ${bombIcons}`, this.width - 12, hudY + 24);

    // Top Header Status (Score / High score / FPS)
    ctx.textAlign = "left";
    ctx.font = "9px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText(`HIGH: ${highScore.toLocaleString()}`, 10, 14);

    ctx.textAlign = "right";
    ctx.fillText(`${fps} FPS • ${ship.name}`, this.width - 10, 14);
  }
}
