import { gql, GraphQLClient } from 'graphql-request';

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || import.meta.env.STRAPI_URL; // 优先使用PUBLIC_前缀变量
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN;

// 打印环境变量状态（构建日志中可见，但不会出现在浏览器）
console.log('[Strapi Config] URL:', STRAPI_URL ? '已设置' : '未设置');
console.log('[Strapi Config] TOKEN:', STRAPI_TOKEN ? '已设置' : '未设置');

// 如果缺少关键配置，直接抛出清晰错误
if (!STRAPI_URL) {
  throw new Error('Strapi URL 环境变量未设置。请在Netlify中配置 PUBLIC_STRAPI_URL 或 STRAPI_URL。');
}
if (!STRAPI_TOKEN) {
  throw new Error('Strapi Token 环境变量未设置。请在Netlify中配置 STRAPI_TOKEN。');
}

const graphQLClient = new GraphQLClient(`${STRAPI_URL}/graphql`, {
  headers: {
    authorization: `Bearer ${STRAPI_TOKEN}`,
  },
});

export async function getStrapiBlogs() {
  try {
    console.log('[Strapi] 正在请求博客列表...');
    const query = gql`
      query {
        blogs {
          slug
          title
          author
          publishedAt
          cover { url }
          content
        }
      }
    `;
    const data = await graphQLClient.request(query);
    console.log(`[Strapi] 成功获取到 ${data.blogs?.length || 0} 篇文章`);
    return data.blogs || [];
  } catch (error) {
    // 在构建日志中输出详细的错误信息
    console.error('[Strapi] 获取博客列表失败:', error.message);
    console.error('[Strapi] 请求地址:', STRAPI_URL);
    // 返回空数组，防止构建完全中断
    return [];
  }
}

export async function getStrapiBlogBySlug(slug) {
  try {
    console.log(`[Strapi] 正在请求文章: ${slug}`);
    const query = gql`
      query GetBlogBySlug($slug: String!) {
        blogs(filters: { slug: { eq: $slug } }) {
          slug
          title
          author
          publishedAt
          cover { url }
          content
        }
      }
    `;
    const data = await graphQLClient.request(query, { slug });
    return data.blogs?.[0] || null;
  } catch (error) {
    console.error(`[Strapi] 获取文章 ${slug} 失败:`, error.message);
    return null;
  }
}
