const TransformPages = require('uni-read-pages')
const {webpack} = new TransformPages()
const CompressionWebpackPlugin = require('compression-webpack-plugin')

let webpackConfig = {
    transpileDependencies: ['uni-simple-router', 'uview-ui'],
    configureWebpack: {
        optimization: {
            splitChunks: {
                /**
                 * 使用all打包的模块，在微信小程序编译时会报错call undefined，原因为没有找到对应的module
                 * 配置为all后同步与异步模块均打包，导致微信小程序找不到对应的module
                 */
                chunks: 'all',
                minSize: 20000,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                enforceSizeThreshold: 50000,
                cacheGroups: {
                    default: {
                        test:/[\\/]src[\\/]/,
                        chunks:'async',
                        minChunks: 2,
                        reuseExistingChunk: true
                    },
                    'async-vendors':{
                        test:/[\\/]node_modules[\\/]/,
                        minChunks:2,
                        chunks:'async',
                        name:'async-vendros'
                    }
                } 
            }
        },
        externals:{
        },
        plugins: [
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

module.exports = webpackConfig;