import { ShipConfig, ShipId } from "./types";

export const SHIPS: Record<ShipId, ShipConfig> = {
  talon: {
    id: "talon",
    name: "USP Talon",
    manufacturer: "United Systems Patrol",
    speed: 5.5,
    maxArmor: 100,
    maxShield: 100,
    shieldRechargeRate: 14, // shield/sec
    primaryWeapon: "pulse_blaster",
    description: "Pesawat tempur standar Trent Hawkins. Seimbang, lincah, dan memiliki regenerasi perisai stabil.",
    hullColor: "#38bdf8", // Cyan
    accentColor: "#fbbf24", // Amber
    special: "Generator Overdrive (Regen Shield Cepat)",
  },
  phoenix: {
    id: "phoenix",
    name: "Gencore Phoenix",
    manufacturer: "Gencore War Technologies",
    speed: 4.4,
    maxArmor: 160,
    maxShield: 130,
    shieldRechargeRate: 10,
    primaryWeapon: "vulcan_cannon",
    description: "Kapal lapis baja kelas berat dengan persenjataan multi-laras. Tahan benturan keras.",
    hullColor: "#f97316", // Orange
    accentColor: "#ef4444", // Red
    special: "Armor Reinforced Plating (+60% Armor)",
  },
  stalker: {
    id: "stalker",
    name: "MicroSol Stalker",
    manufacturer: "MicroSol Experimental Fleet",
    speed: 6.6,
    maxArmor: 75,
    maxShield: 90,
    shieldRechargeRate: 18,
    primaryWeapon: "plasma_wave",
    description: "Prototipe siluman MicroSol dengan dorongan ion ganda. Kecepatan manuver tak tertandingi.",
    hullColor: "#a855f7", // Purple
    accentColor: "#22c55e", // Lime
    special: "Hyper-Velocity Thrusters (+20% Speed)",
  },
};
