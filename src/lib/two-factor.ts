export type TwoFactorMethod = "email" | "phone" | "app";

export type TwoFactor = {
  method: TwoFactorMethod;
  secret: string;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function createSecret(): string {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => ALPHABET[byte % 32]).join("");
}

function decodeSecret(secret: string): Uint8Array {
  const clean = secret.replace(/=+$/g, "").toUpperCase();
  const out: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const char of clean) {
    const value = ALPHABET.indexOf(char);
    if (value < 0) continue;
    buffer = (buffer << 5) | value;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      out.push((buffer >> bits) & 0xff);
    }
  }
  return new Uint8Array(out);
}

async function hotp(secret: string, counter: number): Promise<string> {
  const bytes = new ArrayBuffer(8);
  new DataView(bytes).setUint32(4, counter);
  const raw = decodeSecret(secret);
  const keyBytes = new Uint8Array(raw.byteLength);
  keyBytes.set(raw);
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, bytes));
  const offset = mac[mac.length - 1] & 0xf;
  const bin =
    ((mac[offset] & 0x7f) << 24) |
    (mac[offset + 1] << 16) |
    (mac[offset + 2] << 8) |
    mac[offset + 3];
  return String(bin % 1_000_000).padStart(6, "0");
}

export async function currentCode(secret: string, at = Date.now()): Promise<string> {
  return hotp(secret, Math.floor(at / 30_000));
}

export async function codeMatches(secret: string, code: string): Promise<boolean> {
  const entered = code.replace(/\D/g, "");
  const now = Date.now();
  const checks = await Promise.all([-1, 0, 1].map((step) => currentCode(secret, now + step * 30_000)));
  return checks.includes(entered);
}

export function oneTimeCode(): string {
  return String(Math.floor(100_000 + Math.random() * 900_000));
}
