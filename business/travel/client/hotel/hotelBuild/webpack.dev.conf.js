'use strict'
const path = require('path')
process.env.NODE_ENV = 'development'
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
                    'hotelComponent':resolve('src/modules/hotel/common'),
                    'hotelHandler': resolve('src/modules/hotel/views'),
                    'styles': resolve('src/platform/styles'),
                    'platform': resolve('src/platform'),
                    'themesDefault': resolve('src/assets/img/themes/default')
                }
            }
        });
        return webpackConfig;
    });

}

