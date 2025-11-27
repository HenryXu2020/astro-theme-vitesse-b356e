import { defineCollection, z } from 'astro:content';
import { generateCollections } from '@sensinum/astro-strapi-loader';

// 定义本地集合（保持您原有的配置）
const pages = defineCollection({
  type: 'content', // 明确指定类型
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    duration: z.string().optional(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    date: z.string().or(z.date()).transform((val) => new Date(val).toISOString()), // 统一为ISO格式便于处理
    draft: z.boolean().default(false),
    lang: z.string().default('en-US'),
    tag: z.string().optional(),
    redirect: z.string().optional(),
    video: z.boolean().default(false),
  }),
});

// 从 Strapi 生成动态集合
let strapiCollections = {};

try {
  strapiCollections = await generateCollections(
    {
      url: import.meta.env.STRAPI_URL, // 确保在 .env 文件中设置
      token: import.meta.env.STRAPI_TOKEN, // 如果 Strapi 需要令牌访问
    },
    [
      {
        name: 'strapi-articles', // 在 Astro 中使用的集合名
        query: {
          populate: {
            // 根据您的 Strapi 内容类型结构进行配置
            // 示例：填充封面图片、作者、分类等关系字段
            cover: true,
            author: { populate: '*' },
            categories: true,
          },
          publicationState: 'live', // 确保获取已发布的内容
          sort: ['publishedAt:desc'],
        },
      },
      // 您可以添加更多 Strapi 集合，例如产品
      // {
      //   name: "strapi-products",
      //   query: {
      //     populate: {
      //       images: true,
      //       category: true
      //     }
      //   }
      // }
    ]
  );
} catch (error) {
  console.error('Failed to generate Strapi collections:', error);
}

// 导出合并的集合
export const collections = {
  ...strapiCollections,
  pages,
  blog,
};
