import re


class TestData:
    """这个类的作用：专门用来保存一些要替换的数据"""
    pass


# def replace_data(r,dom,data):
#     # 判断是否有需要替换的数据
#     while re.search(r, data):
#         # 匹配出第一个要替换的数据
#         res = re.search(r, data)
#         # 提取待替换的内容
#         item = res.group()
#         # print("item",item)
#         # 获取替换内容中的数据项
#         # key = res.group(1)
#         # 根据替换内容中的数据项去配置文件中找到对应的内容，进行替换
#         data = data.replace(item, dom)
#     # 返回替换好的数据
#     return data

def replace_data(rep,dom):
    # 判断是否有需要替换的数据
    pat = "bplus.?[su][ia](t.sinosun.com).?\d{0,5}(/mallbbcg2)(bank)?"
    data = re.sub(pat, rep, dom, count=0, flags=0)
    # 返回替换好的数据
    return data

def replace_product_data(rep,dom):
    pat = "(cloud.sinosun.com).?\d{0,4}(/mallbbcg2)(bank)?"
    data = re.sub(pat, rep, dom, count=0,flags=0)
    return data

#把有storeAndSupplierInfos的店铺处理成只有京东企业购
def repalce_storeinfo(str):
    pat ='("storeAndSupplierInfos":)(.+?)[}][]]'
    rep = '"storeAndSupplierInfos":[{"storeId":6,"supplierTypes":["JD"],"value":"京东企业购"}]'
    data = re.sub(pat, rep, str, count=0,flags=0)
    return data

# 当商品info未空时，处理
def repalce_specialstoreinfo(str):
    pat ='"storeAndSupplierInfos":[[][]]'
    rep = '"storeAndSupplierInfos":[{"storeId":6,"supplierTypes":["JD"],"value":"京东企业购"}]'
    data = re.sub(pat, rep, str, count=0,flags=0)
    return data

def replace_fitinfo(old,new,list):
    lenth = len(old)
    data = list["data"]
    for i in range(0,lenth):
        print(i,old[i])
        data = re.sub(old[i], new[i], str(data), count=0, flags=0)
    list["data"] = data
    return list

def repalce_promotionInfo(data):
    if data["oldSecId"] != None:
        # 替换秒杀id
        sec_pat = data["oldSecId"]
        sec_rep = data["newSecId"]
        data = re.sub(sec_pat, sec_rep, str(data), count=0,flags=0)
        data = eval(data)
        # 替换秒杀名称
        sec_name_pat = data["oldSecName"]
        sec_name_rep = data["newSecName"]
        data = re.sub(sec_name_pat, sec_name_rep, str(data), count=0,flags=0)
        data = eval(data)
    if data["oldBuyId"] != None:
        # 替换一起买id
        buy_pat = data["oldBuyId"]
        buy_rep = data["newBuyId"]
        data = re.sub(buy_pat, buy_rep, str(data), count=0, flags=0)
        data = eval(data)
        # 替换一起买名称
        buy_name_pat = data["oldBuyName"]
        buy_name_rep = data["newBuyName"]
        data = re.sub(buy_name_pat, buy_name_rep, str(data), count=0, flags=0)
        data = eval(data)

    return data

def replace_sku(rep,dom):
    # 被替换的字符
    pat = "[PA][ABC]AB"
    #rep最终替换好的字符
    data = re.sub(pat,rep,dom,count=0,flags=0)
    return data
def domain_data(domain,data):
    sit = "bplussit.sinosun.com:18380/mallbbcg2"
    uat = "bplus-uat.sinosun.com/mallbbcg2"
    uatbank = "bplus-uat.sinosun.com/mallbbcg2bank"
    pro = "cloud.sinosun.com/mallbbcg2"
    probank="cloud.sinosun.com:9443/mallbbcg2bank"

    if domain == "SIT":
        data = replace_data(sit, data)
        data = replace_product_data(sit, data)
        data = replace_sku("PAAB",data)
    elif domain == "UAT":
        data = replace_data(uat, data)
        data = replace_product_data(uat, data)
        data = replace_sku("PAAB", data)
    elif domain == "UATBANK":
        data = replace_data(uatbank, data)
        data = replace_product_data(uatbank, data)
        data = replace_sku("ABAB", data)
    elif domain == "PRODUCT":
        data = replace_product_data(pro, data)
        data = replace_data(pro, data)
        data = replace_sku("PAAB", data)
    elif domain == "PRODUCTBANK":
        data = replace_product_data(probank,data)
        data = replace_data(probank, data)
        data = replace_sku("ACAB", data)
    return data

if __name__ == '__main__':
    # str = "{'state': 200, 'sdsdsdbplussit.sinosun.com:18380/mallbbcg2sdsdsd': '成功', 'bplus-uat.sinosun.com/mallbbcg2': bplussit.sinosun.com:18380/mallbbcg2, 'data':dsdsdsdsdsdsdsd"
    # str = "https://bplus-uat.sinosun.com/mallbbcg2/static/adminindex.html#/pages/search/searchhttps://bplus-uat.sinosun.com/mallbbcg2/static/adminindex.html#/pages/search/search"
    # res = domain_data("SIT",str)
    str = "sfsdfPAABXXXXABAB"
    res = domain_data("UATBANK",str)
    # res = eval(res)
    print(res)

