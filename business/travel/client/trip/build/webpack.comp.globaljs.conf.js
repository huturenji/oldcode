/*
 * @Descripttion: 打包多个js文件为一个js文件，提供全局函数
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: yg
 * @LastEditTime: 2020-10-09 10:21:50
 */
'use strict'
const path = require('path')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const CompressionWebpackPlugin = require('compression-webpack-plugin')

//TODO 为了页面加载的效率，需要合并为一个js文件
let entryMap = {
    'index':{
        entry:'./src/lib/index.js',
        filename:'swp-utils.js',
        library:'SnUtils'
    },
    'extend':{
        entry:'./src/lib/extend.js',
        filename:'swp-utils.js',
        library:'SnUtils'
    },
    'SnJsBridge':{
        entry:'./src/lib/bridge-fun.js',
        filename:'swp-jsbridge.js',
        library:'SnJsBridge'
    },
    'pop':{
        entry:'./src/lib/pop-state-manager.js',
        filename:'swp-popmgr.js',
        library:'SnPopStateMgr'
    }
}

let entyObj = entryMap[process.env.BP_ENTRY];

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}


module.exports = {
    entry:entyObj.entry,
    output: {
        path: path.resolve(__dirname, '../dist/swp-http'),
        publicPath: '/dist/',
        filename: entyObj.filename,
        library:entyObj.library,//指定是required时的模块名
        libraryTarget:'umd',//指定输出格式
        umdNamedDefine:true //会对UMD的构建过程中AMD模块进行命令，否则就使用匿名的define
    },
	externals:[{
		'vue':'Vue',
		"echarts": "echarts"
	}],
    resolve: {
        extensions: ['*', '.js', '.vue', '.css', '.scss', '.less', '.json'],

        alias: {
          'lib': resolve('src/lib'),
          'base64':resolve('src/lib/common/base64'),
          'http':resolve('src/lib/common/http'),
        }
      },
	module: {
		rules: [
	       	{
		        test: /\.js$/,
		        loader: 'happypack/loader?id=happy-babel-js',
		        include: [resolve('src'), resolve('test')]
		    }
	    ]
	},
	plugins:[
		new HappyPack({
	      id: 'happy-babel-js',
	      loaders: ['babel-loader?cacheDirectory=true'],
	      threadPool: happyThreadPool,
	    }),

		// 增加 webpack-parallel-uglify-plugin来替换UglifyJsPlugin压缩js
	    new ParallelUglifyPlugin({
	      cacheDir: '.cache/',
	      uglifyJS:{
	        output: {
	            comments: false
            },
            warnings: false
            //新版本中compress - warnings 不支持
	        // compress: {
            //     warnings: false
	        // }
	      }
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
