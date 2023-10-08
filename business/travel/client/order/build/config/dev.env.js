/*
 * @Descripttion: 配置开发环境的NODE_ENV环境变量
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: yg
 * @LastEditTime: 2020-09-25 09:31:58
 */
'use strict'
const {merge} = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
})
