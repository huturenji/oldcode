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
                    'flightComp': resolve('src/modules/orderManagement/orderDetail/views/flight/flightComp'),
                    'trainComp': resolve('src/modules/orderManagement/orderDetail/views/train/trainComp'),
                    'hotelComp': resolve('src/modules/orderManagement/orderDetail/views/hotel/hotelComp'),
                    'orderCommon': resolve('src/modules/orderManagement/common'),
                    'orderComp': resolve('src/modules/orderManagement/common/components'),
                    'psgCard': resolve('src/modules/orderManagement/psgCard'),
                    'routeDir': resolve('src/route'),
                    'components':resolve('src/components'),
                    'platform':resolve('src/platform'),
                    'styles': resolve('src/platform/styles'),
                }
            }
        });
        return webpackConfig;
    });

}

