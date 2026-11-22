// Minimal 2D canvas: RGB buffer rendered at 2x supersampling, polygon fill
// (even-odd scanline), text via the embedded Liberation Serif outlines, and
// a small PNG encoder (zlib + CRC32). Node standard library only.
import { deflateSync } from "node:zlib";
import { FACES, glyphFor, measureText, type FaceName } from "./font.ts";

export type RGB = [number, number, number];

const clampByte = (v: number): number => (v < 0 ? 0 : v > 255 ? 255 : v | 0);

function crc32(buf: Buffer): number {
  let table = (crc32 as unknown as { t?: Uint32Array }).t;
  if (!table) {
    table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
    (crc32 as unknown as { t: Uint32Array }).t = table;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), data])), 8 + data.length);
  return out;
}

export class Canvas {
  readonly w: number; // logical width (output pixels)
  readonly h: number; // logical height
  readonly ss: number; // supersample factor
  readonly iw: number; // internal width
  readonly ih: number; // internal height
  readonly buf: Uint8Array; // internal RGB buffer

  constructor(w: number, h: number, ss = 2) {
    this.w = w;
    this.h = h;
    this.ss = ss;
    this.iw = w * ss;
    this.ih = h * ss;
    this.buf = new Uint8Array(this.iw * this.ih * 3);
  }

  fill(color: RGB): void {
    for (let i = 0; i < this.buf.length; i += 3) {
      this.buf[i] = color[0];
      this.buf[i + 1] = color[1];
      this.buf[i + 2] = color[2];
    }
  }

  private setPixel(ix: number, iy: number, color: RGB): void {
    if (ix < 0 || iy < 0 || ix >= this.iw || iy >= this.ih) return;
    const o = (iy * this.iw + ix) * 3;
    this.buf[o] = color[0];
    this.buf[o + 1] = color[1];
    this.buf[o + 2] = color[2];
  }

  fillRect(x: number, y: number, w: number, h: number, color: RGB): void {
    const x0 = Math.max(0, Math.floor(x * this.ss));
    const y0 = Math.max(0, Math.floor(y * this.ss));
    const x1 = Math.min(this.iw, Math.ceil((x + w) * this.ss));
    const y1 = Math.min(this.ih, Math.ceil((y + h) * this.ss));
    for (let iy = y0; iy < y1; iy++) {
      let o = (iy * this.iw + x0) * 3;
      for (let ix = x0; ix < x1; ix++) {
        this.buf[o] = color[0];
        this.buf[o + 1] = color[1];
        this.buf[o + 2] = color[2];
        o += 3;
      }
    }
  }

  /** Fill several contours at once with the even-odd rule (so glyph holes
   *  stay holes). Points are flat [x,y,...] arrays in LOGICAL coords. */
  fillPolys(contours: number[][], color: RGB): void {
    const ss = this.ss;
    type Edge = [number, number, number, number];
    const edges: Edge[] = [];
    let minY = Infinity;
    let maxY = -Infinity;
    for (const c of contours) {
      const n = c.length / 2;
      for (let i = 0; i < n; i++) {
        const x0 = c[i * 2] * ss;
        const y0 = c[i * 2 + 1] * ss;
        const j = (i + 1) % n;
        const x1 = c[j * 2] * ss;
        const y1 = c[j * 2 + 1] * ss;
        if (y0 === y1) continue;
        if (y0 < y1) edges.push([x0, y0, x1, y1]);
        else edges.push([x1, y1, x0, y0]);
        if (y0 < minY) minY = y0;
        if (y0 > maxY) maxY = y0;
        if (y1 < minY) minY = y1;
        if (y1 > maxY) maxY = y1;
      }
    }
    if (edges.length === 0) return;
    const yStart = Math.max(0, Math.ceil(minY - 0.5));
    const yEnd = Math.min(this.ih - 1, Math.floor(maxY - 0.5));
    const xs: number[] = [];
    for (let iy = yStart; iy <= yEnd; iy++) {
      const yc = iy + 0.5;
      xs.length = 0;
      for (const [x0, y0, x1, y1] of edges) {
        if (yc < y0 || yc >= y1) continue;
        xs.push(x0 + ((yc - y0) * (x1 - x0)) / (y1 - y0));
      }
      if (xs.length < 2) continue;
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const xa = xs[k];
        const xb = xs[k + 1];
        const px0 = Math.max(0, Math.ceil(xa - 0.5));
        const px1 = Math.min(this.iw, Math.ceil(xb - 0.5));
        let o = (iy * this.iw + px0) * 3;
        for (let px = px0; px < px1; px++) {
          this.buf[o] = color[0];
          this.buf[o + 1] = color[1];
          this.buf[o + 2] = color[2];
          o += 3;
        }
      }
    }
  }

  fillPolygon(points: number[], color: RGB): void {
    this.fillPolys([points], color);
  }

  fillCircle(cx: number, cy: number, r: number, color: RGB): void {
    const pts: number[] = [];
    const steps = Math.max(12, Math.min(48, Math.round(r * 2)));
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      pts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    this.fillPolygon(pts, color);
  }

  fillEllipse(cx: number, cy: number, rx: number, ry: number, color: RGB): void {
    const pts: number[] = [];
    const steps = 40;
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      pts.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
    }
    this.fillPolygon(pts, color);
  }

  /** Thick line as a quad. */
  line(x1: number, y1: number, x2: number, y2: number, width: number, color: RGB): void {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = (-dy / len) * (width / 2);
    const ny = (dx / len) * (width / 2);
    this.fillPolygon(
      [x1 + nx, y1 + ny, x2 + nx, y2 + ny, x2 - nx, y2 - ny, x1 - nx, y1 - ny],
      color,
    );
  }

  // ---- text -----------------------------------------------------------

  textWidth(face: FaceName, text: string, size: number, tracking = 0): number {
    return measureText(face, text, size, tracking);
  }

  /** Draw text with the baseline at (x, y). align shifts x by the width. */
  drawText(
    x: number,
    y: number,
    size: number,
    face: FaceName,
    text: string,
    color: RGB,
    tracking = 0,
    align: "left" | "center" | "right" = "left",
  ): void {
    const f = FACES[face];
    const scale = size / f.upm;
    let penX = x;
    if (align !== "left") {
      const w = measureText(face, text, size, tracking);
      penX = align === "center" ? x - w / 2 : x - w;
    }
    for (const ch of text) {
      const g = glyphFor(face, ch);
      if (g.contours.length > 0) {
        const polys: number[][] = [];
        for (const c of g.contours) {
          const pts: number[] = new Array(c.length);
          for (let i = 0; i < c.length; i += 2) {
            pts[i] = penX + c[i] * scale;
            pts[i + 1] = y - c[i + 1] * scale;
          }
          polys.push(pts);
        }
        this.fillPolys(polys, color);
      }
      penX += (g.adv / f.upm) * size + tracking;
    }
  }

  /** Draw wrapped lines starting at (x, yTop) with the given line height
   *  (first line's baseline = yTop + size). Returns the y of the last baseline. */
  drawLines(
    x: number,
    yTop: number,
    size: number,
    face: FaceName,
    lines: string[],
    color: RGB,
    lineHeight: number,
    tracking = 0,
  ): number {
    let y = yTop + size;
    for (const line of lines) {
      this.drawText(x, y, size, face, line, color, tracking);
      y += lineHeight;
    }
    return y - lineHeight;
  }

  // ---- output ---------------------------------------------------------

  /** Box-downsample the 2x buffer to logical size and encode a PNG. */
  toPNG(): Buffer {
    const w = this.w;
    const h = this.h;
    const ss = this.ss;
    const raw = Buffer.alloc(h * (1 + w * 3));
    const div = ss * ss;
    for (let y = 0; y < h; y++) {
      const rowOff = y * (1 + w * 3);
      raw[rowOff] = 0; // filter: none
      for (let x = 0; x < w; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        for (let sy = 0; sy < ss; sy++) {
          const iy = y * ss + sy;
          let o = (iy * this.iw + x * ss) * 3;
          for (let sx = 0; sx < ss; sx++) {
            r += this.buf[o];
            g += this.buf[o + 1];
            b += this.buf[o + 2];
            o += 3;
          }
        }
        const oo = rowOff + 1 + x * 3;
        raw[oo] = clampByte(Math.round(r / div));
        raw[oo + 1] = clampByte(Math.round(g / div));
        raw[oo + 2] = clampByte(Math.round(b / div));
      }
    }
    const idat = deflateSync(raw, { level: 9 });
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 2; // color type: RGB
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;
    const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    return Buffer.concat([
      sig,
      chunk("IHDR", ihdr),
      chunk("IDAT", idat),
      chunk("IEND", Buffer.alloc(0)),
    ]);
  }
}
