/*
 * @Descripttion: 检查node版本，检查npm版本
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: yg
 * @LastEditTime: 2020-09-25 10:35:22
 */

'use strict'
//定制控制台日志的输出样式
const chalk = require('chalk')
//加载语义化版本测试库
const semver = require('semver')
//引入package.json文件
const packageConfig = require('../package.json')
//shell命令
const shell = require('shelljs')

/**
 * 返回通过child_process模块的新建子进程，用来执行unix系统命令后转为没有空格的字符串
 * @param {object} cmd 
 */
function exec (cmd) {
    //require('child_process') 调用nodejs子进程
    // execSync同步的exec方法执行command
    return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [
  {//node信息
    name: 'node',
    //process.version是当前使用的node版本信息
    currentVersion: semver.clean(process.version),//使用semver格式化版本，返回格式化后的node版本信息
    versionRequirement: packageConfig.engines.node//获取package.json中设置的node版本
  }
]

if (shell.which('npm')) {//如果是npm命令
  versionRequirements.push({//添加npm版本信息
    name: 'npm',
    currentVersion: exec('npm --version'),//自动调用npm --verion命令，并且把参数返回给exec函数，从而获取纯净的版本号
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  const warnings = []
  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {//版本号不符合package.json中配置的要求，则执行下面的代码
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)//错误或者警告信息，显示红色当前版本号，绿色需要的版本号
      )
    }
  }
  //打印错误信息
  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()
    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }
    console.log()
    //按照linux规范，一般成功用0表示，非0表示失败。存在不满足版本要求的模块，则执行失败。
    process.exit(1)
  }
}
