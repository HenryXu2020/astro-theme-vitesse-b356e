/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly STRAPI_URL: string
  // 可以添加其他环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
