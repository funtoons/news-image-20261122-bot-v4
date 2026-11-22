// Flat vector illustrations and the dotted world map, drawn with the
// canvas primitives in render.ts. All artwork is original, drawn in code.
import type { Canvas, RGB } from "./render.ts";

// ---- palette ---------------------------------------------------------
export const PAPER: RGB = [247, 242, 232];
export const INK: RGB = [26, 26, 26];
export const RED: RGB = [169, 28, 28];
export const NAVY: RGB = [30, 58, 95];
export const GOLD: RGB = [201, 162, 39];
export const GREY: RGB = [90, 90, 84];

// ---- dot map ---------------------------------------------------------
// 64 x 30 equirectangular land mask, '#' = land. Rows are normalised to
// 64 columns in code, so small hand-authoring slips do not matter.
const MAP_ROWS = [
  "........####..........###.....................................",
  "......#########......#####......#......###.....................",
  "..####...........####..#####......####....####################..",
  "..#####......###########.....#....####..########################",
  "...#####......###########...##....##..#########################",
  ".........##########..#........###############################.",
  ".........###########.........###############################..",
  "..........###########..##......#####################....##....",
  "...........###########.........#####....###....######...#......",
  "............##########.........#######....###....####..........",
  ".............#####.....######...###..###....#####..............",
  "..............#####....#########......#.....####..............",
  "................###...####..###............####..............",
  "...............#####....#####..##.............................",
  "...............######...#######.....######....................",
  "................#####....######.....######....................",
  "................#####....#####.......#####....................",
  ".................####....####....#####.........................",
  ".................####....####....#####.........................",
  ".................###.....###.....#####.........................",
  ".................###..........###..##..........................",
  ".................##..........................................",
  ".................##..........................................",
  ".................#...........................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
];

function landAt(col: number, row: number): boolean {
  if (row < 0 || row >= MAP_ROWS.length) return false;
  const line = MAP_ROWS[row];
  if (col < 0 || col >= line.length) return false;
  return line[col] === "#";
}

export interface Pin {
  num: number;
  lat: number;
  lon: number;
}

/** Draw the navy dot map with numbered gold pins. Crowded pins are nudged
 *  apart with a thin leader line to their true position. */
export function drawMap(
  c: Canvas,
  x: number,
  y: number,
  w: number,
  h: number,
  pins: Pin[],
): void {
  const cols = 64;
  const rows = 30;
  const cw = w / cols;
  const ch = h / rows;
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      if (!landAt(col, r)) continue;
      c.fillCircle(x + (col + 0.5) * cw, y + (r + 0.5) * ch, 1.7, NAVY);
    }
  }
  const placed: [number, number][] = [];
  const offsets: [number, number][] = [
    [0, 0],
    [11, -9],
    [-11, -9],
    [11, 9],
    [-11, 9],
    [0, -13],
    [0, 13],
    [15, 0],
    [-15, 0],
    [13, -13],
    [-13, -13],
  ];
  for (const pin of pins) {
    const tx = x + ((pin.lon + 180) / 360) * w;
    const ty = y + ((90 - pin.lat) / 180) * h;
    let px = tx;
    let py = ty;
    for (const [dx, dy] of offsets) {
      const cx = Math.max(x + 8, Math.min(x + w - 8, tx + dx));
      const cy = Math.max(y + 8, Math.min(y + h - 8, ty + dy));
      let ok = true;
      for (const [ox, oy] of placed) {
        if (Math.hypot(cx - ox, cy - oy) < 12.5) {
          ok = false;
          break;
        }
      }
      if (ok) {
        px = cx;
        py = cy;
        break;
      }
    }
    if (Math.hypot(px - tx, py - ty) > 0.5) {
      c.line(tx, ty, px, py, 0.8, GREY);
      c.fillCircle(tx, ty, 1.6, INK);
    }
    c.fillCircle(px, py, 6.5, GOLD);
    c.fillCircle(px, py, 6.5, GOLD);
    c.drawText(px, py + 2.5, 7.5, "bold", String(pin.num), INK, 0, "center");
    placed.push([px, py]);
  }
}

// ---- hero illustrations ----------------------------------------------

/** COP31 summit: globe, delegates at a long table, a 03:00 clock, FINAL paper. */
export function drawHeroCop31(c: Canvas, x: number, y: number, w: number, h: number): void {
  c.fillRect(x, y, w, h, [214, 231, 244]); // pale sky
  c.fillRect(x, y + h * 0.62, w, h * 0.38, [232, 222, 200]); // hall floor
  // globe
  const gx = x + w * 0.16;
  const gy = y + h * 0.34;
  const gr = h * 0.24;
  c.fillCircle(gx, gy, gr, [47, 111, 178]);
  c.fillEllipse(gx - gr * 0.25, gy - gr * 0.3, gr * 0.42, gr * 0.26, [76, 175, 109]);
  c.fillEllipse(gx + gr * 0.35, gy + gr * 0.35, gr * 0.3, gr * 0.2, [76, 175, 109]);
  c.fillEllipse(gx + gr * 0.1, gy - gr * 0.55, gr * 0.22, gr * 0.14, [76, 175, 109]);
  // flags on the wall
  const flagCols: RGB[] = [
    [192, 57, 43],
    [46, 134, 193],
    [243, 156, 18],
    [39, 174, 96],
    [142, 68, 173],
  ];
  for (let i = 0; i < 5; i++) {
    const fx = x + w * (0.42 + i * 0.1);
    c.fillRect(fx, y + h * 0.08, w * 0.055, h * 0.16, flagCols[i]);
    c.line(fx + w * 0.027, y + h * 0.08, fx + w * 0.027, y + h * 0.3, 1, INK);
  }
  // clock at 03:00
  const cx = x + w * 0.9;
  const cy = y + h * 0.2;
  const cr = h * 0.15;
  c.fillCircle(cx, cy, cr, [255, 255, 255]);
  c.fillCircle(cx, cy, cr, [255, 255, 255]);
  c.line(cx, cy, cx + cr * 0.75, cy, 2, INK);
  c.line(cx, cy, cx, cy - cr * 0.75, 2, INK);
  // delegates behind the table
  const skins: RGB[] = [
    [222, 184, 150],
    [194, 148, 110],
    [232, 198, 166],
    [172, 122, 88],
    [210, 170, 140],
  ];
  for (let i = 0; i < 5; i++) {
    const dx = x + w * (0.36 + i * 0.11);
    const dy = y + h * 0.42;
    c.fillCircle(dx, dy, h * 0.075, skins[i]);
    c.fillRect(dx - w * 0.045, dy + h * 0.07, w * 0.09, h * 0.16, flagCols[i]);
  }
  // long table
  c.fillRect(x + w * 0.3, y + h * 0.56, w * 0.62, h * 0.07, [138, 109, 75]);
  // FINAL paper on the table
  c.fillRect(x + w * 0.55, y + h * 0.5, w * 0.13, h * 0.1, [255, 255, 255]);
  c.fillRect(x + w * 0.57, y + h * 0.53, w * 0.09, 1.2, INK);
  c.fillRect(x + w * 0.57, y + h * 0.56, w * 0.09, 1.2, INK);
  c.fillCircle(x + w * 0.66, y + h * 0.585, 2.5, RED);
}

/** Bahrain at night: burning port, tanker, smoke columns, radar dishes. */
export function drawHeroBahrain(c: Canvas, x: number, y: number, w: number, h: number): void {
  c.fillRect(x, y, w, h, [22, 35, 61]); // night sky
  c.fillCircle(x + w * 0.82, y + h * 0.16, h * 0.09, [240, 230, 200]); // moon
  c.fillRect(x, y + h * 0.66, w, h * 0.34, [29, 58, 95]); // sea
  // distant port silhouette
  c.fillRect(x + w * 0.05, y + h * 0.5, w * 0.1, h * 0.18, [15, 26, 46]);
  c.fillRect(x + w * 0.17, y + h * 0.44, w * 0.07, h * 0.24, [15, 26, 46]);
  c.fillRect(x + w * 0.26, y + h * 0.54, w * 0.12, h * 0.14, [15, 26, 46]);
  // storage tanks
  c.fillCircle(x + w * 0.62, y + h * 0.6, h * 0.07, [42, 63, 95]);
  c.fillCircle(x + w * 0.72, y + h * 0.6, h * 0.07, [42, 63, 95]);
  c.fillRect(x + w * 0.58, y + h * 0.6, w * 0.18, h * 0.08, [42, 63, 95]);
  // radar dishes
  c.line(x + w * 0.6, y + h * 0.5, x + w * 0.64, y + h * 0.42, 2, [200, 200, 200]);
  c.fillCircle(x + w * 0.645, y + h * 0.41, h * 0.045, [200, 200, 200]);
  c.line(x + w * 0.74, y + h * 0.5, x + w * 0.7, y + h * 0.42, 2, [200, 200, 200]);
  c.fillCircle(x + w * 0.695, y + h * 0.41, h * 0.045, [200, 200, 200]);
  // fire on the tanks
  const flame = (fx: number, fy: number, s: number): void => {
    c.fillPolygon(
      [fx, fy, fx - s * 0.5, fy - s * 0.4, fx - s * 0.25, fy - s * 1.1, fx, fy - s * 0.7, fx + s * 0.3, fy - s * 1.2, fx + s * 0.55, fy - s * 0.4],
      [243, 156, 18],
    );
    c.fillPolygon(
      [fx, fy, fx - s * 0.28, fy - s * 0.3, fx - s * 0.12, fy - s * 0.8, fx + s * 0.15, fy - s * 0.85, fx + s * 0.3, fy - s * 0.3],
      [241, 196, 15],
    );
  };
  flame(x + w * 0.62, y + h * 0.52, h * 0.16);
  flame(x + w * 0.72, y + h * 0.52, h * 0.13);
  // smoke columns
  c.fillCircle(x + w * 0.62, y + h * 0.3, h * 0.06, [120, 120, 125]);
  c.fillCircle(x + w * 0.66, y + h * 0.2, h * 0.075, [140, 140, 145]);
  c.fillCircle(x + w * 0.72, y + h * 0.28, h * 0.055, [120, 120, 125]);
  // tanker on the sea
  c.fillRect(x + w * 0.3, y + h * 0.72, w * 0.4, h * 0.09, [17, 17, 17]);
  c.fillRect(x + w * 0.34, y + h * 0.64, w * 0.08, h * 0.08, [176, 58, 46]);
  c.fillRect(x + w * 0.43, y + h * 0.64, w * 0.08, h * 0.08, [46, 134, 193]);
  c.fillRect(x + w * 0.52, y + h * 0.64, w * 0.08, h * 0.08, [243, 156, 18]);
  c.fillRect(x + w * 0.62, y + h * 0.6, w * 0.05, h * 0.12, [220, 220, 220]);
  // waves
  for (let i = 0; i < 5; i++) {
    c.line(x + w * (0.08 + i * 0.18), y + h * 0.88, x + w * (0.16 + i * 0.18), y + h * 0.88, 1.5, [120, 170, 220]);
  }
}

/** Sinaloa at night, kept bright: lit windows, headlight beams, big figures. */
export function drawHeroSinaloa(c: Canvas, x: number, y: number, w: number, h: number): void {
  // dusk sky bands, brightest at the horizon
  c.fillRect(x, y, w, h * 0.35, [74, 52, 96]);
  c.fillRect(x, y + h * 0.35, w, h * 0.3, [176, 92, 80]);
  c.fillRect(x, y + h * 0.65, w, h * 0.35, [240, 180, 110]);
  // buildings with lit windows
  c.fillRect(x + w * 0.02, y + h * 0.3, w * 0.2, h * 0.45, [52, 42, 66]);
  c.fillRect(x + w * 0.26, y + h * 0.22, w * 0.18, h * 0.53, [44, 36, 58]);
  c.fillRect(x + w * 0.78, y + h * 0.28, w * 0.2, h * 0.47, [52, 42, 66]);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      c.fillRect(x + w * (0.05 + i * 0.06), y + h * (0.36 + j * 0.12), w * 0.03, h * 0.05, [250, 210, 120]);
    }
  }
  for (let j = 0; j < 3; j++) {
    c.fillRect(x + w * 0.3, y + h * (0.3 + j * 0.13), w * 0.03, h * 0.05, [250, 210, 120]);
    c.fillRect(x + w * 0.38, y + h * (0.3 + j * 0.13), w * 0.03, h * 0.05, [250, 210, 120]);
  }
  for (let j = 0; j < 2; j++) {
    c.fillRect(x + w * 0.82, y + h * (0.36 + j * 0.13), w * 0.03, h * 0.05, [250, 210, 120]);
    c.fillRect(x + w * 0.9, y + h * (0.36 + j * 0.13), w * 0.03, h * 0.05, [250, 210, 120]);
  }
  // street
  c.fillRect(x, y + h * 0.75, w, h * 0.25, [38, 38, 44]);
  c.fillRect(x + w * 0.1, y + h * 0.86, w * 0.08, 2, [230, 200, 120]);
  c.fillRect(x + w * 0.45, y + h * 0.86, w * 0.08, 2, [230, 200, 120]);
  c.fillRect(x + w * 0.8, y + h * 0.86, w * 0.08, 2, [230, 200, 120]);
  // police SUV, big and central
  const sx = x + w * 0.46;
  const sy = y + h * 0.62;
  c.fillRect(sx, sy, w * 0.3, h * 0.13, [28, 42, 68]); // body
  c.fillRect(sx + w * 0.05, sy - h * 0.09, w * 0.2, h * 0.1, [28, 42, 68]); // cabin
  c.fillRect(sx + w * 0.07, sy - h * 0.07, w * 0.07, h * 0.06, [180, 215, 235]); // window
  c.fillRect(sx + w * 0.16, sy - h * 0.07, w * 0.07, h * 0.06, [180, 215, 235]);
  c.fillRect(sx + w * 0.02, sy + h * 0.02, w * 0.26, h * 0.03, [240, 240, 240]); // white door band
  c.fillRect(sx + w * 0.1, sy - h * 0.12, w * 0.04, h * 0.03, [220, 30, 30]); // light bar red
  c.fillRect(sx + w * 0.16, sy - h * 0.12, w * 0.04, h * 0.03, [30, 90, 220]); // light bar blue
  c.fillCircle(sx + w * 0.06, sy + h * 0.14, h * 0.045, [20, 20, 20]); // wheels
  c.fillCircle(sx + w * 0.24, sy + h * 0.14, h * 0.045, [20, 20, 20]);
  // headlight beams
  c.fillPolygon(
    [sx + w * 0.3, sy + h * 0.06, sx + w * 0.52, sy - h * 0.02, sx + w * 0.52, sy + h * 0.16, sx + w * 0.3, sy + h * 0.1],
    [250, 230, 150],
  );
  // burning barricade, right
  const bx = x + w * 0.86;
  const by = y + h * 0.74;
  c.fillRect(bx - w * 0.05, by, w * 0.1, h * 0.03, [90, 60, 40]);
  c.fillPolygon(
    [bx - w * 0.04, by, bx - w * 0.02, by - h * 0.09, bx, by - h * 0.05, bx + w * 0.02, by - h * 0.1, bx + w * 0.045, by],
    [243, 156, 18],
  );
  c.fillPolygon(
    [bx - w * 0.02, by, bx - w * 0.008, by - h * 0.06, bx + w * 0.01, by - h * 0.06, bx + w * 0.025, by],
    [241, 196, 15],
  );
  c.fillCircle(bx, by - h * 0.14, h * 0.05, [150, 150, 155]);
  // two big trooper figures, left of the SUV
  const trooper = (tx: number): void => {
    c.fillCircle(tx, y + h * 0.6, h * 0.05, [210, 170, 140]); // head
    c.fillRect(tx - w * 0.028, y + h * 0.64, w * 0.056, h * 0.13, [36, 52, 36]); // body
    c.fillRect(tx - w * 0.028, y + h * 0.64, w * 0.056, h * 0.04, [200, 170, 40]); // vest
  };
  trooper(x + w * 0.32);
  trooper(x + w * 0.4);
}

// ---- grid mini illustrations -----------------------------------------

const SKY: RGB = [214, 231, 244];
const DARK: RGB = [30, 30, 34];

/** Small iconic scene for a grid card, drawn in a w x h box. */
export function drawMini(c: Canvas, key: string, x: number, y: number, w: number, h: number): void {
  c.fillRect(x, y, w, h, SKY);
  switch (key) {
    case "drone": {
      // quadcopter silhouette over rooftops
      c.fillRect(x, y + h * 0.62, w, h * 0.38, [120, 110, 100]);
      c.fillRect(x + w * 0.1, y + h * 0.5, w * 0.22, h * 0.14, [90, 82, 74]);
      c.fillRect(x + w * 0.62, y + h * 0.55, w * 0.28, h * 0.09, [90, 82, 74]);
      const dx = x + w * 0.5;
      const dy = y + h * 0.34;
      c.fillRect(dx - w * 0.09, dy - h * 0.06, w * 0.18, h * 0.12, DARK);
      c.fillCircle(dx, dy, h * 0.06, DARK);
      c.line(dx - w * 0.2, dy - h * 0.12, dx - w * 0.04, dy - h * 0.06, 1.5, DARK);
      c.line(dx + w * 0.04, dy - h * 0.06, dx + w * 0.2, dy - h * 0.12, 1.5, DARK);
      c.fillCircle(dx - w * 0.2, dy - h * 0.12, 2.5, DARK);
      c.fillCircle(dx + w * 0.2, dy - h * 0.12, 2.5, DARK);
      break;
    }
    case "ship": {
      c.fillRect(x, y + h * 0.66, w, h * 0.34, [29, 58, 95]);
      c.fillRect(x + w * 0.18, y + h * 0.52, w * 0.64, h * 0.14, [20, 20, 20]);
      c.fillRect(x + w * 0.24, y + h * 0.4, w * 0.12, h * 0.12, [176, 58, 46]);
      c.fillRect(x + w * 0.38, y + h * 0.4, w * 0.12, h * 0.12, [46, 134, 193]);
      c.fillRect(x + w * 0.52, y + h * 0.4, w * 0.12, h * 0.12, [243, 156, 18]);
      c.fillPolygon(
        [x + w * 0.55, y + h * 0.4, x + w * 0.5, y + h * 0.16, x + w * 0.58, y + h * 0.1, x + w * 0.66, y + h * 0.16, x + w * 0.62, y + h * 0.4],
        [243, 156, 18],
      );
      c.fillCircle(x + w * 0.58, y + h * 0.12, h * 0.08, [120, 120, 125]);
      break;
    }
    case "parliament": {
      c.fillRect(x, y + h * 0.7, w, h * 0.3, [200, 190, 170]);
      c.fillRect(x + w * 0.2, y + h * 0.3, w * 0.6, h * 0.42, [240, 235, 220]);
      c.fillPolygon(
        [x + w * 0.16, y + h * 0.32, x + w * 0.5, y + h * 0.1, x + w * 0.84, y + h * 0.32],
        [180, 60, 50],
      );
      for (let i = 0; i < 4; i++) {
        c.fillRect(x + w * (0.26 + i * 0.13), y + h * 0.38, w * 0.05, h * 0.3, [255, 255, 255]);
      }
      break;
    }
    case "aid": {
      c.fillRect(x, y + h * 0.66, w, h * 0.34, [140, 130, 115]);
      c.fillRect(x + w * 0.12, y + h * 0.42, w * 0.6, h * 0.24, [255, 255, 255]);
      c.fillRect(x + w * 0.72, y + h * 0.5, w * 0.18, h * 0.16, [200, 200, 200]);
      c.fillCircle(x + w * 0.26, y + h * 0.68, h * 0.07, DARK);
      c.fillCircle(x + w * 0.62, y + h * 0.68, h * 0.07, DARK);
      c.fillPolygon(
        [x + w * 0.4, y + h * 0.42, x + w * 0.36, y + h * 0.26, x + w * 0.44, y + h * 0.2, x + w * 0.48, y + h * 0.3, x + w * 0.44, y + h * 0.42],
        [243, 156, 18],
      );
      break;
    }
    case "power": {
      c.fillRect(x + w * 0.2, y + h * 0.3, w * 0.06, h * 0.55, DARK);
      c.fillRect(x + w * 0.7, y + h * 0.3, w * 0.06, h * 0.55, DARK);
      c.line(x + w * 0.2, y + h * 0.34, x + w * 0.73, y + h * 0.44, 1.2, DARK);
      c.line(x + w * 0.2, y + h * 0.4, x + w * 0.73, y + h * 0.5, 1.2, DARK);
      c.fillPolygon(
        [x + w * 0.5, y + h * 0.08, x + w * 0.42, y + h * 0.3, x + w * 0.48, y + h * 0.3, x + w * 0.44, y + h * 0.5, x + w * 0.56, y + h * 0.26, x + w * 0.5, y + h * 0.26],
        [241, 196, 15],
      );
      break;
    }
    case "probe": {
      c.fillRect(x, y + h * 0.66, w, h * 0.34, [200, 190, 170]);
      c.fillRect(x + w * 0.14, y + h * 0.5, w * 0.12, h * 0.16, [46, 134, 193]);
      c.fillRect(x + w * 0.3, y + h * 0.38, w * 0.12, h * 0.28, [39, 174, 96]);
      c.fillRect(x + w * 0.46, y + h * 0.44, w * 0.12, h * 0.22, [243, 156, 18]);
      c.fillCircle(x + w * 0.68, y + h * 0.34, h * 0.16, [255, 255, 255]);
      c.fillCircle(x + w * 0.68, y + h * 0.34, h * 0.13, [120, 170, 220]);
      c.line(x + w * 0.78, y + h * 0.44, x + w * 0.9, y + h * 0.58, 2.5, DARK);
      break;
    }
    case "hospital": {
      c.fillRect(x + w * 0.2, y + h * 0.3, w * 0.6, h * 0.55, [255, 255, 255]);
      c.fillRect(x + w * 0.2, y + h * 0.3, w * 0.6, h * 0.1, [192, 57, 43]);
      c.fillRect(x + w * 0.46, y + h * 0.12, w * 0.08, h * 0.2, [192, 57, 43]);
      c.fillRect(x + w * 0.4, y + h * 0.16, w * 0.2, h * 0.08, [192, 57, 43]);
      for (let i = 0; i < 3; i++) {
        c.fillRect(x + w * (0.28 + i * 0.16), y + h * 0.48, w * 0.07, h * 0.12, [180, 215, 235]);
      }
      break;
    }
    case "sub": {
      c.fillRect(x, y + h * 0.55, w, h * 0.45, [29, 58, 95]);
      c.fillEllipse(x + w * 0.5, y + h * 0.5, w * 0.32, h * 0.12, [90, 100, 110]);
      c.fillRect(x + w * 0.42, y + h * 0.32, w * 0.14, h * 0.1, [90, 100, 110]);
      c.fillRect(x + w * 0.14, y + h * 0.4, w * 0.05, h * 0.2, [90, 100, 110]);
      for (let i = 0; i < 3; i++) {
        c.fillCircle(x + w * (0.3 + i * 0.14), y + h * 0.5, 2, [220, 230, 240]);
      }
      break;
    }
    case "cricket": {
      c.fillRect(x, y + h * 0.66, w, h * 0.34, [76, 175, 109]);
      c.line(x + w * 0.3, y + h * 0.2, x + w * 0.55, y + h * 0.62, 3, [150, 110, 70]);
      c.fillCircle(x + w * 0.68, y + h * 0.4, h * 0.09, [192, 57, 43]);
      c.fillRect(x + w * 0.78, y + h * 0.4, w * 0.02, h * 0.26, [220, 200, 160]);
      c.fillRect(x + w * 0.84, y + h * 0.4, w * 0.02, h * 0.26, [220, 200, 160]);
      c.fillRect(x + w * 0.9, y + h * 0.4, w * 0.02, h * 0.26, [220, 200, 160]);
      break;
    }
    case "ballot": {
      c.fillRect(x + w * 0.24, y + h * 0.42, w * 0.52, h * 0.42, [46, 134, 193]);
      c.fillRect(x + w * 0.2, y + h * 0.34, w * 0.6, h * 0.1, [30, 90, 140]);
      c.fillRect(x + w * 0.42, y + h * 0.18, w * 0.16, h * 0.18, [255, 255, 255]);
      c.line(x + w * 0.44, y + h * 0.28, x + w * 0.48, y + h * 0.32, 1.5, INK);
      c.line(x + w * 0.48, y + h * 0.32, x + w * 0.56, y + h * 0.22, 1.5, INK);
      break;
    }
    case "f1": {
      c.fillRect(x, y + h * 0.66, w, h * 0.34, [60, 60, 66]);
      c.fillPolygon(
        [x + w * 0.12, y + h * 0.5, x + w * 0.3, y + h * 0.44, x + w * 0.55, y + h * 0.44, x + w * 0.78, y + h * 0.52, x + w * 0.88, y + h * 0.58, x + w * 0.12, y + h * 0.62],
        [192, 57, 43],
      );
      c.fillRect(x + w * 0.82, y + h * 0.34, w * 0.06, h * 0.2, [40, 40, 44]);
      c.fillCircle(x + w * 0.28, y + h * 0.62, h * 0.09, DARK);
      c.fillCircle(x + w * 0.7, y + h * 0.62, h * 0.09, DARK);
      break;
    }
    case "border": {
      c.fillRect(x, y + h * 0.66, w, h * 0.34, [140, 130, 115]);
      for (let i = 0; i < 5; i++) {
        c.fillRect(x + w * (0.1 + i * 0.18), y + h * 0.28, w * 0.04, h * 0.42, DARK);
      }
      c.line(x + w * 0.08, y + h * 0.34, x + w * 0.92, y + h * 0.34, 1.2, DARK);
      c.line(x + w * 0.08, y + h * 0.48, x + w * 0.92, y + h * 0.48, 1.2, DARK);
      break;
    }
    default: {
      c.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6, [180, 180, 175]);
      break;
    }
  }
}
