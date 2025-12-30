export type StatType =
  | "PTS"
  | "REB"
  | "AST"
  | "3PM"
  | "BLK"
  | "STL"
  | "PRA"
  | "PR"
  | "PA"
  | "RA";

export type OverUnder = "OVER" | "UNDER";

export type ParsedLeg = {
  raw: string;
  player: string;
  market: StatType;
  pick: OverUnder;
  line: number;
};

const MARKET_ALIASES: Array<[RegExp, StatType]> = [
  [/^(pts|points?)$/i, "PTS"],
  [/^(reb|rebounds?)$/i, "REB"],
  [/^(ast|assists?)$/i, "AST"],
  [/^(3pm|3ptm|threes?|three\s*pointers?)$/i, "3PM"],
  [/^(blk|blocks?)$/i, "BLK"],
  [/^(stl|steals?)$/i, "STL"],
  [/^(pra)$/i, "PRA"],
  [/^(pr)$/i, "PR"],
  [/^(pa)$/i, "PA"],
  [/^(ra)$/i, "RA"],
];

function normalizeMarket(token: string): StatType | null {
  const cleaned = token.trim().replace(/[().]/g, "");
  for (const [re, market] of MARKET_ALIASES) {
    if (re.test(cleaned)) return market;
  }
  return null;
}

function normalizePick(token: string): OverUnder | null {
  const t = token.trim().toLowerCase();
  if (t === "o" || t === "over") return "OVER";
  if (t === "u" || t === "under") return "UNDER";
  return null;
}

function toNumber(s: string): number | null {
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * v1: parses 1 leg per line.
 * Expected patterns (flexible order):
 *  - "<player> O|U <line> <market>"
 *  - "<player> Over|Under <line> <market>"
 * Examples:
 *  - "LeBron James O 27.5 PTS"
 *  - "Stephen Curry Over 4.5 Threes"
 */
export function parseSlip(slipText: string): ParsedLeg[] {
  if (!slipText?.trim()) return [];

  const lines = slipText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const legs: ParsedLeg[] = [];

  for (const raw of lines) {
    // normalize spacing
    const line = raw.replace(/\s+/g, " ").trim();

    // Try pattern: "<player> (O|U|Over|Under) <line> <market>"
    // We keep player greedy but stop before pick token.
   const m = line.match(
  /^(.+?)\s+(O|U|Over|Under)\s+(\d+(\.\d+)?)\s+([A-Za-z0-9 ]+)$/i
);


    if (!m?.groups) continue;

    const player = m.groups.player.trim();
    const pick = normalizePick(m.groups.pick);
    const lineNum = toNumber(m.groups.line);
    const market = normalizeMarket(m.groups.market.trim().replace(/\s+/g, " "));

    if (!player || !pick || lineNum === null || !market) continue;

    legs.push({
      raw,
      player,
      market,
      pick,
      line: lineNum,
    });
  }

  return legs;
}
