/*
 * @Descripttion: vue文件的loader
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: yg
 * @LastEditTime: 2020-10-09 10:37:33
 */
'use strict'
const path = require('path')
const fs = require('fs')
const utils = require('./utils')
const config = require('./config')
let themeOptions = {}
fs.existsSync('.sntheme.js') && (themeOptions = require('../.sntheme'))

const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction ?
    config.build.productionSourceMap :
    config.dev.cssSourceMap

module.exports = {
    loaders: utils.cssLoaders({
        sourceMap: sourceMapEnabled,
        extract: isProduction,
        themeOptions: themeOptions
    }),
    include: [path.join(__dirname, '..', 'src')],
    exclude: /node_modules\/(?!(autotrack|dom-utils))|vendor\.dll\.js/,
    cssSourceMap: sourceMapEnabled,
    cacheBusting: config.dev.cacheBusting,
    transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href'
    }
}