import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import rehypeKontrole from "./src/lib/rehype-kontrole.mjs";
import { SITE_URL } from "./src/config.ts";

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "always",
  markdown: {
    // Sit die gratis-kontrole kaart halfpad in elke artikel.
    processor: unified({ smartypants: false, rehypePlugins: [rehypeKontrole] }),
  },
});
