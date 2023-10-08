const TransformPages = require('uni-read-pages')
const {webpack} = new TransformPages()
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin') //最新版本copy-webpack-plugin插件暂不兼容，推荐v5.0.0
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    transpileDependencies: ['uni-simple-router', 'uview-ui'],
    configureWebpack: {
        optimization: {
            splitChunks: {
                chunks: 'all',
                minSize: 20000,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                enforceSizeThreshold: 50000,
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        priority: -10,
                        reuseExistingChunk: true
                    },
                    'async-vendors':{
                        test:/[\\/]node_modules[\\/]/,
                        minChunks:2,
                        chunks:'async',
                        name:'async-vendros'
                    },
                    'uview-ui':{
                        test:/[\\/]node_modules[\\/]uview-ui[\\/]/,
                        minChunks:1,
                        chunks:'uview-ui',
                        name:'uview-ui'
                    },
                    'dcloudio':{
                        test:/[\\/]node_modules[\\/]@dcloudio[\\/]/,
                        minChunks:1,
                        chunks:'dcloudio',
                        name:'dcloudio'
                    },
                    'uni-simple-router':{
                        test:/[\\/]node_modules[\\/]uni-simple-router[\\/]/,
                        minChunks:1,
                        chunks:'uni-simple-router',
                        name:'uni-simple-router'
                    }
                } 
            }
        },
        externals:{
            'vue':'Vue',
            'vue-router':'VueRouter',
            // 'uview-ui':'uView',
            'vuex':'Vuex'
        },
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                analyzerHost: "127.0.0.1",
                analyzerPort: 8882, //注意是否有端口冲突
                reportFilename: 'report.html',
                defaultSizes: "parsed",
                openAnalyzer: true,
                generateStatsFile: false,
                statsFilename: "stats.json",
                statsOptions: null,
                logLevel: "info"

            }),
            new webpack.DefinePlugin({
                ROUTES: webpack.DefinePlugin.runtimeValue(() => {
                    const tfPages = new TransformPages({
                        includes: ['path', 'name', 'meta', 'aliasPath']
                    });
                    return JSON.stringify(tfPages.routes);
                }, true ),
                TAB_BARS: webpack.DefinePlugin.runtimeValue(() => {
                    const tfPages = new TransformPages({
                        includes: ['path', 'name', 'meta', 'aliasPath']
                    });
                    return tfPages.pagesJson.tabBar && tfPages.pagesJson.tabBar.list ? JSON.stringify(tfPages.pagesJson.tabBar.list) : null;
                }, true ),
                HOME_PAGE: webpack.DefinePlugin.runtimeValue(() => {
                    const tfPages = new TransformPages({
                        includes: ['path', 'name', 'meta', 'aliasPath']
                    });
                    return tfPages.routes[0] ? JSON.stringify(tfPages.routes[0].aliasPath) : '';
                }, true ),
                TIMESTAMP_ENV:'"'+new Date().getTime()+'"'
            }),
            new CopyWebpackPlugin([
                {
                    from: path.join(__dirname, 'src/thirdparty'),
                    to: path.join(__dirname, 'dist/mobile', 'thirdparty')
                }
            ]),
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
                algorithm: 'gzip', //算法
                test: new RegExp( //压缩 js 与 css
                    '\\.(' +
                  ['js', 'css'].join('|') +
                 ')$'
                ),
                threshold: 10240, //只处理比这个值大的资源。按字节计算
                minRatio: 0.8, //只有压缩率比这个值小的资源才会被处理
                exclude: /node_modules/
            })

        ],
        devServer: {
            port: 8090,//代理端口
            open: true,//项目启动时是否自动打开浏览器： false表示不打开，true表示打开
            /********************
			*	40080: http://m.tixin4u.com:40080 
			*	开发环境：https://bplusdev.sinosun.com:18180/
			*	sit环境：https://bplussit.sinosun.com:18380/ 
			*	uat环境：https://bplus-uat.sinosun.com/ 
			*********************/
            proxy: {
                '/': { //本地开发代理
                    target: "https://bplussit.sinosun.com:18380/", // 代理接口 
                    changeOrigin: true,//是否跨域
                    ws: true // proxy websockets
                }
                // '/auth': { //代理token接口（浏览器端访问）
                // 	target: "https://bplussit.sinosun.com:18680/", // 代理接口 
                // 	changeOrigin: true,//是否跨域
                // 	ws: true, // proxy websockets
                // 	secure: false,
                // }
            }
        }
    }
}