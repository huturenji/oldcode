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
    new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../src/assets'),
        to: path.join(config.build.assetsRoot,'assets')
    }])
);

let wconf = merge(custUtils.themeHandler(webpackConfig),{
    resolve:{
        alias:{
            'platform': resolve('src/platform'),
            'components': resolve('src/components'),
            'flightComp': resolve('src/modules/views/orderDetail/flight/flightComp'),
            'trainComp': resolve('src/modules/views/orderDetail/train/trainComp'),
            'hotelComp': resolve('src/modules/views/orderDetail/hotel/hotelComp'),
            'orderCommon': resolve('src/modules/common'),
            'orderComp': resolve('src/modules/common/components'),
            'psgCard': resolve('src/modules/psgCard'),
            'styles': resolve('src/platform/styles'),
        }
    }
})

utils.buildWebpack(wconf,config)