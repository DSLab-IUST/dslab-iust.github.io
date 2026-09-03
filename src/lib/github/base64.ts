/**
 * The Contents API exchanges file bodies as base64. `btoa`/`atob` operate on
 * latin-1, so Persian content must round-trip through UTF-8 byte arrays.
 */

const CHUNK_SIZE = 0x8000;

export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';

  for (let offset = 0; offset < bytes.length; offset += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + CHUNK_SIZE));
  }

  return btoa(binary);
}

export function decodeBase64(encoded: string): string {
  const binary = atob(encoded.replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}
