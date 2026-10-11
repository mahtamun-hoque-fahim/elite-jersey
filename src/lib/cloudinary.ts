import "server-only";

export type CloudinaryStatus = "missing" | "ok" | "invalid" | "unreachable";

/** Checks the three env vars and pings Cloudinary with them. Never returns the secret. */
export async function cloudinaryStatus(): Promise<CloudinaryStatus> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) return "missing";
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/ping`, {
      headers: { Authorization: `Basic ${btoa(`${key}:${secret}`)}` },
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403 || res.status === 404) return "invalid";
    return res.ok ? "ok" : "unreachable";
  } catch {
    return "unreachable";
  }
}
