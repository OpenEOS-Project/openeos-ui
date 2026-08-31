/** Verbindet Klassennamen und verwirft alles Falsy. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Baut aus Basisklasse und Modifikatoren die .oe-BEM-Kette. */
export function bem(
  base: string,
  modifiers: Array<string | false | null | undefined>,
  extra?: string,
): string {
  return cx(base, ...modifiers.map((m) => (m ? `${base}--${m}` : null)), extra);
}
