'use strict'
require('../build/check-versions')()
process.env.NODE_ENV = 'production'
const path = require('path')
const webpackConfig = require('../build/webpack.prod.conf');
const { merge } = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('../build/config')
const utils = require('../build/utils')
const custUtils = require('./utils');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

// webpackConfig.plugins.push(
//     new CopyWebpackPlugin([{
//         from: path.resolve(__dirname, '../src/assets'),
//         to: path.join(config.build.assetsRoot, 'assets')
//     }])
// );

let wconf = merge(custUtils.themeHandler(webpackConfig), {
    resolve: {
        alias: {
            'modules': resolve('src/modules'),
            'vuexStore': resolve('src/vuex'),
            'thirdparty': resolve('src/thirdparty'),
            'components': resolve('src/modules/components'),
            'common': resolve('src/modules/common'),
            'assets': resolve('src/themes/default/img'),
            'styles': resolve('src/themes/default/styles/common'),
            'route': resolve('src/route'),
            'utils': resolve('src/modules/utils'),
        }
    }
})

utils.buildWebpack(wconf, config)