'use strict'
process.env.NODE_ENV = 'development'
const path = require('path')
const {merge} = require('webpack-merge')
const devWebpackConfig = require('../build/webpack.dev.conf')
const custUtils = require('./utils');
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = ()=>{
    return devWebpackConfig().then((conf)=>{
        let webpackConfig =  merge(custUtils.themeHandler(conf),{
            resolve:{
                alias:{
                    'components': resolve('src/components'),
                    'expressCommon': resolve('src/modules/common'),
                    'styles': resolve('src/platform/styles'),
                    'platform': resolve('src/platform'),
                    'themesDefault': resolve('src/assets/img/themes/default')
                }
            }
        });
        return webpackConfig;
    });

}

