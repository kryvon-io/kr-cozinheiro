import "server-only";
import { scrypt as scryptCb, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSessionToken,
  verifySessionToken,
} from "./session-token";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

function safeEqual(a: string, b: string) {
  // Compara digests de tamanho fixo para não vazar o tamanho via tempo.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

async function passwordMatches(password: string) {
  const stored = process.env.AUTH_PASSWORD_HASH?.trim();
  if (stored) {
    const [saltHex, hashHex] = stored.split(":");
    if (!saltHex || !hashHex) {
      throw new Error("AUTH_PASSWORD_HASH em formato inválido (salt:hash).");
    }
    const expected = Buffer.from(hashHex, "hex");
    const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }
  // Alternativa mais simples: senha em texto na variável de ambiente.
  const plain = process.env.AUTH_PASSWORD;
  if (plain) return safeEqual(password, plain);
  throw new Error("Configure AUTH_PASSWORD_HASH (ou AUTH_PASSWORD).");
}

export async function verifyCredentials(email: string, password: string) {
  const expectedEmail = process.env.AUTH_EMAIL?.trim().toLowerCase();
  if (!expectedEmail) throw new Error("Configure AUTH_EMAIL.");
  const emailOk = safeEqual(email.trim().toLowerCase(), expectedEmail);
  const passwordOk = await passwordMatches(password);
  return emailOk && passwordOk;
}

export async function createSession() {
  const email = process.env.AUTH_EMAIL!.trim().toLowerCase();
  const token = await signSessionToken(email);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Use em toda Server Action / Route Handler que lê ou altera dados. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
