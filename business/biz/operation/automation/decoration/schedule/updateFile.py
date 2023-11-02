from common.handle_data import TestData
from common.handle_request import HandleRequest
from common.admin_token import adminToken
from common.handle_data import repalce_promotionInfo,replace_fitinfo

class updateFile():
    def __init__(self):
        self.headers = {"content-type":"application/json"}
        self.http = HandleRequest()

    #根据环境，渠道，首页名称，查询页面的decoId
    def searchNameIndex(self,environment,list):
        # 设置admintoken
        adminToken(environment)
        self.headers["Authorization"] = getattr(TestData, environment+"adminToken")
        if environment == "SIT":
            topUrl = "bplussit.sinosun.com:18380/mallbbcg2"
        elif environment == "UAT":
            topUrl = "bplus-uat.sinosun.com/mallbbcg2"
        elif environment == "UATBANK":
            topUrl = "bplus-uat.sinosun.com/mallbbcg2bank"
        elif environment == "PRODUCT":
            topUrl = "cloud.sinosun.com/mallbbcg2"
        elif environment == "PRODUCTBANK":
            topUrl = "cloud.sinosun.com:9443/mallbbcg2bank"
        url = "https://{}/v3/system/admin/mobileDeco/list".format(topUrl)
        params = {
            'pageSize':100,
            'name':list["indexName"],
            'type':'home',
            'channelId':list["channelId"]
        }
        res = self.http.send(url=url, method="get",headers=self.headers, params=params).json()
        result = res['data']['list']
        if len(result) != 1:
            result = "查询的首页非1条数据，请重新输入关键词查询"
        # 取一条数据
        else:
            result = res['data']['list'][0]
        #返回查询结果
        return result

    # 入参channelId和decoId,返回该首页的装修数据
    def fitDetail(self, environment,list):
        adminToken(environment)
        self.headers["Authorization"] = getattr(TestData, environment + "adminToken")
        if environment == "SIT":
            topUrl = "bplussit.sinosun.com:18380/mallbbcg2"
        elif environment == "UAT":
            topUrl = "bplus-uat.sinosun.com/mallbbcg2"
        elif environment == "UATBANK":
            topUrl = "bplus-uat.sinosun.com/mallbbcg2bank"
        elif environment == "PRODUCT":
            topUrl = "cloud.sinosun.com/mallbbcg2"
        elif environment == "PRODUCTBANK":
            topUrl = "cloud.sinosun.com:9443/mallbbcg2bank"
        url = "https://{}/v3/system/admin/mobileDeco/detail".format(topUrl)

        #组装导入需要的数据，并循环调用导出装修，并组装到List数组里
        params = {
                'decoId': list["decoId"],
                'channelId': list["channelId"]
         }
        res = self.http.send(url=url, method="get", headers=self.headers, params=params).json()
        data = res['data']['data']
        name = res['data']['name']
        type = res['data']['type']
        # 返回装修数据
        return data,name,type

    #更新首页装修数据
    def indexTopicUpdate(self,environment,list):
        # list = domain_data(environment, str(list))
        old_fit = eval(list["oldfit"])
        new_fit = eval(list["newfit"])
        # list = repalce_promotionInfo(list)
        list = replace_fitinfo(old_fit, new_fit, list)
        # print("promotion_list",list)
        # 设置admintoken
        # adminToken(environment)
        self.headers["Authorization"] = getattr(TestData, environment + "adminToken")
        self.headers["content-type"] = 'application/x-www-form-urlencoded;charset=UTF-8'
        if environment == "SIT":
            topUrl = "bplussit.sinosun.com:18380/mallbbcg2"
        elif environment == "UAT":
            topUrl = "bplus-uat.sinosun.com/mallbbcg2"
        elif environment == "UATBANK":
            topUrl = "bplus-uat.sinosun.com/mallbbcg2bank"
        elif environment == "PRODUCT":
            topUrl = "cloud.sinosun.com/mallbbcg2"
        elif environment == "PRODUCTBANK":
            topUrl = "cloud.sinosun.com:9443/mallbbcg2bank"
        url = "https://{}/v3/system/admin/mobileDeco/update".format(topUrl)
        data = {
            'decoId': list["decoId"],
            'type':list['type'],
            'channelId': list["channelId"],
            'name':list["name"],
            'data': list["data"]
        }
        # print("data",data)
        res = self.http.send(url=url, method="post", data=data, headers=self.headers).json()
        return res

    #根据环境，渠道，专题名称，查询页面的decoId
    def searchNameTopic(self,environment,list):
        # 设置admintoken
        adminToken(environment)
        self.headers["Authorization"] = getattr(TestData, environment+"adminToken")
        if environment == "SIT":
            topUrl = "bplussit.sinosun.com:18380/mallbbcg2"
        elif environment == "UAT":
            topUrl = "bplus-uat.sinosun.com/mallbbcg2"
        elif environment == "UATBANK":
            topUrl = "bplus-uat.sinosun.com/mallbbcg2bank"
        elif environment == "PRODUCT":
            topUrl = "cloud.sinosun.com/mallbbcg2"
        elif environment == "PRODUCTBANK":
            topUrl = "cloud.sinosun.com:9443/mallbbcg2bank"
        url = "https://{}/v3/system/admin/mobileDeco/list".format(topUrl)
        params = {
            'pageSize':100,
            'name':list["topicName"],
            'type':'topic',
            'channelId':list["channelId"]
        }
        res = self.http.send(url=url, method="get",headers=self.headers, params=params).json()
        result = res['data']['list']
        if len(result) != 1:
            result = "查询的首页非1条数据，请重新输入关键词查询"
        # 取一条数据
        else:
            result = res['data']['list'][0]
        #返回查询结果
        return result

#更新首页装修数据
    # def topicUpdate(self,environment,list):
    #     # list = domain_data(environment, str(list))
    #     list = repalce_promotionInfo(list)
    #     # print("promotion_list",list)
    #     # 设置admintoken
    #     # adminToken(environment)
    #     self.headers["Authorization"] = getattr(TestData, environment + "adminToken")
    #     self.headers["content-type"] = 'application/x-www-form-urlencoded;charset=UTF-8'
    #     if environment == "SIT":
    #         topUrl = "bplussit.sinosun.com:18380/mallbbcg2"
    #     elif environment == "UAT":
    #         topUrl = "bplus-uat.sinosun.com/mallbbcg2"
    #     elif environment == "UATBANK":
    #         topUrl = "bplus-uat.sinosun.com/mallbbcg2bank"
    #     elif environment == "PRODUCT":
    #         topUrl = "cloud.sinosun.com/mallbbcg2"
    #     elif environment == "PRODUCTBANK":
    #         topUrl = "cloud.sinosun.com:9443/mallbbcg2bank"
    #     url = "https://{}/v3/system/admin/mobileDeco/update".format(topUrl)
    #     data = {
    #         'decoId': list["decoId"],
    #         'type':'topic',
    #         'channelId': list["channelId"],
    #         'name':list["topicName"],
    #         'data': list["data"]
    #     }
    #     # print("data",data)
    #     res = self.http.send(url=url, method="post", data=data, headers=self.headers).json()
    #     print("更新缓存", res)
    #     return res

if __name__ == '__main__':

    # list = {
    #     "name": '杜丽莎测试杜丽莎', "channelId": '9729',
    #     "oldSecId": "869682756198400", "oldSecName": "秒杀正式",
    #     "oldBuyId": "", "oldBuyName": "",
    #     "newSecId": "910916354740224", "newSecName": "071536",
    #     "newBuyId": "", "newBuyName": ""
    # }

    # lists =""
    # uf = updateFile()
    # for list in lists:
    #     # 如果首页名称不为空，则更新首页装修
    #     if list["indexName"] != None:
    #         searchIndexRes = uf.searchNameIndex(list["environment"],list)
    #         list["decoId"] = searchIndexRes["decoId"]
    #         data = uf.fitDetail(list["environment"],list)
    #         list["data"] = data
    #         uf.indexUpdate(list["environment"],list)
    #
    #     # 如果专题页名称不为空，则更新专题装修
    #     if list["topicName"] != None:
    #         searchTopicRes = uf.searchNameTopic(list["environment"], list)
    #         list["decoId"] = searchTopicRes["decoId"]
    #         data = uf.fitDetail(list["environment"], list)
    #         list["data"] = data
    #         uf.topicUpdate(list["environment"], list)

    uf = updateFile()
    # 如果首页名称不为空，则更新首页装修
    # if list["indexName"] != None:
    # searchIndexRes = uf.searchNameIndex(list["environment"], list)
    # if isinstance(searchIndexRes, str):
    #     msgbox.showinfo("错误提示",searchIndexRes)
    # else:
    #     list["decoId"] = searchIndexRes["decoId"]
    data, name, type = uf.fitDetail(list["environment"], list)
    list["data"] = data
    list["name"] = name
    list["type"] = type
    uf.indexTopicUpdate(list["environment"], list)