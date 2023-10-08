'use strict'
const envConfig = require('../build/config/sets.env');
const prodWebpackConfig = require('../build/webpack.prod.conf')
const {merge} = require('webpack-merge')
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const compWebpackConfig = merge(prodWebpackConfig, {
    resolve:{
        alias:{
            'functional': resolve('../functional')
        }
    }
});

var version = process.env.version|| envConfig.appUrlMap.swplib.child.serviceReminders.version
if (version=='head'){
    version = '';
} else {
    version += '/'
}

module.exports = Object.assign(compWebpackConfig,{
    entry: './src/modules/index.js',
    output: {
        path: path.resolve(__dirname, `../dist/swp-serviceReminders/${version}`),
        publicPath: '../../swplib/bp/serviceReminders/',
        filename: 'swp-serviceReminders.js',
        library:'swpServiceReminders',//指定是required时的模块名
        libraryTarget:'umd',//指定输出格式
        umdNamedDefine:true //会对UMD的构建过程中AMD模块进行命令，否则就使用匿名的define
    }
});


