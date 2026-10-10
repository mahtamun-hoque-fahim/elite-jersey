import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

const handlers = toNextJsHandler(auth.handler);

export const GET = handlers.GET;

// Public sign-up is closed: admins are created from the dashboard (server-side) only.
export async function POST(req: Request) {
  if (new URL(req.url).pathname.includes("/sign-up")) {
    return new Response("Not found", { status: 404 });
  }
  return handlers.POST(req);
}
