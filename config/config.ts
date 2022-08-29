import { defineConfig } from 'umi';
import path from 'path';
import routes from './routes';
import chainWebpack from './chainWebpack';
import env from './env';

export default defineConfig({
  define: {
    'process.env.APP_ENV': process.env.APP_ENV
  },
  ssr: {
    // mode: 'stream',  // 流式渲染
    forceInitial: false,  // 保证页面切换数据更新
    devServerRender: true,  // 开启服务端渲染
  },
  // 动态加载
  dynamicImport: {
    loading: '@/components/Loading',
  },
  base: env.BASE_ROUTE_URL,
  // 编译加速
  nodeModulesTransform: {
    type: 'none',
    exclude: ['node_modules']
  },
  antd: false,  // antd 样式
  cssLoader: {
    localsConvention: 'camelCase',  // css 选择器小驼峰式
  },
  routes,
  alias: {
    '~@': path.resolve(__dirname, '../src'),  // 给 less 用的
    '~': path.resolve(__dirname, '../'),  // 跟目录
  },
  // hash: true,  // 文件hash
  outputPath: '/deploy/www',
  // devtool: 'eval-source-map',
  devServer: {
    port: 3000
  },
  analyze: {
    analyzerMode: 'server',
  },
  inlineLimit: 2048,  // base64 编译阈值，字节
  ignoreMomentLocale: true,  // 忽略 moment 的 locale 文件
  fastRefresh: {},
  // chunks: ['dayjs', 'umi'],
  chainWebpack,
});
