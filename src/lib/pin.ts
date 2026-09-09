import { createHash, randomUUID } from "crypto";
import { hash, compare } from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPin(pin: string): Promise<string> {
  return hash(pin, SALT_ROUNDS);
}

export async function verifyPin(pin: string, pinHash: string): Promise<boolean> {
  return compare(pin, pinHash);
}

export function isValidPin(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}

export function pinLookup(pin: string): string {
  return createHash("sha256").update(pin).digest("hex");
}

export function generateRandomPassword(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let result = "";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

export function generateSyntheticEmail(): string {
  return `u-${randomUUID()}@pin.local`;
}