import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import AutoImport from "astro-auto-import";
import { defineConfig, squooshImageService } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import config from "./src/config/config.json";
import basicSsl from '@vitejs/plugin-basic-ssl'

import sanity from "@sanity/astro";

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  image: {
    service: squooshImageService(),
  },
  vite: {
    plugins: [
      basicSsl({
        /** name of certification */
        name: 'yppo',
        /** custom trust domains */
        domains: ['localhost'],
        /** custom certification directory */
        certDir: './'
      })
    ],
    server: {
      https: true,
    },
  },
  integrations: [
    react(),
    sitemap(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Blockquote",
        "@/shortcodes/Badge",
        "@/shortcodes/ContentBlock",
        "@/shortcodes/Changelog",
        "@/shortcodes/Tab",
        "@/shortcodes/Tabs",
      ],
    }),
    mdx(),
    sanity({
      projectId: config.sanity.project_id,
      dataset: config.sanity.dataset,
      useCdn: false,
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
  },
});
