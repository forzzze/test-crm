import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const avatarDirectory = fileURLToPath(new URL("./public/avatars/patients/", import.meta.url));

function inlinePatientAvatars() {
  return {
    name: "inline-patient-avatars",
    apply: "build",
    generateBundle(_options, bundle) {
      const avatars = readdirSync(avatarDirectory).filter((file) => file.endsWith(".png"));

      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk") continue;
        for (const avatar of avatars) {
          const publicPath = `/avatars/patients/${avatar}`;
          const dataUrl = `data:image/png;base64,${readFileSync(`${avatarDirectory}/${avatar}`).toString("base64")}`;
          output.code = output.code.split(publicPath).join(dataUrl);
        }
      }
    },
  };
}

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["recharts"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.tsx"],
    },
  },
  plugins: [react(), inlinePatientAvatars()],
});
