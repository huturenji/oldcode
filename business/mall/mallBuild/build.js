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
            'componentx':resolve('src/components/SWP-Components/'),
            'components': resolve('src/components/BIS-Components'),
            'biscomponents': resolve('src/components/SWP-Components/bisComponents'),
            'mallStyles': resolve('src/mallStyles'),
            'commonComp': resolve('src/modules/mall/common/components'),
            'common': resolve('src/modules/mall/common'),
            'view': resolve('src/modules/mall/views/'),
            'skeleton': resolve('src/modules/mall/skeleton'),

        }
    }
})

utils.buildWebpack(wconf,config)