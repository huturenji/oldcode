const TransformPages = require('uni-read-pages')
const { webpack } = new TransformPages()


let webpackConfig = {
    transpileDependencies: ['uni-simple-router', 'uview-ui'],
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