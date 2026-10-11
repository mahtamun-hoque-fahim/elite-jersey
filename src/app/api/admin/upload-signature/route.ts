import { getSession } from "@/lib/auth/session";

// Signed Cloudinary upload: the browser uploads straight to Cloudinary, the secret never leaves the server.
// Uses Web Crypto so it runs on Vercel and Cloudflare.
export async function POST() {
  const session = await getSession();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json({ error: "Cloudinary is not configured yet." }, { status: 503 });
  }

  const folder = "elite-jersey";
  const timestamp = Math.floor(Date.now() / 1000);
  const allowedFormats = "jpg,jpeg,png,webp,avif";
  // Cloudinary signs params in alphabetical order
  const toSign = `allowed_formats=${allowedFormats}&folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(toSign));
  const signature = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");

  return Response.json({ cloudName, apiKey, timestamp, folder, allowedFormats, signature });
}
