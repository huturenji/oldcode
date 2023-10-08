/*
 * @Descripttion: 打包开发环境，依赖webpack.base.conf.js
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-30 10:54:15
 */
'use strict'
const utils = require('./utils')
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const config = require('./config')
const {merge} = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const portfinder = require('portfinder')
const fs = require('fs')

/**
 * ① 设置环境为开发development，供整个编译打包时使用该变量，该设置仅在项目运行命令直接运行webapack.dev.conf.js文件时生效；例如：cross-env BP_ENV=Dev BP_PREHTML=modules webpack-dev-server  --inline --progress --config webpack.dev.conf.js
 *  如果webapack.dev.conf.js文件外，则需要在对应的最外层运行文件中添加对应的变量声明，现有项目结构中，一般是在对应项目的webpack.dev.conf.js中声明，
 *  例如，运行的命令为：cross-env BP_ENV=Dev BP_PREHTML=modules webpack-dev-server  --inline --progress --config hotelBuild/webpack.dev.conf.js，则需要在hotelBuild下的webpack.dev.conf.js文件中声明
 *  或者直接在运行命令中新增 NODE_ENV=development
 * ② process.env.NODE_ENV = 'development'设置方法与webpack.DefinePlugin不同，webpack.DefinePlugin插件是编译时定义了全局的变量，在运行业务代码时直接使用该变量；
 *  webpack4设置mode之后，process.env.NODE_ENV的值根据mode设置的值变化，例如设置了mode:development，则在运行的js中获取到的process.env.NODE_ENV 值为development
 */
process.env.NODE_ENV = 'development';

//copy 代码
let copydir = []
fs.existsSync(path.resolve(__dirname, '../src/thirdparty')) && copydir.push({
    from: path.resolve(__dirname, '../src/thirdparty'),
    to: path.join(config.build.assetsRoot,'thirdparty'),
})
fs.existsSync(path.resolve(__dirname, '../src/assets/img')) && copydir.push({
    from: path.resolve(__dirname, '../src/assets/img'),
    to: path.join(config.build.assetsRoot,'assets/img')
})

//获取src/modules下的第一个html，如果不存在，则读取config中的配置
var indexHtml = path.parse(glob.sync(config.src + '/**/*.' + config.ext)[0]).base || config.dev.index
//拼接项目的入口html 通过open参数确认是否自动打开
var openPage = process.env.BP_PREHTML?`${process.env.BP_PREHTML}/${indexHtml}`:`${indexHtml}`;

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    // cheap-module-eval-source-map is faster for development
    devtool: 'cheap-module-eval-source-map',

    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'error',//客服端日志级别 none | error | warning | info。 默认为info级别，即输出所有类型的日志，设置成none可以不输出任何日志
        historyApiFallback: true,
        hot: true,
        compress: false,//是否压缩
        host: process.env.HOST || config.dev.host,
        port: process.env.PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,//自动打开浏览器
        openPage:openPage,
        overlay:  config.dev.errorOverlay ? {//配置属性用来在编译出错的时候，在浏览器页面上显示错误，默认是false，可设置为true
            warnings: false,
            errors: true,
        } : false,
        publicPath: config.dev.assetsPublicPath, //此路径下的打包文件可在浏览器中访问
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin 当它被设置为true的时候，控制台只输出第一次编译的信息，当你保存后再次编译的时候不会输出任何内容，包括错误和警告
        watchOptions: {
            poll: config.dev.poll,
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('./config/dev.env')
        }),
        new BundleAnalyzerPlugin(),
        new CopyWebpackPlugin(copydir),
    ]
});

module.exports = () => {
    return new Promise((resolve, reject) => {
        portfinder.basePort = process.env.PORT || config.dev.port
        portfinder.getPort((err, port) => {
            if (err) {
                reject(err)
            } else {
                // publish the new Port, necessary for e2e tests
                process.env.PORT = port
                // add port to devServer config
                devWebpackConfig.devServer.port = port

                var url = `${config.dev.https ? 'https' : 'http'}://${config.dev.host}:${port}/${openPage}`;
                console.log(`url is ${url}`)
                // Add FriendlyErrorsPlugin
                devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                    compilationSuccessInfo: { //todo webpack4没有显示 是因为severity is warning
                        messages: [`Your application is running here:  ${url}`],
                    },
                    onErrors: config.dev.notifyOnErrors ?
                        utils.createNotifierCallback() : undefined
                }))
                resolve(devWebpackConfig)
            }
        })
    })
}