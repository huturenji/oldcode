// 引入mockjs
import Mock from "mockjs"; 
import {getMyCustomConfigs_Raw} from 'feature/customFunctionConfigs.js';

//获取mock.Random对象 Mock.Random 是一个工具类，用于生成各种随机数据。
const Random = Mock.Random;

// mock一组数据
const psgsData = function() {
    let articles = [];
    for (let i = 0; i < 100; i++) {
        let newArticleObject = {
            title: Random.csentence(5, 30), //  Random.csentence( min, max )
            thumbnail_pic_s: Random.dataImage('300x250', 'mock的图片'), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
            author_name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
            date: Random.date() + ' ' + Random.time() // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
        }
        articles.push(newArticleObject)
    }
 
    return {
        articles: articles
    }
}
 
// Mock.mock( url, post/get , 返回的数据)；
// Mock.mock('/news/index', 'post', psgsData);
const trainQueryData = function() {
    var res = {
        "code": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data": {
            "policy": "",
            "trainList": [
               
            ],
            "queryKey": "847f5200fbf93f7e92e0215a6a5c761e",
            "FromDate": "2019/07/04"
        }
    }
    return res
}
//Mock.mock(/train\/query/, 'post', trainQueryData);
/**mock 定制功能 配置开关 接口**/
const CustomConfigs = function() {
    var res = {
        "code": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data": getMyCustomConfigs_Raw()||""
    }
    return res
}
Mock.mock(/production\/getCustomConfigs/, 'post', CustomConfigs);
/**mock 定制功能 配置开关 接口**/