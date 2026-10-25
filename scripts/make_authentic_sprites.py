"""
Enhanced pixel-art generator for authentic OpenTyrian sprites.
Implements multi-level shading, mechanical surface detailing, and authentic 1995 DOS VGA palette.
"""

import os
from PIL import Image, ImageDraw

os.makedirs("public/sprites", exist_ok=True)

def add_outline(im, outline_color):
    w, h = im.size
    out = im.copy()
    for y in range(h):
        for x in range(w):
            if im.getpixel((x, y))[3] == 0:
                # 4-neighbor check
                for nx, ny in ((x-1,y), (x+1,y), (x,y-1), (x,y+1)):
                    if 0 <= nx < w and 0 <= ny < h:
                        if im.getpixel((nx, ny))[3] > 0:
                            out.putpixel((x, y), outline_color)
                            break
    return out

def create_talon():
    # USP Talon: 36x36 cyan/teal light fighter with dual cannons and amber cockpit
    w, h = 36, 36
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    C_OUTLINE = (10, 25, 45, 255)
    C_DARK = (15, 60, 110, 255)
    C_MID = (25, 115, 185, 255)
    C_LIGHT = (45, 180, 240, 255)
    C_HI = (160, 230, 255, 255)
    C_WHITE = (240, 250, 255, 255)

    C_GOLD_DARK = (160, 95, 10, 255)
    C_GOLD = (235, 170, 25, 255)
    C_GOLD_HI = (255, 240, 140, 255)

    C_STEEL = (70, 85, 105, 255)
    C_STEEL_HI = (140, 160, 185, 255)
    C_RED = (225, 40, 40, 255)

    # Wings silhouette (left and right)
    for y in range(h):
        for x in range(w // 2 + 1):
            rx = w - 1 - x
            # Nose cone
            if y < 8 and abs(x - 17) <= y // 2:
                for px in (x, rx):
                    im.putpixel((px, y), C_MID)
            # Center fuselage
            elif 8 <= y <= 24 and abs(x - 17) <= 4:
                for px in (x, rx):
                    im.putpixel((px, y), C_MID)
            # Swept forward wings
            elif 14 <= y <= 28 and 2 <= x <= 17:
                if (x - 2) * 1.2 <= (y - 12):
                    for px in (x, rx):
                        im.putpixel((px, y), C_DARK)
            # Wing tips & nacelles
            elif 18 <= y <= 30 and 1 <= x <= 6:
                for px in (x, rx):
                    im.putpixel((px, y), C_STEEL)

    # Shading passes on fuselage
    for y in range(4, 25):
        im.putpixel((17, y), C_LIGHT)
        im.putpixel((18, y), C_HI)
        if y < 22:
            im.putpixel((16, y), C_MID)
            im.putpixel((19, y), C_MID)
            im.putpixel((15, y), C_DARK)
            im.putpixel((20, y), C_DARK)

    # Amber Cockpit Canopy (y: 10 to 16)
    for y in range(10, 16):
        pw = 1 if y in (10, 15) else 2
        for x in range(17 - pw, 18 + pw + 1):
            im.putpixel((x, y), C_GOLD)
    im.putpixel((17, 11), C_GOLD_HI)
    im.putpixel((18, 11), C_WHITE)
    im.putpixel((17, 12), C_WHITE)

    # Wing panel highlights & panel seams
    for x in range(7, 15):
        y = int(14 + (15 - x) * 1.1)
        im.putpixel((x, y), C_LIGHT)
        im.putpixel((w - 1 - x, y), C_LIGHT)
        im.putpixel((x, y + 1), C_HI)
        im.putpixel((w - 1 - x, y + 1), C_HI)

    # Wingtip Twin Cannons
    for y in range(8, 20):
        for cx in (2, 33):
            im.putpixel((cx, y), C_STEEL)
            im.putpixel((cx + 1, y), C_STEEL_HI)
    im.putpixel((2, 7), C_RED)
    im.putpixel((3, 7), C_RED)
    im.putpixel((32, 7), C_RED)
    im.putpixel((33, 7), C_RED)

    # Thruster nozzles
    for cx in (12, 13, 22, 23):
        for y in range(26, 31):
            im.putpixel((cx, y), C_STEEL)
    im.putpixel((12, 31), C_GOLD)
    im.putpixel((13, 31), C_GOLD_HI)
    im.putpixel((22, 31), C_GOLD)
    im.putpixel((23, 31), C_GOLD_HI)

    im = add_outline(im, C_OUTLINE)
    im.save("public/sprites/ship_talon.png")
    print("Created public/sprites/ship_talon.png")

def create_phoenix():
    # Gencore Phoenix: 40x40 heavy armored assault gunship with multi-tiered crimson & bronze armor
    w, h = 40, 40
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    C_OUTLINE = (35, 10, 10, 255)
    C_DEEP = (80, 15, 15, 255)
    C_SHADOW = (140, 25, 25, 255)
    C_BASE = (195, 45, 30, 255)
    C_MID = (235, 80, 35, 255)
    C_LIGHT = (255, 135, 45, 255)
    C_HI = (255, 205, 90, 255)
    C_WHITE = (255, 250, 220, 255)

    C_BRONZE_DARK = (110, 70, 20, 255)
    C_BRONZE = (175, 120, 40, 255)
    C_BRONZE_HI = (240, 185, 70, 255)

    C_STEEL = (50, 55, 65, 255)
    C_STEEL_HI = (100, 110, 130, 255)
    C_CYAN_VISOR = (56, 189, 248, 255)
    C_VISOR_HI = (224, 242, 254, 255)

    cx = 19

    # 1. Main Wing and Hull Mass (heavy swept delta wings)
    for y in range(6, 36):
        for x in range(cx + 1):
            rx = w - 1 - x
            dx = cx - x
            # Front armored nose (y: 6 to 16)
            if y <= 16 and dx <= (y - 5) * 0.7:
                for px in (x, rx):
                    im.putpixel((px, y), C_BASE)
            # Armored wing shoulders (y: 12 to 32)
            elif 12 <= y <= 32 and dx <= 18:
                if dx * 1.1 <= (y - 8):
                    for px in (x, rx):
                        im.putpixel((px, y), C_MID)
            # Engine bays (y: 26 to 36)
            elif 26 <= y <= 36 and (7 <= x <= 14):
                for px in (x, rx):
                    im.putpixel((px, y), C_DEEP)

    # 2. Bronze Armored Center Plate & Intake Cowlings
    for y in range(12, 24):
        for dx in range(0, 7):
            col = C_BRONZE_HI if dx == 0 else C_BRONZE if dx < 5 else C_BRONZE_DARK
            im.putpixel((cx - dx, y), col)
            im.putpixel((cx + 1 + dx, y), col)

    # 3. Highlighting Center Armor Keel
    for y in range(7, 28):
        im.putpixel((cx, y), C_HI)
        im.putpixel((cx + 1, y), C_LIGHT)

    # 4. Command Visor (dual horizontal cyan optics)
    for vx in (cx - 3, cx - 2, cx + 2, cx + 3):
        im.putpixel((vx, 11), C_CYAN_VISOR)
        im.putpixel((vx, 12), C_VISOR_HI)

    # 5. Heavy Quad Cannons (Outer pods x=3,4; Inner pods x=9,10)
    for y in range(8, 26):
        for bx in (3, 9, w - 5, w - 11):
            im.putpixel((bx, y), C_STEEL)
            im.putpixel((bx + 1, y), C_STEEL_HI)
    # Glowing cannon muzzle flash vents
    for bx in (3, 9, w - 5, w - 11):
        im.putpixel((bx, 7), (255, 80, 20, 255))
        im.putpixel((bx + 1, 7), (255, 200, 50, 255))

    # 6. Twin Dual Thruster Exhausts (y: 34 to 38)
    for tx in (9, 10, w - 11, w - 12):
        for y in range(33, 38):
            im.putpixel((tx, y), C_STEEL_DARK if 'C_STEEL_DARK' in locals() else C_STEEL)
        im.putpixel((tx, 38), (255, 200, 50, 255))

    im = add_outline(im, C_OUTLINE)
    im.save("public/sprites/ship_phoenix.png")
    print("Created public/sprites/ship_phoenix.png")

def create_stalker():
    # MicroSol Stalker: 36x36 violet/purple stealth fighter with neon green conduits
    w, h = 36, 36
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    C_OUTLINE = (25, 10, 45, 255)
    C_DEEP = (45, 15, 80, 255)
    C_DARK = (75, 25, 125, 255)
    C_MID = (120, 45, 190, 255)
    C_LIGHT = (175, 90, 240, 255)
    C_HI = (225, 165, 255, 255)

    C_NEON = (34, 197, 94, 255)
    C_NEON_HI = (187, 247, 208, 255)
    C_STEEL = (55, 65, 80, 255)

    cx = 17

    # Needle spear nose and swept blade wings
    for y in range(h):
        for x in range(cx + 1):
            rx = w - 1 - x
            dx = cx - x
            # Forward needle probe
            if y < 10 and dx <= (y // 3):
                for px in (x, rx):
                    im.putpixel((px, y), C_MID)
            # Angular diamond cockpit & body
            elif 10 <= y <= 26 and dx <= 6:
                for px in (x, rx):
                    im.putpixel((px, y), C_MID)
            # Swept forward reverse-gull wings
            elif 14 <= y <= 32 and (2 <= x <= 16):
                if dx * 1.5 >= (y - 14):
                    for px in (x, rx):
                        im.putpixel((px, y), C_DARK)

    # Dorsal Spine Highlight
    for y in range(3, 26):
        im.putpixel((cx, y), C_HI)
        im.putpixel((cx + 1, y), C_LIGHT)

    # Neon Green Conduit Inlays
    for y in range(12, 26, 2):
        im.putpixel((cx - 3, y), C_NEON)
        im.putpixel((cx + 4, y), C_NEON)
        im.putpixel((cx - 3, y + 1), C_NEON_HI)
        im.putpixel((cx + 4, y + 1), C_NEON_HI)

    # Forward plasma cannons on wingtips
    for y in range(10, 20):
        for bx in (2, w - 4):
            im.putpixel((bx, y), C_STEEL)
            im.putpixel((bx + 1, y), C_NEON)
    im.putpixel((2, 9), C_NEON_HI)
    im.putpixel((w - 3, 9), C_NEON_HI)

    im = add_outline(im, C_OUTLINE)
    im.save("public/sprites/ship_stalker.png")
    print("Created public/sprites/ship_stalker.png")

def create_enemy_scout():
    # Scout Drone: 28x28 insectoid beetle fighter with bronze plates and glowing optic
    w, h = 28, 28
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    C_OUTLINE = (15, 30, 20, 255)
    C_DARK = (20, 75, 45, 255)
    C_JADE = (34, 140, 80, 255)
    C_JADE_HI = (90, 220, 140, 255)
    C_BRONZE = (150, 100, 35, 255)
    C_BRONZE_HI = (220, 165, 65, 255)
    C_RED_EYE = (239, 68, 68, 255)
    C_EYE_HI = (254, 226, 226, 255)

    cx = 13
    for y in range(h):
        for x in range(cx + 1):
            rx = w - 1 - x
            dx = cx - x
            # Carapace dome (facing down towards player)
            if 3 <= y <= 18 and dx <= 9:
                if dx * dx + (y - 10)**2 <= 64:
                    for px in (x, rx):
                        im.putpixel((px, y), C_JADE)
            # Mandible pincer blades pointing DOWN
            elif 16 <= y <= 26 and (4 <= dx <= 11):
                if (11 - dx) * 1.4 <= (26 - y):
                    for px in (x, rx):
                        im.putpixel((px, y), C_BRONZE)

    # Shell highlights
    for x in range(cx - 5, cx + 7):
        im.putpixel((x, 6), C_JADE_HI)
        im.putpixel((x, 7), C_JADE)

    # Mandible highlights
    for y in range(18, 25):
        im.putpixel((cx - 7, y), C_BRONZE_HI)
        im.putpixel((cx + 8, y), C_BRONZE_HI)

    # Central glowing red sensory eye
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            if dx*dx + dy*dy <= 4:
                im.putpixel((cx + dx, 12 + dy), C_RED_EYE)
    im.putpixel((cx, 11), C_EYE_HI)
    im.putpixel((cx + 1, 11), C_EYE_HI)

    im = add_outline(im, C_OUTLINE)
    im.save("public/sprites/enemy_scout.png")
    print("Created public/sprites/enemy_scout.png")

def create_enemy_interceptor():
    # Interceptor: 30x30 crimson dagger attack fighter pointing down
    w, h = 30, 30
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    C_OUTLINE = (40, 10, 10, 255)
    C_DARK = (100, 20, 20, 255)
    C_RED = (195, 35, 35, 255)
    C_HI = (250, 110, 110, 255)
    C_STEEL = (60, 65, 75, 255)
    C_STEEL_HI = (120, 130, 150, 255)
    C_YELLOW_VISOR = (250, 204, 21, 255)

    cx = 14
    for y in range(h):
        for x in range(cx + 1):
            rx = w - 1 - x
            dx = cx - x
            # Spear point diving down
            if 12 <= y <= 26 and dx <= (26 - y) * 0.9:
                for px in (x, rx):
                    im.putpixel((px, y), C_RED)
            # Swept dorsal wings
            elif 4 <= y <= 16 and (3 <= dx <= 13):
                if dx >= (y - 2):
                    for px in (x, rx):
                        im.putpixel((px, y), C_DARK)

    # Shading along keel
    for y in range(8, 25):
        im.putpixel((cx, y), C_HI)
        im.putpixel((cx + 1, y), C_RED)

    # Yellow Visor Bar
    for vx in range(cx - 3, cx + 5):
        im.putpixel((vx, 15), C_YELLOW_VISOR)

    # Twin side wing blades
    for y in range(4, 14):
        im.putpixel((2, y), C_STEEL)
        im.putpixel((3, y), C_STEEL_HI)
        im.putpixel((w - 4, y), C_STEEL_HI)
        im.putpixel((w - 3, y), C_STEEL)

    im = add_outline(im, C_OUTLINE)
    im.save("public/sprites/enemy_interceptor.png")
    print("Created public/sprites/enemy_interceptor.png")

def create_enemy_gunship():
    # Gunship: 46x40 heavy armored assault frigate with dual gun sponsons and command deck
    w, h = 46, 40
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    C_OUTLINE = (20, 15, 30, 255)
    C_DEEP = (45, 25, 60, 255)
    C_PURPLE = (110, 45, 155, 255)
    C_PURPLE_HI = (185, 115, 235, 255)
    C_STEEL = (55, 60, 75, 255)
    C_STEEL_HI = (120, 130, 150, 255)
    C_GOLD = (235, 175, 35, 255)
    C_RED_BEACON = (239, 68, 68, 255)

    cx = 22
    for y in range(h):
        for x in range(cx + 1):
            rx = w - 1 - x
            dx = cx - x
            # Armored prow pointing downward (y: 12 to 32)
            if 12 <= y <= 32 and dx <= 11:
                if dx * 1.3 <= (34 - y):
                    for px in (x, rx):
                        im.putpixel((px, y), C_PURPLE)
            # Massive side weapon sponsons (x: 2 to 9, y: 8 to 26)
            elif 8 <= y <= 26 and (12 <= dx <= 20):
                for px in (x, rx):
                    im.putpixel((px, y), C_STEEL)

    # Armored Deck Ridge Lines
    for y in range(10, 30):
        im.putpixel((cx, y), C_PURPLE_HI)
        im.putpixel((cx + 1, y), C_PURPLE)

    # Command Bridge Visor (emerald green slit)
    for vx in range(cx - 4, cx + 6):
        im.putpixel((vx, 18), (34, 197, 94, 255))
        im.putpixel((vx, 19), (187, 247, 208, 255))

    # Heavy Twin Forward Laser Cannons
    for y in range(24, 37):
        for bx in (4, 5, w - 6, w - 7):
            im.putpixel((bx, y), C_GOLD)
        im.putpixel((4, 37), C_RED_BEACON)
        im.putpixel((5, 37), C_RED_BEACON)
        im.putpixel((w - 7, 37), C_RED_BEACON)
        im.putpixel((w - 6, 37), C_RED_BEACON)

    im = add_outline(im, C_OUTLINE)
    im.save("public/sprites/enemy_gunship.png")
    print("Created public/sprites/enemy_gunship.png")

def create_enemy_asteroid():
    # Asteroid: 32x32 textured cratered volumetric space rock
    w, h = 32, 32
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    C_OUTLINE = (20, 25, 35, 255)
    C_DARK = (45, 55, 70, 255)
    C_MID = (85, 100, 120, 255)
    C_LIGHT = (135, 150, 170, 255)
    C_HI = (200, 215, 235, 255)
    C_CRATER = (30, 35, 45, 255)

    cx, cy = 15, 15
    radius = 13

    for y in range(h):
        for x in range(w):
            dx, dy = x - cx, y - cy
            dist = (dx * dx + dy * dy) ** 0.5
            angle = (dx + 2 * dy) * 0.4
            noise = (angle % 3) - 1.5
            if dist + noise <= radius:
                light = (-dx - dy) / (radius * 1.4)
                if light > 0.45:
                    col = C_HI
                elif light > 0.1:
                    col = C_LIGHT
                elif light > -0.25:
                    col = C_MID
                else:
                    col = C_DARK
                im.putpixel((x, y), col)

    craters = [(10, 10, 3), (20, 17, 4.5), (13, 21, 2.5)]
    for (kx, ky, kr) in craters:
        for y in range(int(ky - kr), int(ky + kr + 1)):
            for x in range(int(kx - kr), int(kx + kr + 1)):
                if (x - kx)**2 + (y - ky)**2 <= kr**2:
                    im.putpixel((x, y), C_CRATER)
        im.putpixel((int(kx - kr), int(ky - kr)), C_HI)
        im.putpixel((int(kx), int(ky - kr)), C_LIGHT)

    im = add_outline(im, C_OUTLINE)
    im.save("public/sprites/enemy_asteroid.png")
    print("Created public/sprites/enemy_asteroid.png")

def create_powerups():
    def make_sphere(base_col, hi_col, letter, out_path):
        w, h = 20, 20
        im = Image.new("RGBA", (w, h), (0, 0, 0, 0))

        cx, cy, r = 9, 9, 8
        for y in range(h):
            for x in range(w):
                d = ((x - cx)**2 + (y - cy)**2)**0.5
                if d <= r:
                    ld = ((x - 6)**2 + (y - 6)**2)**0.5 / (r * 1.4)
                    ld = max(0.0, min(1.0, ld))
                    red = int(hi_col[0] * (1 - ld) + base_col[0] * ld)
                    green = int(hi_col[1] * (1 - ld) + base_col[1] * ld)
                    blue = int(hi_col[2] * (1 - ld) + base_col[2] * ld)
                    im.putpixel((x, y), (red, green, blue, 255))

        im = add_outline(im, (15, 20, 30, 255))
        draw = ImageDraw.Draw(im)
        draw.text((6, 4), letter, fill=(255, 255, 255, 255))
        im.save(out_path)
        print(f"Created {out_path}")

    make_sphere((20, 140, 60), (160, 255, 180), "S", "public/sprites/powerup_shield.png")
    make_sphere((120, 40, 180), (220, 150, 255), "W", "public/sprites/powerup_weapon.png")
    make_sphere((180, 30, 30), (255, 140, 140), "B", "public/sprites/powerup_bomb.png")
    make_sphere((180, 140, 10), (255, 240, 100), "$", "public/sprites/powerup_credit.png")

if __name__ == "__main__":
    create_talon()
    create_phoenix()
    create_stalker()
    create_enemy_scout()
    create_enemy_interceptor()
    create_enemy_gunship()
    create_enemy_asteroid()
    create_powerups()
