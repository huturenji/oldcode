'use strict'
const path = require('path')
const {merge} = require('webpack-merge')
const devWebpackConfig = require('../build/webpack.dev.conf')
const custUtils = require('./utils');
function resolve(dir) {
    return path.join(__dirname, '..', dir)
  }


module.exports = ()=>{
    return devWebpackConfig().then((conf)=>{
        let webpackConfig =  merge(conf,{
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
        });
        return webpackConfig;
    });

}

