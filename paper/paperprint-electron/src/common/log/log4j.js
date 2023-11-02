// 文件名：log4js.js
const log4js = require('log4js');

log4js.configure({
    appenders: {
        dateFileLog: {
            category:"log_date",
            type: 'dateFile',        //设置每天：以日期为单位,数据文件类型，dataFiel 注意设置pattern，alwaysIncludePattern属性
            filename: "./logs/log",   // 输出到文件的文件路径，注意最后/是文件名前缀，如果只写./logs则只会在应用程序根目录生成文件
            alwaysIncludePattern: true,    //始终包含pattern
            keepFileExt: true,   // 日志文件是否始终保持后缀
            pattern: 'yyyy-MM-dd.log' // 每天生成按这个格式拼接到filename后边
        },
        allFileLog: {   
            type: 'file', //写在一个文件里面
            filename: "./logs/log.log", 
            keepFileExt: true, 
            maxLogSize: 1024 * 1024 * 100, // 文件最大容纳值
            backups: 3
        }
    },
    categories: {    // 不同等级的日志追加到不同的输出位置：appenders: ['out', 'allLog']  categories 作为getLogger方法的键名对应
        default: { appenders: [ 'dateFileLog' ], level: 'info' },
        allFile: {appenders: ['allFileLog'], level: "debug"}
    }
});


module.exports = {
    default: log4js.getLogger(),
    allFile: log4js.getLogger('allFile')
}