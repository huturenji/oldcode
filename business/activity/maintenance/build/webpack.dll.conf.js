/*
 * @Descripttion: 打包dll，减少打包体积
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: yg
 * @LastEditTime: 2020-10-09 10:35:59
 */
const webpack = require('webpack')
const path = require('path')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})
const CompressionWebpackPlugin = require('compression-webpack-plugin')

// lib和vendor的版本号一致 默认为1.0.0
var libVersion = process.env.BP_LIBVERSION || '1.0.0';

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    mode: 'production',
    output: {
        path: path.join(__dirname, '..', '/static/js'),
        filename: '[name]/' + libVersion + '/[name].min.js',
        library: '[name]'
    },
    externals: [{
        'vue': 'Vue',
        "echarts": "echarts"
    }],
    entry: {
        'vendor': ['vuex','vue-router'],
        //lib已经打包为单独js，不需要使用dll方式引入
        'lib': [
            './src/lib/extend.js',
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.vue', '.css', '.scss', '.less', '.json'],
        alias: {
            'lib': resolve('src/lib'),
            'base64': resolve('src/lib/common/base64'),
            'http': resolve('src/lib/common/http'),
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'happypack/loader?id=happy-babel-js',
            include: [resolve('src'), resolve('test')]
        }]
    },
    plugins: [
        new HappyPack({
            id: 'happy-babel-js',
            loaders: ['babel-loader?cacheDirectory=true'],
            threadPool: happyThreadPool,
        }),
        new webpack.DllPlugin({
            name: '[name]',
            path: path.join(__dirname, '../build', '[name].manifest.json'),
            context: __dirname
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static/js/vendor/' + libVersion),
            to: path.resolve(__dirname, '../static/js/vendor')
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static/js/lib/' + libVersion),
            to: path.resolve(__dirname, '../static/js/lib')
        }]),
        //将打包好的lib和vendor copy到lib中 将lib与vendor放到swp-lib中
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static/js'),
            to: path.resolve(__dirname, '../', '../SWP-Lib/bp'),
        }]),
        //gzip压缩
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
            algorithm: 'gzip', //算法
            test: new RegExp( //压缩 js 与 css
                '\\.(' + ['js', 'css'].join('|') +
                ')$'
            ),
            threshold: 10240, //只处理比这个值大的资源。按字节计算
            minRatio: 0.8 //只有压缩率比这个值小的资源才会被处理
        })
    ]
}