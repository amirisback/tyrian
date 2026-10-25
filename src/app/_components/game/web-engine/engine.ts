import {
  Enemy,
  GamePhase,
  InputState,
  Particle,
  PlayerState,
  Powerup,
  Projectile,
  ShipConfig,
  ShipId,
  WeaponConfig,
} from "./types";
import { SHIPS } from "./ships";
import { WEAPONS } from "./weapons";
import { Starfield } from "./starfield";
import { SoundSynthesizer } from "./audio";
import { GameRenderer } from "./renderer";

export interface GameEngineCallbacks {
  onPhaseChange?: (phase: GamePhase) => void;
  onStatsUpdate?: (stats: {
    score: number;
    credits: number;
    wave: number;
    shield: number;
    armor: number;
    weaponLevel: number;
    superbombs: number;
  }) => void;
}

export class TyrianWebEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: GameRenderer;
  private starfield: Starfield;
  private audio: SoundSynthesizer;
  private callbacks: GameEngineCallbacks;

  // Internal logical resolution (OpenTyrian VGA standard)
  private readonly LOGICAL_WIDTH = 320;
  private readonly LOGICAL_HEIGHT = 240;

  // Game Loop
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private phase: GamePhase = "menu";

  // State
  private player: PlayerState;
  private currentShip: ShipConfig;
  private currentWeapon: WeaponConfig;
  private projectiles: Projectile[] = [];
  private enemies: Enemy[] = [];
  private powerups: Powerup[] = [];
  private particles: Particle[] = [];

  // Wave Progression
  private wave: number = 1;
  private waveTimer: number = 0;
  private waveSpawnIndex: number = 0;
  private waveClearTimer: number = 0;
  private bossActive: boolean = false;
  private highScore: number = 0;

  // Next unique ID generator
  private nextId: number = 1;

  // Input
  private input: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false,
    superbomb: false,
    focus: false,
  };

  constructor(
    canvas: HTMLCanvasElement,
    shipId: ShipId = "talon",
    callbacks: GameEngineCallbacks = {}
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      throw new Error("Unable to obtain 2D canvas context for TyrianWebEngine");
    }
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;

    this.callbacks = callbacks;
    this.audio = new SoundSynthesizer();
    this.starfield = new Starfield(this.LOGICAL_WIDTH, this.LOGICAL_HEIGHT);
    this.renderer = new GameRenderer(this.ctx, this.LOGICAL_WIDTH, this.LOGICAL_HEIGHT);

    this.currentShip = SHIPS[shipId] ?? SHIPS.talon;
    this.currentWeapon = WEAPONS[this.currentShip.primaryWeapon];
    this.player = this.createPlayerState(this.currentShip);

    this.loadHighScore();
    this.resizeCanvas();
  }

  private createPlayerState(ship: ShipConfig): PlayerState {
    return {
      x: this.LOGICAL_WIDTH / 2,
      y: this.LOGICAL_HEIGHT - 45,
      vx: 0,
      vy: 0,
      shipId: ship.id,
      shield: ship.maxShield,
      maxShield: ship.maxShield,
      armor: ship.maxArmor,
      maxArmor: ship.maxArmor,
      weaponLevel: 1,
      maxWeaponLevel: 5,
      superbombs: 2,
      maxSuperbombs: 4,
      score: 0,
      credits: 0,
      invulnerableFrames: 90, // 1.5 seconds invulnerability on start
      isAlive: true,
      fireTimer: 0,
    };
  }

  private loadHighScore() {
    try {
      const saved = localStorage.getItem("tyrian_web_highscore");
      if (saved) {
        this.highScore = parseInt(saved, 10) || 0;
      }
    } catch {
      this.highScore = 0;
    }
  }

  private saveHighScore() {
    try {
      if (this.player.score > this.highScore) {
        this.highScore = this.player.score;
        localStorage.setItem("tyrian_web_highscore", this.highScore.toString());
      }
    } catch {}
  }

  public resizeCanvas() {
    // Keep internal canvas resolution strictly 320x240 for authentic pixel art
    this.canvas.width = this.LOGICAL_WIDTH;
    this.canvas.height = this.LOGICAL_HEIGHT;
    this.renderer.resize(this.LOGICAL_WIDTH, this.LOGICAL_HEIGHT);
    this.starfield.resize(this.LOGICAL_WIDTH, this.LOGICAL_HEIGHT);
  }

  public setShip(shipId: ShipId) {
    this.currentShip = SHIPS[shipId] ?? SHIPS.talon;
    this.currentWeapon = WEAPONS[this.currentShip.primaryWeapon];
    this.player.shipId = this.currentShip.id;
    this.player.maxShield = this.currentShip.maxShield;
    this.player.maxArmor = this.currentShip.maxArmor;
    this.player.shield = Math.min(this.player.shield, this.player.maxShield);
    this.player.armor = Math.min(this.player.armor, this.player.maxArmor);
  }

  public setScanlines(enabled: boolean) {
    this.renderer.setScanlines(enabled);
  }

  public setMuted(muted: boolean) {
    this.audio.setMuted(muted);
  }

  public isMuted(): boolean {
    return this.audio.getMuted();
  }

  public setInput(input: Partial<InputState>) {
    this.input = { ...this.input, ...input };
  }

  public start() {
    this.phase = "playing";
    this.player = this.createPlayerState(this.currentShip);
    this.projectiles = [];
    this.enemies = [];
    this.powerups = [];
    this.particles = [];
    this.wave = 1;
    this.waveTimer = 0;
    this.waveSpawnIndex = 0;
    this.waveClearTimer = 0;
    this.bossActive = false;
    this.isRunning = true;

    this.audio.startBgm();
    this.callbacks.onPhaseChange?.("playing");

    this.lastTime = performance.now();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.loop(this.lastTime);
  }

  public pause() {
    if (this.phase === "playing") {
      this.phase = "paused";
      this.audio.stopBgm();
      this.callbacks.onPhaseChange?.("paused");
    } else if (this.phase === "paused") {
      this.phase = "playing";
      this.audio.startBgm();
      this.callbacks.onPhaseChange?.("playing");
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.audio.stopBgm();
  }

  public triggerSuperbomb() {
    if (!this.player.isAlive || this.player.superbombs <= 0) return;

    this.player.superbombs--;
    this.audio.playSuperbomb();
    this.renderer.addScreenShake(15);

    // Screen clearing shockwave particles
    for (let i = 0; i < 90; i++) {
      const angle = (Math.PI * 2 * i) / 90;
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x: this.player.x,
        y: this.player.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 45,
        maxLife: 45,
        color: "#facc15",
        size: 3,
      });
    }

    // Clear all enemy projectiles
    this.projectiles = this.projectiles.filter((p) => p.isPlayer);

    // High damage to all enemies on screen
    for (const e of this.enemies) {
      e.hp -= 250;
      if (e.hp <= 0) {
        this.destroyEnemy(e);
      }
    }
    this.enemies = this.enemies.filter((e) => e.hp > 0);
  }

  private loop = (currentTime: number) => {
    if (!this.isRunning) return;

    // Fixed 60 FPS update
    this.update();
    this.render();

    this.lastTime = currentTime;
    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update() {
    if (this.phase !== "playing") return;

    // 1. Starfield update
    this.starfield.update(this.bossActive ? 1.5 : 1.0);

    // 2. Player update
    this.updatePlayer();

    // 3. Projectiles update
    this.updateProjectiles();

    // 4. Enemies & Boss update
    this.updateEnemies();

    // 5. Powerups update
    this.updatePowerups();

    // 6. Particles update
    this.updateParticles();

    // 7. Waves spawner
    this.updateWaves();

    // 8. Stats callback
    this.callbacks.onStatsUpdate?.({
      score: this.player.score,
      credits: this.player.credits,
      wave: this.wave,
      shield: this.player.shield,
      armor: this.player.armor,
      weaponLevel: this.player.weaponLevel,
      superbombs: this.player.superbombs,
    });
  }

  private updatePlayer() {
    if (!this.player.isAlive) return;

    const p = this.player;
    const speed = this.input.focus ? this.currentShip.speed * 0.55 : this.currentShip.speed;

    // Movement
    let dx = 0;
    let dy = 0;
    if (this.input.left) dx -= 1;
    if (this.input.right) dx += 1;
    if (this.input.up) dy -= 1;
    if (this.input.down) dy += 1;

    // Diagonal normalization
    if (dx !== 0 && dy !== 0) {
      const factor = 1 / Math.SQRT2;
      dx *= factor;
      dy *= factor;
    }

    p.x += dx * speed;
    p.y += dy * speed;

    // Clamp inside playfield (leave room for HUD at bottom)
    p.x = Math.max(16, Math.min(this.LOGICAL_WIDTH - 16, p.x));
    p.y = Math.max(24, Math.min(this.LOGICAL_HEIGHT - 38, p.y));

    // Invulnerability tick
    if (p.invulnerableFrames > 0) {
      p.invulnerableFrames--;
    }

    // Shield Recharge
    if (p.shield < p.maxShield) {
      p.shield = Math.min(
        p.maxShield,
        p.shield + this.currentShip.shieldRechargeRate / 60
      );
    }

    // Weapons firing
    p.fireTimer++;
    if (this.input.fire && p.fireTimer >= this.currentWeapon.fireCooldown) {
      this.firePlayerWeapon();
      p.fireTimer = 0;
    }

    // Superbomb trigger check
    if (this.input.superbomb) {
      this.triggerSuperbomb();
      this.input.superbomb = false;
    }
  }

  private firePlayerWeapon() {
    const p = this.player;
    const w = this.currentWeapon;
    const spreadCount = w.spreadCount(p.weaponLevel);

    this.audio.playLaser(
      w.id === "vulcan_cannon"
        ? "vulcan"
        : w.id === "plasma_wave"
        ? "plasma"
        : w.id === "sonic_cannon"
        ? "sonic"
        : "pulse"
    );

    if (spreadCount === 1) {
      // Single central bolt
      this.projectiles.push({
        id: this.nextId++,
        x: p.x,
        y: p.y - 18,
        vx: 0,
        vy: -w.projectileSpeed,
        width: w.bulletRadius * 2,
        height: 12,
        damage: w.baseDamage,
        color: w.color,
        isPlayer: true,
      });
    } else {
      // Symmetrical spread
      const step = 0.85;
      const startAngle = -((spreadCount - 1) / 2) * step;

      for (let i = 0; i < spreadCount; i++) {
        const angle = startAngle + i * step;
        const vx = angle * 1.8;
        const vy = -w.projectileSpeed;
        const offsetX = (i - (spreadCount - 1) / 2) * 5;

        this.projectiles.push({
          id: this.nextId++,
          x: p.x + offsetX,
          y: p.y - 16,
          vx,
          vy,
          width: w.bulletRadius * 2,
          height: 10,
          damage: w.baseDamage,
          color: w.color,
          isPlayer: true,
        });
      }
    }

    // Sidekicks fire additional support laser bolts
    if (p.weaponLevel >= 2) {
      this.projectiles.push({
        id: this.nextId++,
        x: p.x - 28,
        y: p.y - 4,
        vx: -0.4,
        vy: -10,
        width: 3,
        height: 8,
        damage: 10,
        color: "#facc15",
        isPlayer: true,
      });
      this.projectiles.push({
        id: this.nextId++,
        x: p.x + 28,
        y: p.y - 4,
        vx: 0.4,
        vy: -10,
        width: 3,
        height: 8,
        damage: 10,
        color: "#facc15",
        isPlayer: true,
      });
    }
  }

  private updateProjectiles() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Offscreen culling
      if (p.y < -20 || p.y > this.LOGICAL_HEIGHT + 20 || p.x < -20 || p.x > this.LOGICAL_WIDTH + 20) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Player projectiles hitting enemies
      if (p.isPlayer) {
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const e = this.enemies[j];
          if (this.checkCollision(p, e)) {
            e.hp -= p.damage;
            this.projectiles.splice(i, 1);

            // Hit sparks
            this.createHitSparks(p.x, p.y, p.color);

            if (e.hp <= 0) {
              this.destroyEnemy(e);
              this.enemies.splice(j, 1);
            }
            break;
          }
        }
      } else {
        // Enemy projectiles hitting player
        if (this.player.isAlive && this.player.invulnerableFrames <= 0) {
          if (this.checkPlayerCollision(p)) {
            this.damagePlayer(p.damage);
            this.projectiles.splice(i, 1);
            this.createHitSparks(p.x, p.y, "#ef4444");
          }
        }
      }
    }
  }

  private checkCollision(
    p: { x: number; y: number; width: number; height: number },
    e: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      Math.abs(p.x - e.x) < (p.width + e.width) / 2 &&
      Math.abs(p.y - e.y) < (p.height + e.height) / 2
    );
  }

  private checkPlayerCollision(p: { x: number; y: number; width: number; height: number }): boolean {
    const playerRadius = 10;
    return (
      Math.abs(p.x - this.player.x) < playerRadius + p.width / 2 &&
      Math.abs(p.y - this.player.y) < playerRadius + p.height / 2
    );
  }

  private damagePlayer(amount: number) {
    this.renderer.addScreenShake(6);

    if (this.player.shield >= amount) {
      this.player.shield -= amount;
      this.audio.playShieldHit();
    } else {
      const overflow = amount - this.player.shield;
      this.player.shield = 0;
      this.player.armor -= overflow;
      this.audio.playExplosion("small");

      if (this.player.armor <= 0) {
        this.player.armor = 0;
        this.killPlayer();
      }
    }
  }

  private killPlayer() {
    this.player.isAlive = false;
    this.audio.playExplosion("boss");
    this.renderer.addScreenShake(18);

    // Explosion particles
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 5;
      this.particles.push({
        x: this.player.x,
        y: this.player.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 60,
        maxLife: 60,
        color: i % 2 === 0 ? "#f97316" : "#facc15",
        size: 3,
      });
    }

    this.phase = "gameover";
    this.saveHighScore();
    this.callbacks.onPhaseChange?.("gameover");
  }

  private destroyEnemy(e: Enemy) {
    this.player.score += e.scoreValue;
    this.player.credits += e.creditValue;
    this.saveHighScore();

    if (e.type === "boss") {
      this.audio.playExplosion("boss");
      this.renderer.addScreenShake(18);
      this.bossActive = false;
      this.phase = "victory";
      this.callbacks.onPhaseChange?.("victory");
    } else {
      this.audio.playExplosion(e.type === "gunship" ? "medium" : "small");
      this.renderer.addScreenShake(e.type === "gunship" ? 4 : 2);
    }

    // Explosion debris particles
    const particleCount = e.type === "boss" ? 120 : e.type === "gunship" ? 35 : 18;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      this.particles.push({
        x: e.x,
        y: e.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        color: i % 3 === 0 ? "#ef4444" : i % 3 === 1 ? "#f59e0b" : "#fef08a",
        size: 2.5,
      });
    }

    // Random Loot / Powerup Drop
    const dropRoll = Math.random();
    if (dropRoll < 0.22) {
      const pTypes: Powerup["type"][] = ["shield", "weapon_upgrade", "credit", "superbomb"];
      const chosenType = pTypes[Math.floor(Math.random() * pTypes.length)];

      this.powerups.push({
        id: this.nextId++,
        type: chosenType,
        x: e.x,
        y: e.y,
        vy: 1.2,
        size: 9,
        value: chosenType === "credit" ? 25 : 1,
        pulsePhase: 0,
      });
    }
  }

  private updateEnemies() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.timeAlive++;

      // AI movement by type
      if (e.type === "scout") {
        // Diving sweep
        e.y += e.vy;
        e.x = e.initialX + Math.sin(e.timeAlive * 0.08) * 35;
      } else if (e.type === "interceptor") {
        // Fast zigzag dive
        e.y += e.vy;
        e.x += e.vx;
        if (e.x < 20 || e.x > this.LOGICAL_WIDTH - 20) {
          e.vx = -e.vx;
        }
      } else if (e.type === "gunship") {
        // Slow advance, stops at top third and moves left-right
        if (e.y < 70) {
          e.y += e.vy;
        } else {
          e.x += e.vx;
          if (e.x < 35 || e.x > this.LOGICAL_WIDTH - 35) {
            e.vx = -e.vx;
          }
        }
      } else if (e.type === "asteroid") {
        e.y += e.vy;
      } else if (e.type === "boss") {
        // Boss moves side to side majestically
        if (e.y < 55) {
          e.y += e.vy;
        } else {
          e.x = this.LOGICAL_WIDTH / 2 + Math.sin(e.timeAlive * 0.03) * 60;
        }
      }

      // Firing pattern
      e.fireCooldown--;
      if (e.fireCooldown <= 0 && e.y > 0 && e.y < this.LOGICAL_HEIGHT - 40) {
        this.fireEnemy(e);
      }

      // Collision with player hull
      if (this.player.isAlive && this.player.invulnerableFrames <= 0) {
        if (this.checkPlayerCollision(e)) {
          this.damagePlayer(25);
          e.hp -= 35;
          if (e.hp <= 0) {
            this.destroyEnemy(e);
            this.enemies.splice(i, 1);
            continue;
          }
        }
      }

      // Offscreen culling (except boss)
      if (e.type !== "boss" && e.y > this.LOGICAL_HEIGHT + 30) {
        this.enemies.splice(i, 1);
      }
    }
  }

  private fireEnemy(e: Enemy) {
    if (e.type === "scout") {
      e.fireCooldown = 90 + Math.random() * 40;
      this.projectiles.push({
        id: this.nextId++,
        x: e.x,
        y: e.y + 10,
        vx: 0,
        vy: 3.5,
        width: 5,
        height: 5,
        damage: 12,
        color: "#ef4444",
        isPlayer: false,
      });
      this.audio.playEnemyLaser();
    } else if (e.type === "interceptor") {
      e.fireCooldown = 60 + Math.random() * 30;
      // Aimed shot towards player
      const angle = Math.atan2(this.player.y - e.y, this.player.x - e.x);
      this.projectiles.push({
        id: this.nextId++,
        x: e.x,
        y: e.y + 12,
        vx: Math.cos(angle) * 4.2,
        vy: Math.sin(angle) * 4.2,
        width: 5,
        height: 5,
        damage: 16,
        color: "#f59e0b",
        isPlayer: false,
      });
      this.audio.playEnemyLaser();
    } else if (e.type === "gunship") {
      e.fireCooldown = 80;
      // Twin cannons
      this.projectiles.push({
        id: this.nextId++,
        x: e.x - 12,
        y: e.y + 14,
        vx: -0.5,
        vy: 4.0,
        width: 6,
        height: 6,
        damage: 18,
        color: "#f43f5e",
        isPlayer: false,
      });
      this.projectiles.push({
        id: this.nextId++,
        x: e.x + 12,
        y: e.y + 14,
        vx: 0.5,
        vy: 4.0,
        width: 6,
        height: 6,
        damage: 18,
        color: "#f43f5e",
        isPlayer: false,
      });
      this.audio.playEnemyLaser();
    } else if (e.type === "boss") {
      e.fireCooldown = 50;
      // 3-way spread laser barrage
      const angles = [-0.35, 0, 0.35];
      for (const a of angles) {
        this.projectiles.push({
          id: this.nextId++,
          x: e.x,
          y: e.y + 35,
          vx: Math.sin(a) * 4.5,
          vy: Math.cos(a) * 4.5,
          width: 7,
          height: 7,
          damage: 22,
          color: "#e11d48",
          isPlayer: false,
        });
      }
      this.audio.playEnemyLaser();
    }
  }

  private updatePowerups() {
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.y += p.vy;
      p.pulsePhase += 0.1;

      // Check player collection
      if (
        this.player.isAlive &&
        this.checkPlayerCollision({
          x: p.x,
          y: p.y,
          width: p.size * 2,
          height: p.size * 2,
        })
      ) {
        this.collectPowerup(p);
        this.powerups.splice(i, 1);
        continue;
      }

      if (p.y > this.LOGICAL_HEIGHT + 20) {
        this.powerups.splice(i, 1);
      }
    }
  }

  private collectPowerup(p: Powerup) {
    this.audio.playPowerup();

    if (p.type === "shield") {
      this.player.shield = Math.min(
        this.player.maxShield,
        this.player.shield + 40
      );
      this.player.armor = Math.min(
        this.player.maxArmor,
        this.player.armor + 20
      );
    } else if (p.type === "weapon_upgrade") {
      if (this.player.weaponLevel < this.player.maxWeaponLevel) {
        this.player.weaponLevel++;
      }
      this.player.score += 500;
    } else if (p.type === "superbomb") {
      if (this.player.superbombs < this.player.maxSuperbombs) {
        this.player.superbombs++;
      }
    } else if (p.type === "credit") {
      this.player.credits += 50;
      this.player.score += 250;
    }
  }

  private updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private createHitSparks(x: number, y: number, color: string) {
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 15,
        maxLife: 15,
        color,
        size: 1.5,
      });
    }
  }

  private updateWaves() {
    if (this.bossActive) return;

    this.waveTimer++;

    // Wave Spawning sequences
    if (this.wave === 1) {
      if (this.waveTimer % 65 === 0 && this.waveSpawnIndex < 10) {
        this.spawnScoutFormation();
        this.waveSpawnIndex++;
      }
    } else if (this.wave === 2) {
      if (this.waveTimer % 55 === 0 && this.waveSpawnIndex < 14) {
        if (this.waveSpawnIndex % 3 === 0) {
          this.spawnInterceptor();
        } else {
          this.spawnScoutFormation();
        }
        this.waveSpawnIndex++;
      }
    } else if (this.wave === 3) {
      if (this.waveTimer % 50 === 0 && this.waveSpawnIndex < 16) {
        if (this.waveSpawnIndex % 4 === 0) {
          this.spawnGunship();
        } else if (this.waveSpawnIndex % 2 === 0) {
          this.spawnInterceptor();
        } else {
          this.spawnAsteroid();
        }
        this.waveSpawnIndex++;
      }
    } else if (this.wave === 4) {
      if (this.waveTimer % 45 === 0 && this.waveSpawnIndex < 18) {
        if (this.waveSpawnIndex % 3 === 0) {
          this.spawnGunship();
        } else {
          this.spawnInterceptor();
          this.spawnAsteroid();
        }
        this.waveSpawnIndex++;
      }
    } else if (this.wave >= 5 && !this.bossActive) {
      // Spawn Mega Dreadnought Boss!
      this.spawnBoss();
      return;
    }

    // Check wave completion
    if (
      this.enemies.length === 0 &&
      this.waveTimer > 300 &&
      !this.bossActive
    ) {
      this.waveClearTimer++;
      if (this.waveClearTimer > 120) {
        this.wave++;
        this.waveTimer = 0;
        this.waveSpawnIndex = 0;
        this.waveClearTimer = 0;
        this.audio.playPowerup();
      }
    }
  }

  private spawnScoutFormation() {
    const startX = 40 + Math.random() * (this.LOGICAL_WIDTH - 80);
    this.enemies.push({
      id: this.nextId++,
      type: "scout",
      x: startX,
      y: -15,
      vx: 0,
      vy: 2.2,
      width: 18,
      height: 18,
      hp: 35,
      maxHp: 35,
      scoreValue: 100,
      creditValue: 10,
      fireCooldown: 50 + Math.random() * 40,
      timeAlive: 0,
      initialX: startX,
    });
  }

  private spawnInterceptor() {
    const startX = 30 + Math.random() * (this.LOGICAL_WIDTH - 60);
    this.enemies.push({
      id: this.nextId++,
      type: "interceptor",
      x: startX,
      y: -20,
      vx: (Math.random() - 0.5) * 3,
      vy: 3.2,
      width: 22,
      height: 22,
      hp: 60,
      maxHp: 60,
      scoreValue: 200,
      creditValue: 20,
      fireCooldown: 40 + Math.random() * 30,
      timeAlive: 0,
      initialX: startX,
    });
  }

  private spawnGunship() {
    const startX = 60 + Math.random() * (this.LOGICAL_WIDTH - 120);
    this.enemies.push({
      id: this.nextId++,
      type: "gunship",
      x: startX,
      y: -30,
      vx: 1.2,
      vy: 1.5,
      width: 36,
      height: 30,
      hp: 220,
      maxHp: 220,
      scoreValue: 600,
      creditValue: 60,
      fireCooldown: 45,
      timeAlive: 0,
      initialX: startX,
    });
  }

  private spawnAsteroid() {
    const startX = 20 + Math.random() * (this.LOGICAL_WIDTH - 40);
    this.enemies.push({
      id: this.nextId++,
      type: "asteroid",
      x: startX,
      y: -25,
      vx: (Math.random() - 0.5) * 0.8,
      vy: 1.8 + Math.random() * 1.5,
      width: 26,
      height: 26,
      hp: 80,
      maxHp: 80,
      scoreValue: 150,
      creditValue: 15,
      fireCooldown: 999999, // Asteroids do not fire
      timeAlive: 0,
      initialX: startX,
    });
  }

  private spawnBoss() {
    this.bossActive = true;
    this.audio.playBossWarning();

    this.enemies.push({
      id: this.nextId++,
      type: "boss",
      x: this.LOGICAL_WIDTH / 2,
      y: -70,
      vx: 1.2,
      vy: 0.8,
      width: 90,
      height: 70,
      hp: 1800,
      maxHp: 1800,
      scoreValue: 10000,
      creditValue: 500,
      fireCooldown: 60,
      timeAlive: 0,
      initialX: this.LOGICAL_WIDTH / 2,
      phase: 1,
      maxPhases: 3,
    });
  }

  private render() {
    this.renderer.clear();
    this.renderer.render(
      this.starfield,
      this.player,
      this.currentShip,
      this.enemies,
      this.projectiles,
      this.powerups,
      this.particles,
      this.wave,
      this.highScore,
      60
    );
  }
}
