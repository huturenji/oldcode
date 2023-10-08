'use strict'
require('../build/check-versions')()
process.env.NODE_ENV = 'production'

const path = require('path')
const webpackConfig = require('../build/webpack.prod.conf');
const merge = require('webpack-merge')
const config = require('../config')
const utils = require('../build/utils')


function resolve(dir) {
    return path.join(__dirname, '..', dir)
}


let wconf = merge(webpackConfig,{
    resolve:{
        alias:{
            'components': resolve('src/components/'),
        }
    }
})

utils.buildWebpack(wconf,config)


