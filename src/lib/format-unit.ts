const bengaliUnits: Record<string, string> = {
  kg: "কেজি",
  kilogram: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  piece: "পিস",
  dozen: "ডজন",
};

export function formatUnit(unit: string): string {
  const key = unit.trim().toLowerCase();
  return Object.hasOwn(bengaliUnits, key) ? bengaliUnits[key] : unit;
}
