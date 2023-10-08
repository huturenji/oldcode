/*
 * @Descripttion: 打包非开发环境，依赖webpack.base.conf.js
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-05 16:13:46
 */
'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('./config')
const {merge} = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin')
const rm = require('rimraf')
const fs = require('fs')

let mkdir = config.build.tarDirectory;//tar包目录
let dirname = path.resolve(__dirname, '../');//当前目录上一级

//根据发布规则，生成tar包名称
let destination = gentarpath();
console.log('destination is ' + destination)

//copy 代码
let copydir = []
fs.existsSync(path.resolve(__dirname, '../static')) && copydir.push({
    from: path.resolve(__dirname, '../static'),
    to: config.build.assetsSubDirectory,
    ignore: ['**/.*/**/*'] //忽略所有以点开头的文件以及文件夹
    // globOptions:{
    //     ignore: ['**/.*/**/*'] //忽略所有以点开头的文件以及文件夹
    // }
    
})
//将第三方插件copy到代码中
fs.existsSync(path.resolve(__dirname, '../src/thirdparty')) && copydir.push({
    from: path.resolve(__dirname, '../src/thirdparty'),
    to: path.join(config.build.assetsRoot,'thirdparty')
})

//暂时屏蔽，待项目中图片资源按照assets放置链接引入后再放开
// fs.existsSync(path.resolve(__dirname, '../src/assets'))&&copydir.push({
//     from: path.resolve(__dirname, '../src/assets'),
//     to: path.join(config.build.assetsRoot,'assets')
// })

//multi-entry入口
let entry = baseWebpackConfig.entry;
fs.existsSync(path.resolve(__dirname, '../src/compress')) && (glob.sync('../src/compress/*.js') || []).forEach(file => {
    let _file = path.parse(file);
    entry[_file.name] = path.resolve(_file)
});

//webpackConfig
const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',//自动压缩代码
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    entry: entry,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        //定义变量
        new webpack.DefinePlugin({
            'process.env': require('./config/prod.env')
        }),

        //打包css
        new MiniCssExtractPlugin({
            chunkFilename: utils.assetsPath('css/[id].[contenthash].css'),
            filename: (chunkData)=>{
                if(-1<chunkData.chunk.name.indexOf('theme')){//如果入口是样式主题css，则不添加hash值
                    return utils.assetsPath('css/[name].css')
                }else{
                    return utils.assetsPath('css/[name].[contenthash].css')
                }   
            },
            ignoreOrder: true//去除order警告
        }),

        // copy custom static assets
        new CopyWebpackPlugin(copydir),

        new FileManagerPlugin({
            events:{
                onEnd: {
                    mkdir: ['./' + mkdir], //压缩后的文件路径
                    archive: [{ ////需要压缩的资源
                        source: './dist',
                        destination: destination,
                        format: 'tar'
                    }]
                }
            } 
        })
    ]
})
//删除tar文件
rm(mkdir, function (err) {
    console.log(err)
});

//分析报告
if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

//gzip压缩
if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
            algorithm: 'gzip', //算法
            test: new RegExp( //压缩 js 与 css
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240, //只处理比这个值大的资源。按字节计算
            minRatio: 0.8 //只有压缩率比这个值小的资源才会被处理
        })
    )
};

/**
 * 根据发布规则生成tar包发布的名称
 */
function gentarpath(){
    const moment = require('moment');
    //打包名称，默认为当前打包环境的目录名称
    let appName = process.env.BP_APPNAME || dirname.substring(dirname.lastIndexOf(path.sep) + 1, dirname.length);//只在windows下才有效果,修改分割符为path.sep
    let time = moment(new Date().getTime()).format("YYYYMMDD");
    let env = process.argv[3] || 'uat';//环境，默认为1.0.0
    let version = process.argv[2] || '1.0.0';//版本默认为uat
    let destination = path.join(__dirname,'..',mkdir,`${appName}-${version}-static-${env}+${time}.tar`)
    return destination;
}
module.exports = webpackConfig;