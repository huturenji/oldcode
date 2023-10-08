'use strict'
const utils = require('../build/utils')
const path = require('path')
const {merge} = require('webpack-merge')
const prodWebpackConfig = require('../build/webpack.prod.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NODE_ENV = process.env.NODE_ENV
var arg = process.env.BP_ENV || 'Dev';
const custUtils = require('./utils');
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const compWebpackConfig = merge(custUtils.themeHandler(prodWebpackConfig), {
    resolve:{
        alias:{
            'components': resolve('src/components'),
            'themes': resolve('src/themes'),
            'styles': resolve('src/platform/styles'),
            'platform': resolve('src/platform'),
        }
    },
    plugins: [
        // extract css into its own file
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            ignoreOrder: true//去除order警告
        }),
    ]
});

module.exports = Object.assign(compWebpackConfig,{
    entry: NODE_ENV == 'development'?'./src/modules/payComp/src/demo/main.js':'./src/modules/passenger/views/Passenger/index.js',
    output: {
        path: path.resolve(__dirname, '../dist/passenger'),
        publicPath: '../swplib/bp/passenger/',
        filename: 'swp-psg.js',
        library:'swp-psg',//指定是required时的模块名
        libraryTarget:'umd',//指定输出格式
        umdNamedDefine:true //会对UMD的构建过程中AMD模块进行命令，否则就使用匿名的define
    },
});


