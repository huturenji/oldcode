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
            'flightComp': resolve('src/modules/orderManagement/orderDetail/views/flight/flightComp'),
            'trainComp': resolve('src/modules/orderManagement/orderDetail/views/train/trainComp'),
            'hotelComp': resolve('src/modules/orderManagement/orderDetail/views/hotel/hotelComp'),
            'orderCommon': resolve('src/modules/orderManagement/common'),
            'orderComp': resolve('src/modules/orderManagement/common/components'),
            'psgCard': resolve('src/modules/orderManagement/psgCard'),
            'routeDir': resolve('src/route'),
            'components':resolve('src/components'),
            'styles': resolve('src/platform/styles'),
        }
    }
})

utils.buildWebpack(wconf,config)