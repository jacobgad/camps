import { createHash } from "crypto";
import { env } from "../env/server.mjs";

export function hashToken(token: string, secret?: string) {
  return createHash("sha256")
    .update(`${token}${secret ?? env.NEXTAUTH_SECRET}`)
    .digest("hex");
}

export function getToken(length = 6) {
  return Math.random()
    .toString()
    .substring(2, length + 2);
}
