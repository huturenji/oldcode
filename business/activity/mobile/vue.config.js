
const TransformPages = require('uni-read-pages')
const { webpack } = new TransformPages()
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin') //最新版本copy-webpack-plugin插件暂不兼容，推荐v5.0.0
const CompressionWebpackPlugin = require('compression-webpack-plugin')

function isH5() {
    return process.env.UNI_PLATFORM.toLowerCase() == 'h5';
}

let webpackConfig = {
    transpileDependencies: ['uni-simple-router'],
    configureWebpack: {
        externals:{
        },
        plugins: [
            new webpack.DefinePlugin({
                TIMESTAMP_ENV: '"'+new Date().getTime()+'"',
                ROUTES: webpack.DefinePlugin.runtimeValue(() => {
                    const tfPages = new TransformPages({
                        includes: ['path', 'name', 'meta', 'aliasPath']
                    });
                    return JSON.stringify(tfPages.routes);
                }, true )
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
            port: 8088,//代理端口
            open: true,//项目启动时是否自动打开浏览器： false表示不打开，true表示打开
            /********************
			*	开发环境：https://bplusdev.sinosun.com:18180/
			*	sit环境：https://bplussit.sinosun.com:18380/ 
			*	uat环境：https://bplus-uat.sinosun.com/ 
			*********************/
            proxy: {
                '/': { //本地开发代理
                    target: "https://bplusdev.sinosun.com:18180/", // 代理接口 
                    changeOrigin: true,//是否跨域
                    ws: true // proxy websockets
                }
            }
        }
    }
}

module.exports = webpackConfig;