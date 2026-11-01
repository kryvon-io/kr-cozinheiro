// Gera o valor de AUTH_PASSWORD_HASH.
// Uso: npm run hash-password -- "minha-senha"
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error('Uso: npm run hash-password -- "minha-senha"');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log(`${salt.toString("hex")}:${hash.toString("hex")}`);
