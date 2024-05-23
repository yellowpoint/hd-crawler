import { resolve } from 'path';

import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';

export default defineConfig(({ mode, command }) => {
  const isBuild = command === 'build'; // 是否是打包环境的判断
  const plugins = [react()];
  // https://cn.vitejs.dev/guide/build.html
  // isBuild && plugins.push(legacy()); //  是打包环境，就把legacy()加入到plugins中
  return {
    esbuild: {
      drop: isBuild ? ['console', 'debugger'] : [], // 删除 所有的console 和 debugger
    },
    build: {
      sourcemap: false,
    },
    base: '/',
    plugins,
    define: {
      'process.env.VITE_TWITTER_V2_CLIENT_ID': JSON.stringify(
        process.env.VITE_TWITTER_V2_CLIENT_ID,
      ),
      'process.env.VITE_TWITTER_V2_CLIENT_SECRET': JSON.stringify(
        process.env.VITE_TWITTER_V2_CLIENT_SECRET,
      ),
    },
    css: {
      modules: {
        generateScopedName: '[name]_[local]_[hash:5]',
      },
      postcss: {
        plugins: [
          tailwindcss(),
          // postCssPxToRem({
          //   // 自适应，px>rem转换
          //   rootValue: 144,
          //   exclude: /node_modules/i, // 过滤掉node_modules 文件夹下面的样式
          //   propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
          //   selectorBlackList: ['.norem'], // 过滤掉norem-开头的class，不进行rem转换，这个内容可以不写
          //   minPixelValue: 2, // 设置要替换的最小像素值。
          // }),
        ],
      },
      preprocessorOptions: {
        less: {
          // 整个的配置对象都会最终给到less的执行参数（全局参数）中去
          javascriptEnabled: true,
          // 每个less文件都注入
          additionalData: '@import "@/assets/var.less";',
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },

    server: {
      host: '0.0.0.0',
      port: 7777,
      // https: true,
      proxy: {
        // '/api/twitter': {
        //   target: 'https://api.twitter.com',
        //   changeOrigin: true, // 允许跨域
        //   ws: true, // 允许websocket代理
        //   // 重写路径 --> 作用与vue配置pathRewrite作用相同
        //   rewrite: (path) => path.replace(/^\/api\/twitter/, ''),
        // },
        '/api/aa': {
          target: 'https://free-terms-behave.loca.lt',
          changeOrigin: true, // 允许跨域
          ws: true, // 允许websocket代理
          // 重写路径 --> 作用与vue配置pathRewrite作用相同
          rewrite: (path) => path.replace(/^\/api\/aa/, '/api'),
        },
        '/api': {
          // 配置需要代理的路径 --> 这里的意思是代理http://localhost:80/api/后的所有路由
          target: 'http://120.46.191.217:8007',
          // target: 'http://www.mama100.com',
          changeOrigin: true, // 允许跨域
          ws: true, // 允许websocket代理
          // 重写路径 --> 作用与vue配置pathRewrite作用相同
          // rewrite: (path) => path.replace(/^\/api/, '/member-nft-api/api/'),
        },
      },
    },
  };
});
