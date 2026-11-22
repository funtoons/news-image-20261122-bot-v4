// The World in One Day — one-page newspaper for Sunday 22 November 2026.
// Node 22, standard library only. Deterministic: no network, no clock, no
// random input. Writes entry.png to MAKEFUN_OUTPUT_DIR (default "out").
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Canvas, type RGB } from "./render.ts";
import { measureText, wrapText } from "./font.ts";
import { ALSO_ON, CLOCK_ITEMS, DATE_CHECK, GRID, HEROES, NUMBERS, REGIONS, SOURCES } from "./data.ts";
import {
  GOLD,
  GREY,
  INK,
  NAVY,
  PAPER,
  RED,
  drawHeroBahrain,
  drawHeroCop31,
  drawHeroSinaloa,
  drawMap,
  drawMini,
} from "./scenes.ts";

const W = 1024;
const H = 1024;
const MARGIN = 14;
const RIGHT = W - MARGIN;
const CONTENT_W = RIGHT - MARGIN;

const warnings: string[] = [];
function warn(msg: string): void {
  warnings.push(msg);
}

/** Draw wrapped text in a box; warn when it needs more lines than allowed. */
function textBlock(
  c: Canvas,
  x: number,
  yTop: number,
  size: number,
  face: "regular" | "bold",
  text: string,
  color: RGB,
  maxWidth: number,
  maxLines: number,
  lineHeight: number,
  label: string,
): number {
  const lines = wrapText(face, text, size, maxWidth);
  if (lines.length > maxLines) {
    warn(`${label}: needs ${lines.length} lines, only ${maxLines} fit ("${text.slice(0, 60)}...")`);
  }
  return c.drawLines(x, yTop, size, face, lines.slice(0, maxLines), color, lineHeight);
}

function drawChip(
  c: Canvas,
  x: number,
  y: number,
  text: string,
  bg: RGB,
  fg: RGB,
  border: RGB | null = null,
): number {
  const size = 9;
  const padX = 6;
  const w = measureText("bold", text, size) + padX * 2;
  const h = 15;
  if (border) {
    c.fillRect(x, y, w, h, border);
    c.fillRect(x + 1, y + 1, w - 2, h - 2, bg);
  } else {
    c.fillRect(x, y, w, h, bg);
  }
  c.drawText(x + padX, y + 11.5, size, "bold", text, fg);
  return w;
}

function main(): void {
  const c = new Canvas(W, H, 2);
  c.fill(PAPER);

  // ---- identity strip ----------------------------------------------
  c.drawText(MARGIN, 15, 11, "bold", "THE WORLD IN ONE DAY", RED);
  c.drawText(
    RIGHT,
    15,
    8.5,
    "bold",
    "40 STORIES · 7 REGIONS · EVERY ONE DATED SUNDAY 22 NOVEMBER 2026",
    INK,
    0,
    "right",
  );
  c.fillRect(MARGIN, 20, CONTENT_W, 1.2, INK);

  // ---- masthead ------------------------------------------------------
  const masthead = "Sunday 22 November 2026";
  const mastW = measureText("bold", masthead, 64);
  if (mastW > CONTENT_W) warn(`masthead too wide: ${mastW.toFixed(0)}px`);
  c.drawText(W / 2, 88, 64, "bold", masthead, INK, 0, "center");

  // ---- sub-headline --------------------------------------------------
  c.drawText(
    W / 2,
    112,
    14,
    "bold",
    "Climate deal in sight at COP31 · Iran claims Patriot radar hits in Bahrain · 'El Chapo Isidro' captured in Sinaloa",
    RED,
    0,
    "center",
  );
  c.fillRect(MARGIN, 120, CONTENT_W, 2, INK);
  c.fillRect(MARGIN, 123, CONTENT_W, 1, INK);

  // ---- number strip --------------------------------------------------
  const cellW = CONTENT_W / 6;
  for (let i = 0; i < NUMBERS.length; i++) {
    const cx = MARGIN + i * cellW;
    const n = NUMBERS[i];
    const numSize = n.value.length > 4 ? 26 : 30;
    c.drawText(cx + 8, 158, numSize, "bold", n.value, RED);
    textBlock(c, cx + 8, 162, 8.5, "regular", n.caption, INK, cellW - 16, 2, 10.5, `number ${n.value}`);
    if (i > 0) c.fillRect(cx, 130, 1, 52, [200, 192, 175]);
  }
  c.fillRect(MARGIN, 186, CONTENT_W, 1.2, INK);

  // ---- region bar ----------------------------------------------------
  const totalRegions = REGIONS.reduce((s, r) => s + r.count, 0);
  let rx = MARGIN;
  for (const r of REGIONS) {
    const rw = (r.count / totalRegions) * CONTENT_W;
    c.fillRect(rx, 190, rw, 18, r.color);
    const label = `${r.name} ${r.count}`;
    const lw = measureText("bold", label, 8);
    if (lw <= rw - 6) {
      c.drawText(rx + rw / 2, 202.5, 8, "bold", label, [255, 255, 255], 0, "center");
    } else {
      warn(`region label too wide: ${label}`);
    }
    rx += rw;
  }

  // ---- heroes --------------------------------------------------------
  const heroW = 326;
  const heroGap = 9;
  const heroY = 216;
  for (let i = 0; i < HEROES.length; i++) {
    const hero = HEROES[i];
    const hx = MARGIN + i * (heroW + heroGap);
    const kw = drawChip(c, hx, heroY, hero.kicker, RED, [255, 255, 255]);
    void kw;
    const chipW = measureText("bold", hero.chip, 9) + 12;
    c.fillRect(hx + heroW - chipW, heroY, chipW, 15, [255, 255, 255]);
    c.fillRect(hx + heroW - chipW, heroY, chipW, 1, RED);
    c.fillRect(hx + heroW - chipW, heroY + 14, chipW, 1, RED);
    c.drawText(hx + heroW - chipW / 2, heroY + 11.5, 9, "bold", hero.chip, RED, 0, "center");
    const imgY = heroY + 19;
    const imgH = 96;
    if (hero.scene === "cop31") drawHeroCop31(c, hx, imgY, heroW, imgH);
    else if (hero.scene === "bahrain") drawHeroBahrain(c, hx, imgY, heroW, imgH);
    else drawHeroSinaloa(c, hx, imgY, heroW, imgH);
    // source line under the picture
    c.drawText(hx, imgY + imgH + 11, 8, "regular", `(${hero.source})`, GREY);
    // place line
    c.drawText(hx + 16, imgY + imgH + 25, 9.5, "bold", `${hero.place} · ${hero.topic}`, INK);
    c.fillCircle(hx + 7, imgY + imgH + 21.5, 6.5, RED);
    c.drawText(hx + 7, imgY + imgH + 24, 7.5, "bold", String(hero.num), [255, 255, 255], 0, "center");
    // headline + summary
    const headY = imgY + imgH + 30;
    textBlock(c, hx, headY, 19, "bold", hero.headline, INK, heroW, 2, 21.5, `hero ${hero.num} headline`);
    textBlock(c, hx, headY + 46, 10.5, "regular", hero.summary, INK, heroW, 3, 13, `hero ${hero.num} summary`);
  }

  // ---- grid ----------------------------------------------------------
  const gridY = 454;
  const cardW = 159;
  const cardGap = 8;
  const rowH = 120;
  for (let r = 0; r < 2; r++) {
    for (let col = 0; col < 6; col++) {
      const card = GRID[r * 6 + col];
      const gx = MARGIN + col * (cardW + cardGap);
      const gy = gridY + r * (rowH + 6);
      drawMini(c, card.scene, gx, gy, cardW, 42);
      drawChip(c, gx, gy + 46, card.chip, [232, 222, 200], RED);
      c.drawText(gx, gy + 72, 8.5, "bold", `${card.place} · ${card.topic}`, INK);
      textBlock(c, gx, gy + 75, 10.5, "bold", card.headline, INK, cardW, 2, 12, `grid ${card.num} headline`);
      textBlock(c, gx, gy + 100, 8.5, "regular", card.summary, INK, cardW, 2, 10, `grid ${card.num} summary`);
      // number badge on the mini illustration
      c.fillCircle(gx + 9, gy + 9, 6.5, GOLD);
      c.drawText(gx + 9, gy + 11.5, 7.5, "bold", String(card.num), INK, 0, "center");
    }
  }

  // ---- map + also-on -------------------------------------------------
  const mapY = 718;
  const mapW = 280;
  const mapH = 152;
  c.drawText(MARGIN, mapY - 4, 9.5, "bold", "WHERE IT HAPPENED — EVERY PIN IS A STORY", INK);
  drawMap(
    c,
    MARGIN,
    mapY + 4,
    mapW,
    mapH,
    [...HEROES, ...GRID].map((s) => ({ num: s.num, lat: s.lat, lon: s.lon })),
  );
  // (The map title already says every pin is a story; no extra note line,
//  it would collide with the BY THE CLOCK strip below.)

  const alsoX = MARGIN + mapW + 12;
  const alsoW = RIGHT - alsoX;
  const colW = (alsoW - 12) / 2;
  c.drawText(alsoX, mapY - 4, 9.5, "bold", "ALSO ON SUNDAY 22 NOVEMBER — 25 MORE STORIES", INK);
  for (let i = 0; i < ALSO_ON.length; i++) {
    const item = ALSO_ON[i];
    const col = i < 13 ? 0 : 1;
    const row = i < 13 ? i : i - 13;
    const ix = alsoX + col * (colW + 12);
    const iy = mapY + 8 + row * 12.5;
    const line = `${item.num} ${item.text}`;
    const lw = measureText("regular", line, 8);
    if (lw > colW) warn(`also-on ${item.num} too long: ${lw.toFixed(0)}px > ${colW.toFixed(0)}px`);
    c.drawText(ix, iy, 8, "regular", line, INK);
  }

  // ---- by the clock --------------------------------------------------
  const clockY = 890;
  c.drawText(MARGIN, clockY, 9.5, "bold", "BY THE CLOCK", RED);
  const clockX = MARGIN + 96;
  const clockW = RIGHT - clockX;
  const clockLine1 = CLOCK_ITEMS.slice(0, 4).join("  ·  ");
  const clockLine2 = CLOCK_ITEMS.slice(4).join("  ·  ");
  if (measureText("regular", clockLine1, 8.5) > clockW) warn("clock line 1 too long");
  if (measureText("regular", clockLine2, 8.5) > clockW) warn("clock line 2 too long");
  c.drawText(clockX, clockY, 8.5, "regular", clockLine1, INK);
  c.drawText(clockX, clockY + 12, 8.5, "regular", clockLine2, INK);

  // ---- date check ----------------------------------------------------
  const dcY = 924;
  const dcH = 54;
  c.fillRect(MARGIN, dcY, CONTENT_W, 1.5, RED);
  c.fillRect(MARGIN, dcY + dcH - 1.5, CONTENT_W, 1.5, RED);
  c.fillRect(MARGIN, dcY, 1.5, dcH, RED);
  c.fillRect(RIGHT - 1.5, dcY, 1.5, dcH, RED);
  const dcLines = wrapText("regular", `DATE CHECK — ${DATE_CHECK}`, 9.5, CONTENT_W - 20);
  if (dcLines.length > 3) warn(`date check needs ${dcLines.length} lines`);
  c.drawLines(MARGIN + 10, dcY + 7, 9.5, "regular", dcLines.slice(0, 3), INK, 13);

  // ---- footer --------------------------------------------------------
  c.drawText(W / 2, 986, 7.5, "regular", SOURCES, GREY, 0, "center");
  c.drawText(
    W / 2,
    1000,
    8,
    "bold",
    "THE WORLD IN ONE DAY  ·  SUNDAY 22 NOVEMBER 2026  ·  ONE PAGE  ·  40 STORIES  ·  WIRES READ 08:17 UTC",
    INK,
    0,
    "center",
  );

  // ---- write ---------------------------------------------------------
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.png"), c.toPNG());
  if (warnings.length > 0) {
    console.error(`WARNINGS (${warnings.length}):`);
    for (const w of warnings) console.error(` - ${w}`);
  } else {
    console.error("layout: 0 warnings");
  }
}

main();
