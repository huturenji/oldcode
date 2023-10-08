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
            'components': resolve('src/components'),
            'hotelComponent':resolve('src/modules/hotel/common'),
            'hotelHandler': resolve('src/modules/hotel/views'),
            'styles': resolve('src/platform/styles'),
            'platform': resolve('src/platform'),
            'themesDefault': resolve('src/assets/img/themes/default')
        }
    }
})

utils.buildWebpack(wconf,config)