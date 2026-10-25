/** Names (never values) of required environment variables that are missing on this deployment. */
export function missingEnv(names: string[]) {
  return names.filter((n) => !process.env[n]);
}

export const AUTH_ENV = ["DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL"];

export function missingMessage(missing: string[]) {
  return `Missing on this deployment: ${missing.join(", ")}. Add them in your hosting environment variables (set for Production), then redeploy.`;
}
