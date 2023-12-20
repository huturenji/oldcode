/*
 * @Descripttion: 配置主入口文件
 * @version: 
 * @Author: yg
 * @Date: 2019-05-31 08:38:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-29 08:28:30
 */
'use strict'
// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
    ext: 'html',
    src: path.resolve(__dirname, '../../src/modules/'), // source code path
    dev: {
        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {//开发url代理
            '/': {
                // target: 'https://bplussit.sinosun.com:18380/',  //目标接口域名,默认配置为开发
                target: 'https://bplusdev.sinosun.com:18180/',  //目标接口域名,默认配置为开发
                changeOrigin: true,  //是否跨域
                pathRewrite: {
                    '^/api': ''   //重写接口
                }
            },
        },

        // Various Dev Server settings
        host: '0.0.0.0', // can be overwritten by process.env.HOST
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,//自动打开浏览器
        index: 'index.html', //运行的主页路径
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        // Use Eslint Loader?
        // If true, your code will be linted during bundling and
        // linting errors and warnings will be shown in the console.
        useEslint: false,
        // If true, eslint errors and warnings will also be shown in the error overlay
        // in the browser.
        showEslintErrorsInOverlay: false,

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: false,

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,

        //使用postcss loader
        usePostCSS: true,

        //提前css
        extract: false
    },

    build: {
        // Template for index.html
        index: path.join(path.resolve(__dirname, '../../dist'), process.env.BP_APPNAME || '', 'index.html'),

        // Paths
        assetsRoot: path.join(path.resolve(__dirname, '../../dist'), process.env.BP_APPNAME || ''),
        assetsSubDirectory: 'static',
        assetsPublicPath: process.env.BP_PREHTML ? '../' : './',

        /**
         * Source Maps
         */

        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: false,

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: true,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report,

        //md5,是否生成tar包的md5
        md5: true,

        //生成tar包的路径
        tarDirectory: 'tar',

        //使用postcss loader
        usePostCSS: true,

        //提前css
        extract: true,

        //合并css
        mergeCss: true,
    }
}
