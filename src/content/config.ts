import { defineCollection, z } from 'astro:content'
import { generateCollections } from '@sensinum/astro-strapi-loader'

// 定义本地集合（保持您原有的配置）
const pages = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
  }),
})

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    duration: z.string().optional(),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    date: z
      .string()
      .or(z.date())
      .transform((val: string | number | Date) => new Date(val).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })),
    draft: z.boolean().default(false).optional(),
    lang: z.string().default('en-US').optional(),
    tag: z.string().optional().optional(),
    redirect: z.string().optional(),
    video: z.boolean().default(false).optional(),
  }),
})

// 从 Strapi 生成动态集合
let strapiCollections: any = {}

try {
  strapiCollections = await generateCollections(
    {
      url: import.meta.env.STRAPI_URL,
      token: import.meta.env.STRAPI_TOKEN, // 可选
    },
    [
      // 在这里配置您想要从 Strapi 获取的集合
      // 示例：获取文章集合
      {
        name: "strapi-articles", // 给这个集合一个名称
        query: {
          populate: {
            // 根据您的 Strapi 内容模型配置填充字段
            // 例如：cover: true, author: { populate: '*' }, categories: true
          },
        },
      },
      // 您可以添加更多 Strapi 集合
      // {
      //   name: "strapi-products",
      //   query: {
      //     populate: {
      //       images: true,
      //       categories: true
      //     }
      //   }
      // }
    ]
  )
} catch (error) {
  console.error('Failed to fetch data from Strapi:', error)
}

// 导出合并的集合：本地集合 + Strapi 集合
export const collections = {
  ...strapiCollections, // Strapi 动态集合
  pages, // 您原有的本地 pages 集合
  blog,  // 您原有的本地 blog 集合
}
