import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
// 正确：从包的主入口导入
import strapi from '@sensinum/astro-strapi-loader';

export default defineConfig({
  site: 'https://astro-theme-vitesse.netlify.app/',
  server: {
    port: 1977,
  },
  output: 'static',
  adapter: netlify(),
  integrations: [
    mdx(),
    sitemap(),
    UnoCSS({
      injectReset: true,
    }),
    vue(),
    // 配置 Strapi 加载器集成
    strapi({
      // 使用正确的配置结构
      url: import.meta.env.STRAPI_URL,
      token: import.meta.env.STRAPI_TOKEN, // 可选
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default',
      },
      wrap: true,
    },
  },
});
