import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Public pages render per request (no ISR), so no incremental cache binding is needed.
export default defineCloudflareConfig({});
