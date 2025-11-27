import mdx from '@astrojs/mdx'
import netlify from '@astrojs/netlify'
import sitemap from '@astrojs/sitemap'
import strapi from '@astrojs/strapi'
import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'

export default defineConfig({
  site: 'https://astro-theme-vitesse.netlify.app/',
  server: {
    port: 1977,
  },
  output: 'static', // 推荐使用静态生成
  adapter: netlify(),
  integrations: [
    mdx(),
    sitemap(),
    UnoCSS({
      injectReset: true,
    }),
    vue(),
    strapi({
      apiURL: import.meta.env.STRAPI_URL, // 直接使用环境变量
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
})
