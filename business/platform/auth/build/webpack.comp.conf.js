/*
 * @Descripttion: 打包多个js文件为一个js文件，提供全局函数
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-12-23 10:14:07
 */
'use strict'
const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const CompressionWebpackPlugin = require('compression-webpack-plugin')


function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var product = process.env.product || 'sino'
module.exports = {
    mode: 'production',
    entry: `./src/index.js`,
    output: {
        path: path.resolve(__dirname, `../dist/swp-serviceAuth`),
        filename: 'swp-serviceAuth.js',
        library:'swpServiceAuth',//指定是required时的模块名
        libraryTarget:'umd',//指定输出格式
        umdNamedDefine:true //会对UMD的构建过程中AMD模块进行命令，否则就使用匿名的define
    },
	externals:[{
	}],
    resolve: {
        extensions: ['*','.ts','.tsx', '.js', '.vue', '.css', '.scss', '.less', '.json'],

        alias: {
            'components': resolve('src/components'),
            'version': resolve('src/version'),
            'constant': resolve('src/constant'),
            'config': resolve('src/config'),
            'utils': resolve('src/utils')
        }
      },
	module: {
		rules: [
	       	{
		        test: /\.js$/,
		        loader: 'happypack/loader?id=happy-babel-js',
		        include: [resolve('src'), resolve('test')]
            },
            { 
                test: /\.tsx?$/, 
                loader: "ts-loader" ,
                exclude: /node_modules/
            }
	    ]
	},
	plugins:[
        new webpack.DefinePlugin({
            'process.env': {
                product: '"'+process.env.product+'"',
                module: '"'+process.env.module+'"',
            }
        }),
		new HappyPack({
	      id: 'happy-babel-js',
	      loaders: ['babel-loader?cacheDirectory=true'],
	      threadPool: happyThreadPool,
	    }),
        //gzip压缩
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',//目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
            algorithm: 'gzip',//算法
            test: new RegExp(//压缩 js 与 css
              '\\.(' +
              ['js', 'css'].join('|') +
              ')$'
            ),
            threshold: 10240,//只处理比这个值大的资源。按字节计算
            minRatio: 0.8//只有压缩率比这个值小的资源才会被处理
        })
    ]
}

