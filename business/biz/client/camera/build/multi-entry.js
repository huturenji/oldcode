/*
 * @Descripttion: 获取所有入口文件 输出入口对象
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: yg
 * @LastEditTime: 2020-10-09 10:09:41
 */


const config = require('./config')
const glob = require('glob')
const path = require('path')
const fs = require('fs')

//环境变量
let HTML_ENV = process.env.HTML_ENV;
console.log('entry Html is ' + HTML_ENV)
// generate all entry
let getEntry = () => {
  // get all js files
	let files = [];
	if(HTML_ENV){
		let HTML_ARR = HTML_ENV.split(',');
		HTML_ARR.forEach((item)=>{
			files = files.concat(glob.sync(config.src + '/**/'+item+'.js'))
		})
	}else{
		files =  glob.sync(config.src + '/**/*.js');
	}
	
  let entrys = {};

  files.forEach(function (_file) {
    let file = path.parse(_file);
    let htmlFile = path.resolve(file.dir, file.name + '.' + config.ext);
    // if has same name template file, it is a entry
    if (fs.existsSync(htmlFile)) {
      entrys[file.name] = path.resolve(_file);
    }
  });
  return entrys;
}

module.exports = getEntry;
