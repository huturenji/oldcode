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

let wconf = merge(webpackConfig,{
    resolve:{
        alias:{
            'componentx':resolve('src/components/SWP-Components/'),
            'components': resolve('src/components/BIS-Components'),
            'biscomponents': resolve('src/components/SWP-Components/bisComponents'),
            'businesscloudStyles': resolve('src/businesscloudStyles'),
            'commonComp': resolve('src/modules/businesscloud/common/components'),
            'common': resolve('src/modules/businesscloud/common'),
            'view': resolve('src/modules/businesscloud/views/'),
            'skeleton': resolve('src/modules/businesscloud/skeleton'),
            'thirdparty': resolve('src/thirdparty'),
        }
    }
})

utils.buildWebpack(wconf,config)