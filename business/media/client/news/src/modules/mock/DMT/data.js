/**
 * 资讯mock数据
 */
export default function getNewsMockData(Random) {
    let mockDataArray = [];
    let mainSwitchs = {
        personalSwitch: false, //个人中心模块mock开关
        categorySwitch: false, //频道模块mock开关
        contectSwitch: false,//资讯文章模块
        channelSwitch: false//渠道模块

    };

    /********************************************下面是资讯服务****************/

    mockDataArray.push({
        urlRegExp: /content\/v1\/listToppedArticle/,
        urlType: "post",
        mockRes:{
            "resultCode": 0,
            "resultMessage": "success",
            "result": {
                "hitResult|0-4": 
              [
                  {
                      "articleId": "string",
                      "articleType": "string",
                      "title": "日本派核污染废水送大奖啊圣诞树记得那时记得那时觉得那设计大赛的骄傲是男的就暗示你记得那句送到哪记得你就按当年",
                      "currentTime": 0,
                      "publishTime": 0,
                      "publishTimeStr": "string",
                      "lastUpdateTime": 0,
                      "lastUpdateTimeStr": "string",
                      "createTime": 0,
                      "createTimeStr": "string",
                      "mediaName": "央视新闻",
                      "authorName": "string",
                      "categoryId": "1111",
                      "categoryName": "string",
                      "cover": [
                          {
                              "id": "string",
                              "url": "string",
                              "description": "string",
                              "size": 0,
                              "height": 0,
                              "width": 0
                          }
                      ],
                      "pictures": [
                          {
                              "id": "string",
                              "url": "string",
                              "description": "string",
                              "size": 0,
                              "height": 0,
                              "width": 0
                          }
                      ],
                      "video": [
                          {
                              "id": "string",
                              "url": "string",
                              "description": "string",
                              "size": 0,
                              "height": 0,
                              "width": 0,
                              "duration": 0,
                              "resolution": "string"
                          }
                      ],
                      "statistics": {
                          "upCount": 0,
                          "downCount": 0,
                          "commentCount": 0,
                          "shareCount": 0,
                          "followCount": 0,
                          "readCount": 0,
                          "wowCount": 0,
                          "commentUrl": "string"
                      },
                      "supplier": {
                          "articleId": "string",
                          "supplierId": "string",
                          "supplierName": "string",
                          "articleCategory": [
                              {
                                  "id": "string",
                                  "category": "string"
                              }
                          ]
                      },
                      "state": "string"
                  }
              ],
              
                "resultCount": 0,
                "pageIndex": 0,
                "pageSize": 0,
                "pageCount": 0
            }
        } 
    });
    //对资讯服务渠道模块添加控制开关
    if (!!mainSwitchs.channelSwitch) {
        /**
         * 保存用户已选择的频道
         */
        mockDataArray.push({
            urlRegExp: /channel\/v1\/getChannel/,
            urlType: "get",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {
                    address:null,
                    channelId:"1",
                    channelName:"T信",
                    createTime:null,
                    location:null,
                    logo:"https://bplussit2.sinosun.com:18380/media/file/v1/content/static/p/media/file/tchat.png",
                    protocol:[],
                    shortChannelName:"T信",
                    state:"ENABLE"
                }
            }
        });
    }

    //对资讯服务个人中心模块添加控制开关
    if (!!mainSwitchs.personalSwitch) {
        /**
         * 保存用户已选择的频道
         */
        mockDataArray.push({
            urlRegExp: /customer-profile\/v1\/updateUserCategory/,
            urlType: "post",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {}
            }
        });
        /**
         * 获取用户已选择的频道
         */
        mockDataArray.push({
            urlRegExp: /customer-profile\/v1\/getUserCategory/,
            urlType: "post",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {
                    "isFirst": true,
                    "categories":[
                        {
                            "categoryId": '00',
                            "categoryType": 'NEW',
                            "categoryName": '要闻',
                            "specialType": ['FIXED']
                        },
                        {
                            "categoryId": "01",
                            "categoryType": "INDUSTRY",
                            "categoryName": "推荐"
                        },
                        {
                            "categoryId": "02",
                            "categoryType": "NEW",
                            "categoryName": "抗疫"
                        },
                        {
                            "categoryId": "03",
                            "categoryType": "INDUSTRY",
                            "categoryName": "视频",
                            "specialType": ['VIDEO']
                        },
                        {
                            "categoryId": "04",
                            "categoryType": "INDUSTRY",
                            "categoryName": "本地"
                        }
                    ]
                }
            }
        });
        /**
         * 保存用户点赞、踩、收藏、浏览或不喜欢（不感兴趣）的记录LIKE-赞 HATE-踩 FAVORITE-收藏 HISTORY-历史记录 UNLIKE-不喜欢（不感兴趣）
         */
        mockDataArray.push({
            urlRegExp: /customer-profile\/v1\/addRecord/,
            urlType: "post",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {}
            }
        });
        /**
         * 取消用户点赞、踩、收藏、浏览或不喜欢（不感兴趣）的记录LIKE-赞 HATE-踩 FAVORITE-收藏 HISTORY-历史记录 UNLIKE-不喜欢（不感兴趣）
         */
        mockDataArray.push({
            urlRegExp: /customer-profile\/v1\/deleteRecord/,
            urlType: "post",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {}
            }
        }); 
        /**
         * 查询资讯私有信息，是否点赞、是否点踩、是否收藏
         */
        mockDataArray.push({
            urlRegExp: /customer-profile\/v1\/listAction/,
            urlType: "post",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {
                    actions:[
                        {
                            "like|1-2":false,
                            "hate|1-2":false,
                            "favorite|1-2":false
                        }
                    ]

                }
            }
        });                              
        /**
         * 获取我的页面涉及的我的收藏/我的点赞/和阅读历史的数量
         */
        mockDataArray.push({
            urlRegExp: /customer-profile\/v1\/recordCount/,
            urlType: "post",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {
                    "favoriteNum|0-500": 1,
                    "likeNum|0-500": 1,
                    "historyNum|0-500": 1
                }
            }
        });
        /**
         * 获取我的收藏我的点赞我的历史记录
         */
        mockDataArray.push({
            urlRegExp: /customer-profile\/v1\/listRecord/,
            urlType: "post",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {
                    "pageCount": 20,
                    "pageIndex": 1,
                    "pageSize": 20,
                    "resultCount": 20,
                    "hitResult|20": [
                        {
                            "articleId|+1": 123456
                        }
                    ]

                }
            }
        });       
    }

    //对资讯服务频道模块添加控制开关
    if (!!mainSwitchs.categorySwitch) {
        /**
         * 查询行业频道下的行业资源
         */
        mockDataArray.push({
            urlRegExp: /category\/v1\/listCategory/,
            urlType: "post",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {
                    "hitResult":[
                        
                        {
                            "categoryId": "01",
                            "categoryType": "INDUSTRY",
                            "categoryName": "推荐"
                        },
                        {
                            "categoryId": "02",
                            "categoryType": "INDUSTRY",
                            "categoryName": "抗疫"
                        },
                        {
                            "categoryId": "03",
                            "categoryType": "INDUSTRY",
                            "categoryName": "视频"
                        },
                        {
                            "categoryId": "04",
                            "categoryType": "INDUSTRY",
                            "categoryName": "本地"
                        },
                        {
                            "categoryId": "05",
                            "categoryType": "INDUSTRY",
                            "categoryName": "热点"
                        },
                        {
                            "categoryId": "06",
                            "categoryType": "INDUSTRY",
                            "categoryName": "娱乐"
                        },
                        {
                            "categoryId": "07",
                            "categoryType": "INDUSTRY",
                            "categoryName": "财经"
                        },
                        {
                            "categoryId": "08",
                            "categoryType": "INDUSTRY",
                            "categoryName": "科技"
                        },
                        {
                            "categoryId": "09",
                            "categoryType": "INDUSTRY",
                            "categoryName": "社会"
                        },
                        {
                            "categoryId": "10",
                            "categoryType": "INDUSTRY",
                            "categoryName": "国际"
                        },
                        {
                            "categoryId": "11",
                            "categoryType": "INDUSTRY",
                            "categoryName": "游戏"
                        },
                        {
                            "categoryId": "12",
                            "categoryType": "INDUSTRY",
                            "categoryName": "互联网"
                        },
                        {
                            "categoryId": "13",
                            "categoryType": "INDUSTRY",
                            "categoryName": "动漫"
                        },
                        {
                            "categoryId": "14",
                            "categoryType": "INDUSTRY",
                            "categoryName": "漫画"
                        },
                        {
                            "categoryId": "15",
                            "categoryType": "INDUSTRY",
                            "categoryName": "图片"
                        },
                        {
                            "categoryId": "16",
                            "categoryType": "INDUSTRY",
                            "categoryName": "直播"
                        },
                        {
                            "categoryId": "17",
                            "categoryType": "INDUSTRY",
                            "categoryName": "电影"
                        },
                        {
                            "categoryId": "18",
                            "categoryType": "INDUSTRY",
                            "categoryName": "股票"
                        },
                        {
                            "categoryId": "19",
                            "categoryType": "INDUSTRY",
                            "categoryName": "教育"
                        },
                        
                        {
                            "categoryId": "001",
                            "categoryType": "NEWS",
                            "categoryName": "医疗"
                        },
                        {
                            "categoryId": "002",
                            "categoryType": "NEWS",
                            "categoryName": "白酒"
                        },
                        {
                            "categoryId": "003",
                            "categoryType": "NEWS",
                            "categoryName": "科技"
                        },
                        {
                            "categoryId": "004",
                            "categoryType": "NEWS",
                            "categoryName": "军工"
                        },
                        {
                            "categoryId": "005",
                            "categoryType": "NEWS",
                            "categoryName": "消费"
                        },
                        {
                            "categoryId": "006",
                            "categoryType": "NEWS",
                            "categoryName": "保险"
                        },
                        {
                            "categoryId": "007",
                            "categoryType": "NEWS",
                            "categoryName": "债券"
                        },
                        {
                            "categoryId": "008",
                            "categoryType": "NEWS",
                            "categoryName": "农业"
                        },
                        {
                            "categoryId": "009",
                            "categoryType": "NEWS",
                            "categoryName": "创业"
                        },
                        {
                            "categoryId": "010",
                            "categoryType": "NEWS",
                            "categoryName": "航空"
                        },
                        {
                            "categoryId": "011",
                            "categoryType": "NEWS",
                            "categoryName": "燃料"
                        },
                        {
                            "categoryId": "012",
                            "categoryType": "NEWS",
                            "categoryName": "新能源"
                        },
                        {
                            "categoryId": "013",
                            "categoryType": "NEWS",
                            "categoryName": "汽车"
                        },
                        {
                            "categoryId": "014",
                            "categoryType": "NEWS",
                            "categoryName": "房地产"
                        },
                        {
                            "categoryId": "015",
                            "categoryType": "NEWS",
                            "categoryName": "养老"
                        },
                        {
                            "categoryId": "016",
                            "categoryType": "NEWS",
                            "categoryName": "航空"
                        },
                        {
                            "categoryId": "017",
                            "categoryType": "NEWS",
                            "categoryName": "人工智能"
                        },
                        {
                            "categoryId": "018",
                            "categoryType": "NEWS",
                            "categoryName": "环保"
                        },
                        {
                            "categoryId": "019",
                            "categoryType": "NEWS",
                            "categoryName": "稀有金属"
                        },
                        {
                            "categoryId": "020",
                            "categoryType": "NEWS",
                            "categoryName": "通信"
                        },
                        {
                            "categoryId": "021",
                            "categoryType": "NEWS",
                            "categoryName": "中药"
                        }
                        
                    ]
                }
            }
        });
        /**
         * 获取所有行业资源列表
         */
        mockDataArray.push({
            urlRegExp: /category\/v1\/searchIndustrySite/,
            urlType: "post",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {
                    "hitResult|0-20":[
                        {
                            "industry|1-3": "设备",
                            "industryId|1-200":0,
                            "site|10-20": [
                                {
                                    "logo": Random.dataImage('100x100'),
                                    "industry|1-3": "设备",
                                    "siteName|1-3": "租机",
                                    "pcUrl": "https://wuhan.zbj.com/",
                                    "phoneUrl": "https://wuhan.zbj.com/",
                                    "priority": 0,
                                    "remark": "string",
                                    "createTime": 0,
                                    "state": 1
                                }
                            ]
                        }
                    ]
                }
            }
        });      
    }
    //对资讯服务资讯模块添加控制开关
    if (!!mainSwitchs.contectSwitch) {
        /**
         * 查询热搜
         */
        mockDataArray.push({
            urlRegExp: /content\/v1\/listHotKeyword/,
            urlType: "post",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {
                    "keywords":['美国再制裁11家中企 外交部回应','1月10日设立为中国人民警察节','全球累计确诊逾1506万例','黄子韬为Yamy发声','海底捞就塑料乌鸡卷事件道歉','1小时开4张罚单民警被停职','研究所集体离职 国务院介入']
                }
            }
        });                             
        /**
         * 举报资讯
         */
        mockDataArray.push({
            urlRegExp: /content\/v1\/reportArticle/,
            urlType: "post",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {}
            }
        });
        /**
         * 查询资讯列表
         */
        mockDataArray.push({
            urlRegExp: /content\/v1\/listArticle/,
            urlType: "post",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {
                    "pageCount": 20,
                    "hitResult|1-3": [
                        {
                            "articleId": "86492982583296",
                            "articleType": "VIDEO",
                            "state":"ENABLED",
                            "title": "创业板指重回2600点 两市半天成交额再破万亿",
                            "video": [
                                {
                                    "url": "https://video.da.mgtv.com/new_video/2020/06/02/1765/B925F01229D362FFC7B276E2EA7C8027_20200602_1_1_686.mp4",
                                    "videoFirstFrameUrl": "https://bpdev.sinosun.com:18195/static/hotel/assets/videoImg.jpg",
                                    "width": 700,
                                    "height": 323
                                }
                            ],
                            "statistics": {
                                "upCount|1-99999999": 0,
                                "downCount|1-9999": 0,
                                "commentCount|1-9999": 0,
                                "shareCount|1-9999": 0,
                                "followCount|1-9999": 0,
                                "commentUrl": "string"
                            },
                            "mediaName": "视讯网",
                            "lastUpdateTime": 1594095604488
                        },
                        {
                            "articleId": "86492982583296",
                            "articleType": "VIDEO",
                            "state":"ENABLED",
                            "title": "创业板指重回2600点 两市半天成交额再破万亿",
                            "video": [
                                {
                                    "url": "https://video.da.mgtv.com/new_video/2020/06/02/1765/B925F01229D362FFC7B276E2EA7C8027_20200602_1_1_686.mp4",
                                    "videoFirstFrameUrl": "https://bpdev.sinosun.com:18195/static/hotel/assets/videoImg.jpg",
                                    "width": 700,
                                    "height": 323
                                }
                            ],
                            "statistics": {
                                "upCount|1-99999999": 0,
                                "downCount|1-9999": 0,
                                "commentCount|1-9999": 0,
                                "shareCount|1-9999": 0,
                                "followCount|1-9999": 0,
                                "commentUrl": "string"
                            },
                            "mediaName": "视讯网",
                            "lastUpdateTime": 1594095604488
                        },
                        {
                            "articleId": "86492982583296",
                            "articleType": "VIDEO",
                            "state":"ENABLED",
                            "title": "创业板指重回2600点 两市半天成交额再破万亿",
                            "video": [
                                {
                                    "url": "https://video.da.mgtv.com/new_video/2020/06/02/1765/B925F01229D362FFC7B276E2EA7C8027_20200602_1_1_686.mp4",
                                    "videoFirstFrameUrl": "https://bpdev.sinosun.com:18195/static/hotel/assets/videoImg.jpg",
                                    "width": 700,
                                    "height": 323
                                }
                            ],
                            "statistics": {
                                "upCount|1-99999999": 0,
                                "downCount|1-9999": 0,
                                "commentCount|1-9999": 0,
                                "shareCount|1-9999": 0,
                                "followCount|1-9999": 0,
                                "commentUrl": "string"
                            },
                            "mediaName": "视讯网",
                            "lastUpdateTime": 1594095604488
                        },
                        {
                            "articleId": "86492982583296",
                            "articleType": "NEWS",
                            "state":"ENABLED",
                            "title": "国际实业2020年上半年预计净利5500万元-7500万元 同比增长378.70%-552.77%",
                            "cover": [
                                {
                                    "url": "http://img.9liuda.com/image/202007/07/e7a1c023f5b727ee54cf24ee92027b1d",
                                    "width": 561,
                                    "height": 224
                                }
                            ],
                            "mediaName": "快看",
                            "lastUpdateTime": 1594095987922
                        },
                        {
                            "articleId": "86492982583296",
                            "articleType": "VIDEO",
                            "state":"ENABLED",
                            "title": "创业板指重回2600点 两市半天成交额再破万亿",
                            "video": [
                                {
                                    "url": "http://vjs.zencdn.net/v/oceans.mp4",
                                    "videoFirstFrameUrl": "https://bpdev.sinosun.com:18195/static/hotel/assets/oceans_Moment.jpg",
                                    "width": 700,
                                    "height": 323
                                }
                            ],
                            "statistics": {
                                "upCount|1-19999": 0,
                                "downCount|1-99": 0,
                                "commentCount|1-9999": 0,
                                "shareCount|1-9999": 0,
                                "followCount|1-9999": 0,
                                "commentUrl": "string"
                            },
                            "mediaName": "视讯网",
                            "lastUpdateTime": 1594095604488
                        },
                        {
                            "articleId": "86492982583296",
                            "articleType": "VIDEO",
                            "state":"ENABLED",
                            "title": "创业板指重回2600点 两市半天成交额再破万亿",
                            "video": [
                                {
                                    "url": "https://video.da.mgtv.com/new_video/2020/06/02/1765/B925F01229D362FFC7B276E2EA7C8027_20200602_1_1_686.mp4",
                                    "videoFirstFrameUrl": "https://bpdev.sinosun.com:18195/static/hotel/assets/videoImg.jpg",
                                    "width": 700,
                                    "height": 323
                                }
                            ],
                            "statistics": {
                                "upCount|1-99999999": 0,
                                "downCount|1-9999": 0,
                                "commentCount|1-9999": 0,
                                "shareCount|1-9999": 0,
                                "followCount|1-9999": 0,
                                "commentUrl": "string"
                            },
                            "mediaName": "视讯网",
                            "lastUpdateTime": 1594095604488
                        },
                        {
                            "articleId": "86492982583296",
                            "articleType": "NEWS",
                            "state":"ENABLED",
                            "title": "国际实业2020年上半年预计净利5500万元-7500万元 同比增长378.70%-552.77%",
                            "cover": [
                                {
                                    "url": "http://img.9liuda.com/image/202007/07/e7a1c023f5b727ee54cf24ee92027b1d",
                                    "width": 561,
                                    "height": 224
                                },
                                {
                                    "url": "http://img.9liuda.com/image/202007/07/e7a1c023f5b727ee54cf24ee92027b1d",
                                    "width": 561,
                                    "height": 224
                                },{
                                    "url": "http://img.9liuda.com/image/202007/07/e7a1c023f5b727ee54cf24ee92027b1d",
                                    "width": 561,
                                    "height": 224
                                }
                            ],
                            "mediaName": "快看",
                            "lastUpdateTime": 1594095987922
                        }
                    ]
                }
            }
        });
        /**
         * 查询资讯详情
         */
        if(true){
            mockDataArray.push({
                urlRegExp: /content\/v1\/getArticle/,
                urlType: "get",
                mockRes: {
                    resultCode: 0,
                    resultMessage: "success",
                    result: {
                        "articleId": "86492982583296",
                        "articleType": "VIDEO",
                        "title": "国际实业2020年上半年预计净利5500万元-7500万元 同比增长378.70%-552.77%",
                        "news": "<div> \n <p class=\"xti\">挖贝网7月6日消息，国际实业（000159）发布2020年半年度业绩预告：去年预计盈利5500万元—7500万元，上年同期盈利1148.95万元，同比增长378.70%—552.77%。<\/p> \n <div class=\"tit\">\n  <img src=\"https:\/\/img.9liuda.com\/image\/202007\/07\/e7a1c023f5b727ee54cf24ee92027b1d?imageMogr2\/auto-orient\/interlace\/1\/format\/jpg\/thumbnail\/500x\/size-limit\/$(fsize)\" width=\"561\" height=\"224\" \/>\n <\/div> \n <p class=\"itt\">国际实业称，业绩变动原因说明：<\/p> \n <p class=\"ttt\">报告期业绩较上年同期增加，主要为处置加油站资产的净收益约2500万元，证券投资的公允价值变动损益及投资收益的净利润影响额约2900万元，上述为非经常性损益,同时归属上市公司股东的扣非后净利润约1000余万元。<\/p> \n <p class=\"ttt\">资料显示，国际实业主要从事成品油及化产品的采购、批发、仓储、销售业务，经营模式主要自中石化等上游生产企业采储成品油及化产品，向下游客户销售，并向客户提供罐区仓储服务。<\/p> \n <p class=\"ttt\">来源链接：http:\/\/www.cninfo.com.cn\/new\/disclosure\/detail?plate=szse&amp;orgId=gssz0000159&amp;stockCode=000159&amp;announcementId=1208008035&amp;announcementTime=2020-07-07<\/p> \n <p class=\"ttx\">苏言<\/p>\n<\/div>",
                        "cover": [
                            {
                                "url": "http://img.9liuda.com/image/202007/07/e7a1c023f5b727ee54cf24ee92027b1d",
                                "width": 561,
                                "height": 224
                            }
                        ],
                        "video": [
                            {
                                "url": "https://video.da.mgtv.com/new_video/2020/06/02/1765/B925F01229D362FFC7B276E2EA7C8027_20200602_1_1_686.mp4",
                                "videoFirstFrameUrl": "https://bpdev.sinosun.com:18195/static/hotel/assets/videoImg.jpg",
                                "width": 700,
                                "height": 323
                            }
                        ],
                        "statistics": {
                            "upCount|1-99999999": 0,
                            "downCount|1-9999": 0,
                            "commentCount|1-9999": 0,
                            "shareCount|1-9999": 0,
                            "followCount|1-9999": 0,
                            "commentUrl": "string"
                        },
                        "mediaName": "快看",
                        "lastUpdateTime": 1594095987922
                    }
                }
            });
        }
    }
    return mockDataArray;
}
