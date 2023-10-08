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

webpackConfig.plugins.push(
    // new CopyWebpackPlugin([{
    //     from: path.resolve(__dirname, '../src/assets'),
    //     to: path.join(config.build.assetsRoot,'assets')
    // }])
);

let wconf = merge(custUtils.themeHandler(webpackConfig),{
    resolve:{
        alias:{
            'commonStyles': resolve('src/commonStyles'),
            'commonComp': resolve('src/modules/common/components'),
            'common': resolve('src/modules/common'),
            'views': resolve('src/modules/views'),
            'skeleton': resolve('src/modules/skeleton'),
            'thirdparty': resolve('src/thirdparty'),
            'store': resolve('src/modules/common/states/store')
        }
    }
})

utils.buildWebpack(wconf,config)