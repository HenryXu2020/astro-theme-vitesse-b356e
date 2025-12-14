// src/lib/strapi.js
import { GraphQLClient } from 'graphql-request';

// 从环境变量读取Strapi地址
const STRAPI_URL = import.meta.env.STRAPI_URL;
const endpoint = `${STRAPI_URL}/graphql`;

// 创建客户端实例
export const graphQLClient = new GraphQLClient(endpoint);

/**
 * 通用查询函数
 */
export async function fetchStrapi({ query, variables = {} }) {
  try {
    return await graphQLClient.request(query, variables);
  } catch (error) {
    console.error('Strapi查询错误:', error);
    // 返回空数据，避免阻塞页面构建
    return null;
  }
}

/**
 * 获取博客列表
 */
export async function getStrapiBlogs() {
  const query = `
    query {
      blogs(sort: "publishedAt:desc") {
        documentId
        title
        publishedAt
        author
        slug // 新增：查询slug字段
        cover {
          url
        }
      }
    }
  `;
  const data = await fetchStrapi({ query });
  return data?.blogs?.map(blog => ({
    id: blog.documentId,
    title: blog.title,
    date: new Date(blog.publishedAt),
    author: blog.author,
    slug: blog.slug, // 新增：将slug映射到返回对象中
    cover: blog.cover?.url,
  })) || [];
}
