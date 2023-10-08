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
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require("terser-webpack-plugin");

//TODO 为了页面加载的效率，需要合并为一个js文件
let entryMap = {
    'index':{
        entry:'./src/index.js',
        filename:'swp-utils.js',
        library:'SnUtils'
    },
    'extend':{
        entry:'./src/tools/extend.js',
        filename:'swp-utils.js',
        library:'SnUtils'
    },
    'SnJsBridge':{
        entry:'./src/jsbridge/bridge-fun.js',
        filename:'swp-jsbridge.js',
        library:'SnJsBridge'
    },
    'pop':{
        entry:'./src/pop-state-manager.js',
        filename:'swp-popmgr.js',
        library:'SnPopStateMgr'
    }
}

let entyObj = entryMap[process.env.BP_ENTRY];

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

console.log(resolve('./src/jsbridge/index.js'))
module.exports = {
    optimization: {
        runtimeChunk: 'single',
        sideEffects: true,
        // usedExports: true,
        // minimizer: [
        //     new TerserPlugin({

        //     })
        // ],
        splitChunks:{
            // chunks: 'all',
            name:true,
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            cacheGroups:{
                vendors:{
                    test:/[\\/]node_modules[\\/]/,
                    name:'vendors',
                    filename:'vendors.js',
                    minSize:30000,
                    minChunks:1,
                    chunks:'initial',
                    priority:1
                },
                // bridge:{
                //     test:/[\\/]src[\\/]jsbridge[\\/]/,
                //     name:'bridge',
                //     filename:'[name].chunk.js',
                //     // minSize:30000,
                //     chunks:'initial',
                //     priority:-1,
                //     reuseExistingChunk: true
                // }
            }
        }
    },
    mode: 'production',
    entry:entyObj.entry,
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: entyObj.filename,
        library:entyObj.library,//指定是required时的模块名
        libraryTarget:'umd',//指定输出格式
        umdNamedDefine:true //会对UMD的构建过程中AMD模块进行命令，否则就使用匿名的define
    },
	externals:[{
	}],
    resolve: {
        extensions: ['*','.ts','.tsx', '.js', '.vue', '.css', '.scss', '.less', '.json'],

        alias: {
          'src': resolve('src'),
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
        }),
        //打包分析
        new BundleAnalyzerPlugin()
    ]
}
