import { jwtVerify, SignJWT } from "jose";

/**
 * Funções de token sem dependências do Node para poderem rodar tanto no
 * proxy quanto nos componentes de servidor.
 */
export const SESSION_COOKIE = "krc_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET precisa estar configurada com pelo menos 32 caracteres."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(email: string) {
  return new SignJWT({ sub: email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string") return null;
    if (payload.sub !== process.env.AUTH_EMAIL?.trim().toLowerCase()) {
      return null;
    }
    return { email: payload.sub };
  } catch {
    return null;
  }
}
