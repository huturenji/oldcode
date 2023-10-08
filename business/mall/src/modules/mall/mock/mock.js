// 引入mockjs
import Mock from "mockjs";
import getMallMockData from "./DMT/data";

//统一设置异步耗时
Mock.setup({ timeout: 1200 });
var MallMockData = getMallMockData(Mock.Random);
// debugger
if (MallMockData && MallMockData.length > 0) {
  MallMockData.forEach(element => {
    Mock.mock(element.urlRegExp, element.urlType, element.mockRes);
  });
}
