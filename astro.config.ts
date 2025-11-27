import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
// 导入社区维护的 Strapi 加载器
import strapiLoader from '@sensinum/astro-strapi-loader';

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
    strapiLoader({
      // 从环境变量获取 Strapi 后端地址
      api: {
        baseURL: import.meta.env.STRAPI_URL,
      },
      // 根据包文档，启用对 Strapi v5 的支持
      strapi5: true,
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
