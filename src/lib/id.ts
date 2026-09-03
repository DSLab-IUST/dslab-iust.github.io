/** Collision-resistant identifier that stays readable inside a JSON diff. */
export function createId(prefix: string): string {
  const stamp = Date.now().toString(36);
  const random = crypto.getRandomValues(new Uint32Array(1))[0]!.toString(36).slice(0, 6);

  return `${prefix}_${stamp}${random}`;
}
