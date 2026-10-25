import { describe, it, expect } from "vitest";
import { SHIPS } from "./ships";
import { WEAPONS } from "./weapons";
import { Starfield } from "./starfield";

describe("Tyrian Web Engine — Ships & Weapons Configuration", () => {
  it("should define all three iconic ships with valid configurations", () => {
    expect(SHIPS.talon).toBeDefined();
    expect(SHIPS.phoenix).toBeDefined();
    expect(SHIPS.stalker).toBeDefined();

    expect(SHIPS.talon.maxArmor).toBeGreaterThan(0);
    expect(SHIPS.talon.maxShield).toBeGreaterThan(0);
    expect(SHIPS.talon.speed).toBeGreaterThan(0);

    expect(SHIPS.phoenix.maxArmor).toBeGreaterThan(SHIPS.talon.maxArmor);
    expect(SHIPS.stalker.speed).toBeGreaterThan(SHIPS.talon.speed);
  });

  it("should configure all weapon profiles with scalable spread", () => {
    expect(WEAPONS.pulse_blaster).toBeDefined();
    expect(WEAPONS.vulcan_cannon).toBeDefined();
    expect(WEAPONS.plasma_wave).toBeDefined();
    expect(WEAPONS.sonic_cannon).toBeDefined();

    // Spread count increases with level
    expect(WEAPONS.pulse_blaster.spreadCount(1)).toBeLessThanOrEqual(
      WEAPONS.pulse_blaster.spreadCount(5)
    );
    expect(WEAPONS.vulcan_cannon.spreadCount(3)).toBeGreaterThan(
      WEAPONS.vulcan_cannon.spreadCount(1)
    );
  });
});

describe("Tyrian Web Engine — 3D Parallax Starfield", () => {
  it("should initialize starfield without errors and update positions", () => {
    const starfield = new Starfield(320, 240, 50);
    expect(starfield).toBeDefined();

    // Updating starfield does not throw
    expect(() => starfield.update(1.0)).not.toThrow();
    expect(() => starfield.update(2.0)).not.toThrow();
  });
});
