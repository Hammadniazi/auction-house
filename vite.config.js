import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "pages/login.html"),
        register: resolve(__dirname, "pages/register.html"),
        profile: resolve(__dirname, "pages/profile.html"),
        listing: resolve(__dirname, "pages/listing.html"),
        createListing: resolve(__dirname, "pages/create-listing.html"),
        userProfile: resolve(__dirname, "pages/userProfile.html"),
      },
    },
  },
});
