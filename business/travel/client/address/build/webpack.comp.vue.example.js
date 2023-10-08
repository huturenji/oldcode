/*
 * @Descripttion: 将vue文件打包为js文件，通过vue标签引入使用
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: yg
 * @LastEditTime: 2020-10-13 16:32:42
 */
'use strict'
const path = require('path')
const merge = require('webpack-merge')
const prodWebpackConfig = require('./webpack.prod.conf')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const compWebpackConfig = merge(prodWebpackConfig, {
    resolve:{
        alias:{
            'modules': resolve('src/modules'),
        }
    }
});
module.exports = Object.assign(compWebpackConfig,{
    entry:'./webpack.comp.vue.example.index.js',
    output: {
        path: path.resolve(__dirname, '../dist/swp-example'),
        publicPath: '../../swplib/bp/example/1.0.0/',
        filename: 'swp-example.js',
        library:'swp-example',//指定是required时的模块名
        libraryTarget:'umd',//指定输出格式
        umdNamedDefine:true //会对UMD的构建过程中AMD模块进行命令，否则就使用匿名的define
    },
});


