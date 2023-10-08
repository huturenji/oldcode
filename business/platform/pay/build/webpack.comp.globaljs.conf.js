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
const vuxLoader = require('vux-loader')
const utils = require('./utils')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}


module.exports = vuxLoader.merge({
    mode: 'production',
    // mode: 'development',
    entry: './src/install.js',
    output: {
        path: path.resolve(__dirname, '../dist/sinopay'),
        filename: 'sinopay.js',
        library:'sinopay',//指定是required时的模块名
        libraryTarget:'umd',//指定输出格式
        umdNamedDefine:true //会对UMD的构建过程中AMD模块进行命令，否则就使用匿名的define
    },
	externals:[{
	}],
    resolve: {
        extensions: ['*','.ts','.tsx', '.js', '.vue', '.css', '.scss', '.less', '.json'],

        alias: {
            'assets': resolve('src/assets'),
            'components': resolve('src/components'),
            'style': resolve('src/style'),
            'utils': resolve('src/utils'),
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
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: utils.cssLoaders({
                        sourceMap: false,
                        extract: true,
                    }),
                    include: [path.join(__dirname, '..', 'src')],
                    exclude: /node_modules\/(?!(autotrack|dom-utils))/,
                    cssSourceMap: false,
                    cacheBusting: true,
                    transformToRequire: {
                        video: 'src',
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=happy-babel-js',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            esModule: false,
                            name: path.posix.join('static', 'media/[name].[hash:7].[ext]')
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            esModule: false,
                            name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            esModule: false,
                            name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
                        },
                    }
                ],
                exclude: [resolve('node_modules/sinosun-ui')],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            symbolId: '[name]'
                        },
                    }
                ],   
                include: [resolve('node_modules/sinosun-ui')],
            },
	    ].concat( //合并除了vue文件之外的样式文件loader
            utils.styleLoaders({
                sourceMap: true,
                usePostCSS: true,
                extract: true,
            })
        )
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
    ],
    optimization: {
        minimize: true,//启用js代码压缩&混淆
    },
}, {
    plugins: [
        'vux-ui',
        'progress-bar',
        {
            name: 'duplicate-style',
            options: {
                cssProcessorOptions: {
                    safe: true,
                    zindex: false,
                    autoprefixer: {
                        add: true,
                        browsers: [
                            'iOS >= 7',
                            'Android >= 4.1'
                        ]
                    }
                }
            }
        }
    ]
})
