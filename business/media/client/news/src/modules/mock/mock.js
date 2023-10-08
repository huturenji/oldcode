// 引入mockjs
import Mock from "mockjs";
import getNewsMockData from "./DMT/data";

//统一设置异步耗时
Mock.setup({ timeout: 300 });
var NewsMockData = getNewsMockData(Mock.Random);
if (NewsMockData && NewsMockData.length > 0) {
    NewsMockData.forEach(element => {
        Mock.mock(element.urlRegExp, element.urlType, element.mockRes);
    });
}
