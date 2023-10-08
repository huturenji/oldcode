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
            'trainHandler': resolve('src/modules/train/views'),
            'feature': resolve('src/modules/train/feature'),
            'trainComponents': resolve('src/modules/train/trainComponents'),
            'styles': resolve('src/platform/styles'),
            'platform': resolve('src/platform'),
            'themes': resolve('src/themes'),
            'svg': resolve('src/sprite/svg'), 

        }
    }
})

utils.buildWebpack(wconf,config)