/*
 * @Descripttion: 配置生产环境的NODE_ENV环境变量
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: yg
 * @LastEditTime: 2020-09-25 09:32:24
 */
'use strict'
module.exports = {
  BP_ENV: '"'+process.env.BP_ENV+'"',
  TIMESTAMP_ENV:'"'+new Date().getTime()+'"'
}
