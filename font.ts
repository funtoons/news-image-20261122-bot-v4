// Liberation Serif face access: parses the flattened outline data in
// fontdata.ts (extracted from the OFL-licensed system font) and offers
// measurement, word wrap and glyph lookup for the renderer.
import { FONT_BOLD, FONT_REGULAR } from "./fontdata.ts";

export type FaceName = "regular" | "bold";

export interface Glyph {
  adv: number;
  contours: number[][];
}

export interface Face {
  upm: number;
  asc: number;
  desc: number;
  glyphs: Map<number, Glyph>;
}

type RawFace = [number, number, number, [number, number, number[][]][]];

function parseFace(raw: string): Face {
  const data = JSON.parse(raw) as RawFace;
  const [upm, asc, desc, list] = data;
  const glyphs = new Map<number, Glyph>();
  for (const [code, adv, contours] of list) {
    glyphs.set(code, { adv, contours });
  }
  return { upm, asc, desc, glyphs };
}

export const FACES: Record<FaceName, Face> = {
  regular: parseFace(FONT_REGULAR),
  bold: parseFace(FONT_BOLD),
};

// Fallback glyph: space (blank, advances normally).
const SPACE: Glyph = { adv: 500, contours: [] };

export function glyphFor(face: FaceName, ch: string): Glyph {
  const code = ch.codePointAt(0) ?? 32;
  return FACES[face].glyphs.get(code) ?? SPACE;
}

export function measureText(
  face: FaceName,
  text: string,
  size: number,
  tracking = 0,
): number {
  const f = FACES[face];
  let w = 0;
  for (const ch of text) {
    const g = f.glyphs.get(ch.codePointAt(0) ?? 32);
    if (!g) continue;
    w += (g.adv / f.upm) * size + tracking;
  }
  return w;
}

/** Greedy word wrap. Returns lines that each fit maxWidth (a single long
 *  word is kept whole on its own line rather than clipped). */
export function wrapText(
  face: FaceName,
  text: string,
  size: number,
  maxWidth: number,
  tracking = 0,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line === "" ? word : line + " " + word;
    if (line === "" || measureText(face, test, size, tracking) <= maxWidth) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line !== "") lines.push(line);
  return lines;
}

/** Wrap and report how many lines the text needs at this width. */
export function wrappedLineCount(
  face: FaceName,
  text: string,
  size: number,
  maxWidth: number,
  tracking = 0,
): number {
  return wrapText(face, text, size, maxWidth, tracking).length;
}
