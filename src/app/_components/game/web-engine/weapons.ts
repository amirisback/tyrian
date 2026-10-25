import { WeaponConfig, WeaponId } from "./types";

export const WEAPONS: Record<WeaponId, WeaponConfig> = {
  pulse_blaster: {
    id: "pulse_blaster",
    name: "Pulse Blaster",
    fireCooldown: 8, // fast
    baseDamage: 22,
    projectileSpeed: 11,
    color: "#38bdf8", // Cyan
    bulletRadius: 3,
    spreadCount: (level) => Math.min(5, 1 + Math.floor(level / 2)),
  },
  vulcan_cannon: {
    id: "vulcan_cannon",
    name: "Vulcan Cannon",
    fireCooldown: 6, // very fast
    baseDamage: 14,
    projectileSpeed: 12,
    color: "#f59e0b", // Amber
    bulletRadius: 2.5,
    spreadCount: (level) => Math.min(7, 2 + level),
  },
  plasma_wave: {
    id: "plasma_wave",
    name: "Plasma Wave",
    fireCooldown: 14,
    baseDamage: 40,
    projectileSpeed: 8.5,
    color: "#a855f7", // Purple / Violet
    bulletRadius: 6,
    spreadCount: (level) => Math.min(4, 1 + Math.floor(level / 3)),
  },
  sonic_cannon: {
    id: "sonic_cannon",
    name: "Sonic Wave",
    fireCooldown: 11,
    baseDamage: 32,
    projectileSpeed: 10,
    color: "#22c55e", // Emerald
    bulletRadius: 4.5,
    spreadCount: (level) => Math.min(5, 1 + Math.floor(level / 2)),
  },
};
