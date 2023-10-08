'use strict'
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
})
const path = require('path')
const fs = require('fs')
const utils = require('./utils')
const config = require('./config')
const vueLoaderConfig = require('./vue-loader.conf')
const vuxLoader = require('vux-loader')

//打包入口
const entry = require('./multi-entry')

//打包multihtml
const multihtml = require('./multi-html')

//样式主题定制
let themeOptions = {}
fs.existsSync('.sntheme.js') && (themeOptions = require('../.sntheme'))

//是否prod环境
const isProduction = process.env.NODE_ENV === 'production'
//是否开启sourceMap
const sourceMapEnabled = isProduction ?
    config.build.productionSourceMap : config.dev.cssSourceMap

//publicpath路径
const publicPath = isProduction ?
    config.build.assetsPublicPath : config.dev.assetsPublicPath

/**
 * 拼接路径
 * @param {路径} dir 
 */
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

//打包配置
let webpackConfig = {
    optimization: {
        splitChunks: {
            cacheGroups: {
            }
        }
    },
    context: path.resolve(__dirname, '../'),
    entry: entry(),
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        chunkFilename: 'static/js/chunk[id].js?[chunkhash]',
        publicPath: publicPath
    },
    externals: [{
        'vue': 'Vue',
        "echarts": "echarts",
        'jQuery': 'jQuery'
    }],
    resolve: {
        extensions: ['*', '.js', '.vue', '.css', '.scss', '.less', '.json'],
        modules: [
            resolve('src'),
            resolve('node_modules')
        ],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'assets': resolve('src/assets'),
            'lib': resolve('src/lib'),
            'styles': resolve('src/platform/styles'),
            'themes': resolve('src/themes'),
            'sprite': resolve('src/sprite')
        }
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
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
                            name: utils.assetsPath('media/[name].[hash:7].[ext]')
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            esModule: false,
                            name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
                            publicPath: config.build.extract ? '../../' : publicPath
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
                            name: utils.assetsPath('img/[name].[hash:7].[ext]')
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
                            name: utils.assetsPath('img/[name].[hash:7].[ext]')
                        },
                    }
                ],
                exclude: [resolve('node_modules/sinosun-ui'), resolve('src/sprite/svg')],
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
                include: [resolve('node_modules/sinosun-ui'), resolve('src/sprite/svg')],
            },
        ].concat( //合并除了vue文件之外的样式文件loader
            utils.styleLoaders({
                sourceMap: sourceMapEnabled,
                usePostCSS: isProduction ? config.build.usePostCSS : config.dev.usePostCSS,
                extract: isProduction ? config.build.extract : config.dev.extract,
                themeOptions: themeOptions
            })
        )
    },
    plugins: [
        new HappyPack({
            id: 'happy-babel-js',
            loaders: ['babel-loader?cacheDirectory=true'],
            threadPool: happyThreadPool,
        })
    ]
}

webpackConfig.plugins = (webpackConfig.plugins || []).concat(multihtml());
module.exports = vuxLoader.merge(webpackConfig, {
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