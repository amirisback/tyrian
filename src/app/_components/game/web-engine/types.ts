export type ShipId = "talon" | "phoenix" | "stalker";

export interface ShipConfig {
  id: ShipId;
  name: string;
  manufacturer: string;
  speed: number;
  maxArmor: number;
  maxShield: number;
  shieldRechargeRate: number; // shield per second
  primaryWeapon: WeaponId;
  description: string;
  hullColor: string;
  accentColor: string;
  special: string;
}

export type WeaponId = "pulse_blaster" | "vulcan_cannon" | "plasma_wave" | "sonic_cannon";

export interface WeaponConfig {
  id: WeaponId;
  name: string;
  fireCooldown: number; // frames between shots (at 60fps)
  baseDamage: number;
  projectileSpeed: number;
  color: string;
  bulletRadius: number;
  spreadCount: (level: number) => number;
}

export interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  damage: number;
  color: string;
  isPlayer: boolean;
  trailColor?: string;
}

export type EnemyType = "scout" | "interceptor" | "gunship" | "asteroid" | "boss";

export interface BossTurret {
  id: number;
  offsetX: number;
  offsetY: number;
  hp: number;
  maxHp: number;
  fireCooldown: number;
  isDestroyed: boolean;
}

export interface Enemy {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  scoreValue: number;
  creditValue: number;
  fireCooldown: number;
  timeAlive: number;
  initialX: number;
  phase?: number;
  maxPhases?: number;
  turrets?: BossTurret[];
}

export type PowerupType = "shield" | "weapon_upgrade" | "credit" | "superbomb";

export interface Powerup {
  id: number;
  type: PowerupType;
  x: number;
  y: number;
  vy: number;
  size: number;
  value: number;
  pulsePhase: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface Star {
  spX: number;
  spY: number;
  spZ: number;
  lastX: number;
  lastY: number;
  color: string;
}

export type GamePhase = "menu" | "playing" | "paused" | "gameover" | "victory";

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  shipId: ShipId;
  shield: number;
  maxShield: number;
  armor: number;
  maxArmor: number;
  weaponLevel: number;
  maxWeaponLevel: number;
  superbombs: number;
  maxSuperbombs: number;
  score: number;
  credits: number;
  invulnerableFrames: number;
  isAlive: boolean;
  fireTimer: number;
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  fire: boolean;
  superbomb: boolean;
  focus: boolean;
}
