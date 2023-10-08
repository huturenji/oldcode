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
        });
        return webpackConfig;
    });

}

