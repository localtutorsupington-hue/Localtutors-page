/** "Hoe om beter te *slaap*" -> gewone teks sonder sterretjies */
export function skoonTitel(t: string): string {
  return t.replace(/\*/g, "");
}

/** Verdeel 'n titel in stukke; die woord tussen *sterretjies* word die "pill". */
export function titelStukke(t: string): { teks: string; pill: boolean }[] {
  return t
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((s) => (s.startsWith("*") ? { teks: s.slice(1, -1), pill: true } : { teks: s, pill: false }));
}

export function datum(d: Date): string {
  return d.toLocaleDateString("af-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Johannesburg" });
}

export function leestyd(body: string | undefined, gegee?: number): number {
  if (gegee) return gegee;
  const woorde = (body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(woorde / 200));
}
