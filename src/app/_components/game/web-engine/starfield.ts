import { Star } from "./types";

/**
 * 3D Parallax Starfield Generator
 * Reverse-engineered directly from OpenTyrian's starlib.c (Jason Emery)
 * Projects 3D stars (spX, spY, spZ) onto 2D VGA screen coordinates.
 */
export class Starfield {
  private stars: Star[] = [];
  private numStars: number;
  private width: number;
  private height: number;
  private baseSpeed: number = 3.5;
  private warpFactor: number = 1.0;

  constructor(width: number, height: number, numStars: number = 280) {
    this.width = width;
    this.height = height;
    this.numStars = numStars;
    this.init();
  }

  private init() {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push(this.createStar(true));
    }
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public setWarp(warp: number) {
    this.warpFactor = warp;
  }

  private createStar(randomZ: boolean = false): Star {
    const spreadX = this.width * 2.2;
    const spreadY = this.height * 2.2;
    const spX = (Math.random() - 0.5) * spreadX;
    const spY = (Math.random() - 0.5) * spreadY;
    const spZ = randomZ ? Math.random() * 500 + 10 : 500;

    return {
      spX,
      spY,
      spZ,
      lastX: (spX / spZ) + this.width / 2,
      lastY: (spY / spZ) + this.height / 2,
      color: this.depthColor(spZ),
    };
  }

  private depthColor(z: number): string {
    const norm = Math.max(0, Math.min(1, 1 - z / 500));
    if (norm > 0.8) {
      return "#ffffff";
    } else if (norm > 0.6) {
      return "#7dd3fc"; // cyan bright
    } else if (norm > 0.4) {
      return "#38bdf8"; // sky blue
    } else if (norm > 0.2) {
      return "#1e3a8a"; // deep blue
    }
    return "#0f172a"; // dark distant
  }

  public update(speedMultiplier: number = 1.0) {
    const effectiveSpeed = this.baseSpeed * this.warpFactor * speedMultiplier;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      s.lastX = (s.spX / s.spZ) + centerX;
      s.lastY = (s.spY / s.spZ) + centerY;

      s.spZ -= effectiveSpeed;

      const currX = (s.spX / s.spZ) + centerX;
      const currY = (s.spY / s.spZ) + centerY;

      if (
        s.spZ <= 1 ||
        currX < 0 ||
        currX >= this.width ||
        currY < 0 ||
        currY >= this.height
      ) {
        this.stars[i] = this.createStar(false);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      const currX = (s.spX / s.spZ) + centerX;
      const currY = (s.spY / s.spZ) + centerY;

      const norm = Math.max(0, Math.min(1, 1 - s.spZ / 500));
      const starSize = norm > 0.75 ? 2.2 : norm > 0.4 ? 1.5 : 1.0;

      ctx.fillStyle = this.depthColor(s.spZ);

      // Render star streak during warp / high speed
      if (this.warpFactor > 1.2) {
        ctx.strokeStyle = this.depthColor(s.spZ);
        ctx.lineWidth = starSize;
        ctx.beginPath();
        ctx.moveTo(s.lastX, s.lastY);
        ctx.lineTo(currX, currY);
        ctx.stroke();
      } else {
        ctx.fillRect(Math.floor(currX), Math.floor(currY), starSize, starSize);
      }
    }
  }
}
