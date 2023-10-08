'use strict'
require('../build/check-versions')()
process.env.NODE_ENV = 'production'
const path = require('path')
const webpackConfig = require('../build/webpack.prod.conf');
const {merge} = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('../build/config')
const utils = require('../build/utils')
const custUtils = require('./utils');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

//copy 代码 中转页拷贝到指定目录
webpackConfig.plugins.push(new CopyWebpackPlugin([{
    from: path.resolve(__dirname, '../src/modules/pages'),
    to: path.join(config.build.assetsRoot,'pages'),
}]));


let wconf = merge(custUtils.themeHandler(webpackConfig),{
    resolve:{
        alias:{
            'modules': resolve('src/modules'),		  
            'vuexStore': resolve('src/vuex'),
            'thirdparty': resolve('src/thirdparty'),
            'libs': resolve('src/common/libs'),
            'components': resolve('src/common/components'),
            'assets': resolve('src/themes/default/img'),
            'styles': resolve('src/themes/default/styles'),
            'bislibs': resolve('src/modules/common/libs'),
            'biscomponents': resolve('src/modules/common/components'),
            'route': resolve('src/route'),
            'common/lib': resolve('src/common/libs'),

        }
    }
})

utils.buildWebpack(wconf,config)