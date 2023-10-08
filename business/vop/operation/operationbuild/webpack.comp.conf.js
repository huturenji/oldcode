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
            'modules': resolve('src/modules'),		  
            'vuexStore': resolve('src/vuex'),
            'thirdparty': resolve('src/thirdparty'),
            'libs': resolve('src/common/libs'),
            'components': resolve('src/common/components'),
            'assets': resolve('src/themes/default/img'),
            'styles': resolve('src/themes/default/styles'),
            'bislibs': resolve('src/modules/common/libs'),
            'biscomponents': resolve('src/modules/common/components'),
            'route': resolve('src/route'),
            'common/lib': resolve('src/common/libs'),
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

// envConfig.envMap[arg].host + 
module.exports = Object.assign(compWebpackConfig,{
    entry: './src/modules/views/templateMaking/index.js',
    output: {
        path: path.resolve(__dirname, '../dist/swp-templateMake'),
        publicPath: './thirdparty/swp-templateMake/',
        filename: 'swp-templateMake.js',
        library:'swp-engine',//指定是required时的模块名
        libraryTarget:'umd',//指定输出格式
        umdNamedDefine:true //会对UMD的构建过程中AMD模块进行命令，否则就使用匿名的define
    },
});



