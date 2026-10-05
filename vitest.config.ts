import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "supabase/tests/**/*.test.ts"],
    coverage: { reporter: ["text", "json", "html"] }
  },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } }
});
