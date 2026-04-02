import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/GreensWebsite/",
  plugins: [react()],
  assetsInclude: ["**/*.mp4", "**/*.MP4"],
});
