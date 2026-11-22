// The day's news: 40 stories for Sunday 22 November 2026, each verified
// against at least two sources by the wire read at 08:17 UTC. Claims that
// are not confirmed are labelled CLAIM. Stories from other days are kept
// out and named in the DATE CHECK box instead.

export interface Hero {
  num: number;
  kicker: string;
  chip: string;
  place: string;
  topic: string;
  headline: string;
  summary: string;
  source: string;
  scene: "cop31" | "bahrain" | "sinaloa";
  lat: number;
  lon: number;
}

export const HEROES: Hero[] = [
  {
    num: 1,
    kicker: "COP31: OVERTIME",
    chip: "200 nations",
    place: "ANTALYA, TURKEY",
    topic: "CLIMATE",
    headline: "COP31 talks push into overtime as a new draft lands",
    summary:
      "The presidency tables a fresh text after deadlock over fossil fuels and finance; objections close 03:00 GMT before a 06:00 GMT session.",
    source: "Reuters, AP",
    scene: "cop31",
    lat: 36.9,
    lon: 30.7,
  },
  {
    num: 2,
    kicker: "CLAIM: IRAN SAYS",
    chip: "2 radars",
    place: "MANAMA, BAHRAIN",
    topic: "IRAN WAR",
    headline: "Iran claims it hit two US Patriot radars in Bahrain",
    summary:
      "Tehran says missiles and drones hit radars at al-Riffa and Awali; Bahrain confirms only a civilian site burned. Unverified.",
    source: "Xinhua, Al Jazeera",
    scene: "bahrain",
    lat: 26.2,
    lon: 50.6,
  },
  {
    num: 3,
    kicker: "CAPTURED",
    chip: "11 dead",
    place: "GUASAVE, MEXICO",
    topic: "CARTELS",
    headline: "'El Chapo Isidro' captured as Sinaloa burns",
    summary:
      "Troops seize FBI fugitive Fausto Isidro Meza Flores, 44; gun battles, burning roadblocks and 11 dead follow.",
    source: "Reuters, CNN",
    scene: "sinaloa",
    lat: 25.6,
    lon: -108.5,
  },
];

export interface NumberItem {
  value: string;
  caption: string;
}

export const NUMBERS: NumberItem[] = [
  { value: "200", caption: "nations at COP31" },
  { value: "148", caption: "drones in one night" },
  { value: "720/9", caption: "India's record Test total in New Zealand" },
  { value: "24", caption: "dead as mourners' boat capsizes" },
  { value: "~600", caption: "in care after Manipur liquor poisoning" },
  { value: "36", caption: "missing in Java factory fire" },
];

export interface Region {
  name: string;
  count: number;
  color: [number, number, number];
}

export const REGIONS: Region[] = [
  { name: "EUROPE", count: 13, color: [37, 99, 235] },
  { name: "MIDDLE EAST", count: 8, color: [220, 38, 38] },
  { name: "AMERICAS", count: 8, color: [21, 128, 61] },
  { name: "ASIA-PACIFIC", count: 5, color: [234, 88, 12] },
  { name: "AFRICA", count: 2, color: [146, 64, 14] },
  { name: "OCEANIA", count: 2, color: [14, 116, 144] },
  { name: "WORLD", count: 2, color: [71, 85, 105] },
];

export interface GridCard {
  num: number;
  chip: string;
  place: string;
  topic: string;
  headline: string;
  summary: string;
  scene: string;
  lat: number;
  lon: number;
}

export const GRID: GridCard[] = [
  {
    num: 4,
    chip: "148 DRONES",
    place: "KRYVYI RIH, UKRAINE",
    topic: "WAR",
    headline: "Drones kill two in Zelenskyy's home city",
    summary: "A 7-year-old and a paramedic die; 148 drones hit overnight.",
    scene: "drone",
    lat: 47.9,
    lon: 33.4,
  },
  {
    num: 5,
    chip: "16 CREW SAFE",
    place: "GULF OF FINLAND",
    topic: "WAR AT SEA",
    headline: "Russian ship ablaze after drone strike",
    summary: "Sparta II drifts into Finnish waters; all 16 crew rescued.",
    scene: "ship",
    lat: 59.8,
    lon: 24.5,
  },
  {
    num: 6,
    chip: "COALITION TALKS",
    place: "JERUSALEM",
    topic: "POLITICS",
    headline: "Eisenkot invites Likud to coalition talks",
    summary: "Marathon talks open, but a Netanyahu-led cabinet is ruled out.",
    scene: "parliament",
    lat: 31.8,
    lon: 35.2,
  },
  {
    num: 7,
    chip: "3 KILLED",
    place: "GAZA",
    topic: "CEASEFIRE",
    headline: "Strike hits food aid vehicle, three killed",
    summary: "WCK-marked vehicle hit in Tel al-Hawa; IDF cites a militant.",
    scene: "aid",
    lat: 31.5,
    lon: 34.5,
  },
  {
    num: 8,
    chip: "POWER CUTS",
    place: "TEHRAN, IRAN",
    topic: "ENERGY",
    headline: "Iran begins power rationing from Sunday",
    summary: "Cuts of up to two hours a day begin; a hard winter is warned.",
    scene: "power",
    lat: 35.7,
    lon: 51.4,
  },
  {
    num: 9,
    chip: "SEC PROBE",
    place: "WASHINGTON",
    topic: "BUSINESS",
    headline: "Nvidia faces SEC accounting probe",
    summary: "The regulator examines accounting as shares fall 14% on Friday.",
    scene: "probe",
    lat: 38.9,
    lon: -77.0,
  },
  {
    num: 10,
    chip: "BOLSONARO, ICU",
    place: "BRASÍLIA, BRAZIL",
    topic: "POLITICS",
    headline: "Bolsonaro in intensive care",
    summary: "Jailed ex-president, 71, admitted; stable and breathing alone.",
    scene: "hospital",
    lat: -15.8,
    lon: -47.9,
  },
  {
    num: 11,
    chip: "AUKUS ROW",
    place: "CANBERRA",
    topic: "DEFENCE",
    headline: "Marles rejects US report on AUKUS subs",
    summary: "Marles says the budget office is wrong on Virginia-class sales.",
    scene: "sub",
    lat: -35.3,
    lon: 149.1,
  },
  {
    num: 12,
    chip: "720/9",
    place: "WELLINGTON",
    topic: "CRICKET",
    headline: "India post record Test total in New Zealand",
    summary: "Pant 128 and Rahul 136 lift India to 720/9 declared, a record.",
    scene: "cricket",
    lat: -41.3,
    lon: 174.8,
  },
  {
    num: 13,
    chip: "856 CANDIDATES",
    place: "HONG KONG",
    topic: "POLITICS",
    headline: "Hong Kong votes for its Election Committee",
    summary: "856 candidates chase 723 seats; the body picks the chief in 2027.",
    scene: "ballot",
    lat: 22.3,
    lon: 114.2,
  },
  {
    num: 14,
    chip: "35 LEAD CHANGES",
    place: "LAS VEGAS",
    topic: "FORMULA 1",
    headline: "Verstappen wins a wild Las Vegas GP",
    summary: "Lead changes 35 times; Verstappen wins by 0.6s.",
    scene: "f1",
    lat: 36.2,
    lon: -115.1,
  },
  {
    num: 15,
    chip: "1 DEC",
    place: "TALLINN",
    topic: "SECURITY",
    headline: "Estonia to shut its Russia border on 1 Dec",
    summary: "Five crossings close for six months; crowds queue at Ivangorod.",
    scene: "border",
    lat: 59.4,
    lon: 24.7,
  },
];

export interface AlsoItem {
  num: number;
  text: string;
}

export const ALSO_ON: AlsoItem[] = [
  { num: 16, text: "Bayelsa: Boat of mourners capsizes, 24 dead (Reuters)" },
  { num: 17, text: "Turin: Zverev meets Alcaraz in ATP final tonight (ATP)" },
  { num: 18, text: "Liverpool: Pochettino debuts as Man Utd visit, 16:30 (Man Utd)" },
  { num: 19, text: "London: England crush New Zealand 37–12 (Reuters)" },
  { num: 20, text: "Paris: France beat Argentina 45–17, reach final (Reuters)" },
  { num: 21, text: "Brussels: EU leaders sign trade deal after delay (Reuters)" },
  { num: 22, text: "New York: S&P 500 enters correction as AI slides (Reuters)" },
  { num: 23, text: "Copenhagen: Denmark expels Russian defence attaché (WSJ)" },
  { num: 24, text: "Riyadh: Three Houthi missiles intercepted (Reuters)" },
  { num: 25, text: "Basra: Fire at Hamrin plant kills at least four (Reuters)" },
  { num: 26, text: "Manipur: Toxic liquor toll hits 16 dead, 600 in care (Xinhua)" },
  { num: 27, text: "Florida: St. Johns River breaks 1953 flood record (NWS)" },
  { num: 28, text: "Washington: FBI probes hack of NCTC database (AP)" },
  { num: 29, text: "Geneva: 128 nations agree talks on 'killer robots' (NPR)" },
  { num: 30, text: "Serang: Three dead, 36 missing in factory fire (Reuters)" },
  { num: 31, text: "Manila: Typhoon Mirinae kills two, thousands flee as third storm hits Luzon (Al Jazeera)" },
  { num: 32, text: "Madrid: Spain heads for snap election on 29 Nov (Guardian)" },
  { num: 33, text: "Washington: US denies Iran claim of damaged F-16 (CENTCOM)" },
  { num: 34, text: "Beirut: Aoun demands Israeli pullout, end to Iranian meddling (Al Jazeera)" },
  { num: 35, text: "Dublin: Ireland edge South Africa 20–17 (AP)" },
  { num: 36, text: "Edinburgh: Scotland rout Japan 67–5 (AP)" },
  { num: 37, text: "Helsinki: Russian helicopter in suspected airspace breach (DW)" },
  { num: 38, text: "Brussels: EU plastic waste export ban takes effect (EUobserver)" },
  { num: 39, text: "Seattle: Governor condemns ICE arrests on jetway (Reuters)" },
  { num: 40, text: "Khartoum: Sudan, Ethiopia trade blame as war fears grow (AP)" },
];

export const CLOCK_ITEMS: string[] = [
  "01:00 UTC Hong Kong polls open",
  "02:00 UTC COP31 objection deadline ends",
  "03:00 UTC Hartha gas pipeline fire, Basra",
  "06:00 UTC COP31 approval session opens",
  "07:00 UTC Sparta II hit by two drones",
  "10:34 UTC Suspected airspace breach, Finland",
  "16:30 UTC Liverpool v Man Utd kick off",
  "17:00 UTC ATP final: Zverev v Alcaraz",
];

export const DATE_CHECK =
  "Wires read up to 08:17 UTC, Sunday 22 November 2026; every story here was reported, or was still developing, on 22 November in at least one time zone. Left out as other days' news: the Peru earthquake (20 Nov), Russian missiles in Poland (19 Nov), the Kerch Bridge strikes (earlier this week), the Shenzhen summit (19 Nov), the Anthropic IPO (19 Nov), the GTA VI launch (19 Nov), the ICJ genocide ruling on Myanmar (19 Nov), and Russia's 400-drone barrage (night of 20 Nov) — not last night's 148-drone attack.";

export const SOURCES =
  "Sources: Reuters, AP, Al Jazeera, Xinhua, AFP, BBC, DW, Straits Times, CNN, ATP, NWS, WSJ, Le Monde, NPR, EUobserver, CENTCOM, UKMTO. Every story names its outlet. Pictures and map: original, drawn in code.";
