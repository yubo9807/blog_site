import CompressionPlugin from 'compression-webpack-plugin';

export default (config) => {

  // 删除 umi 内置插件
  config.plugins.delete('progress');
  config.plugins.delete('friendly-error');
  config.plugins.delete('@umijs/plugin-antd');
  config.plugins.delete('@umijs/plugin-antd-mobile');
  config.plugins.delete('@umijs/plugin-analytics');
  config.plugins.delete('@umijs/plugin-crossorigin');
  config.plugins.delete('@umijs/plugin-initial-state');
  config.plugins.delete('@umijs/plugin-model');
  config.plugins.delete('@umijs/plugin-locale');
  config.plugins.delete('@umijs/plugin-preact');
  config.plugins.delete('@umijs/plugin-request');
  config.plugins.delete('@umijs/plugin-qiankun');
  config.plugins.delete('@umijs/plugin-sass');
  config.plugins.delete('@umijs/plugin-esbuild');
  config.plugins.delete('@umijs/plugin-dva');

  config.merge({
    optimization: {
      splitChunks: {
        chunks: 'all',  // 'async':只对异步代码生效，all是对同步和异步都生效
        minSize: 30000,  // 引入的库或包的大小>30kb,才会做代码分割
        minChunks: 2,  // 当一个模块至少被用(被打包之后的Chunk用)了多少次之后才进行代码分割
        maxAsyncRequests: 5,  // 同时加载的模块数最多是5个
        maxInitialRequests: 3,  // 入口文件做代码分割最多能分割成几个js文件
        automaticNameDelimiter: '.',  // 文件名的连接符
        name: true,  // cacheGroups里面配置的filename有效
        cacheGroups: {
          umi: {
            name: 'umi',
            test({ resource }) {
              return /[\\/]node_modules[\\/](umi|umijs)[\\/]/.test(resource);
            },
            priority: 10,
          },
          antd: {
            name: 'antd',
            test({ resource }) {
              return /[\\/]node_modules[\\/](antd|@antd|@antd-desgin)[\\/]/.test(resource);
            },
            priority: 9,
          },
          tools: {
            name: 'tools',
            test({ resource }) {
              return /[\\/]node_modules[\\/](moment|lodash)[\\/]/.test(resource);
            },
            priority: 8,
          },
          utils: {
            name: 'utils',
            test({ resource }) {
              return /utils\//.test(resource);
            },
            priority: 6,
          },
          vendor: {
            name: 'vendors',
            test({ resource }) {
              return /[\\/]node_modules[\\/]/.test(resource);
            },
            priority: -1,
          },
        },
      },
    }
  });

  // config.plugin('dayjs').use(AntdDayjsWebpackPlugin);  // dayjs 替换 moment

  config.plugin('CompressionPlugin').use(
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
      // 只处理大于xx字节 的文件
      threshold: 1024 * 100,  // 100kb
      // 示例：一个1024b大小的文件，压缩后大小为768b，minRatio : 0.75
      minRatio: .8, // 默认: 0.8
      // 是否删除源文件
      deleteOriginalAssets: false,
      exclude: []
    }),
  );

  return config;
}