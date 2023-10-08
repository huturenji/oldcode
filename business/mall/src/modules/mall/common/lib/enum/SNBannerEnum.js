

//首页的banner图片
//imgUrl banner图片的imgUrl
//path 点击banner图片，跳转的地址
//bgColor banner切换后对应的背景色
export const bannerList = [ 
    {
        imgUrl: require('../../../../../themes/default/img/index/banner/bg_home_zhichangbangong.png'),
        path:'/product/list',
        bgColor: 'rgb(171,191,203)',
        query:{
            keyWords:'办公用品',
            t: new Date().getTime()//增加时间戳，保证session中的判断都是forward
        }
    },
    {
        imgUrl: require('../../../../../themes/default/img/index/banner/bg_home_laobanfu.png'),
        path:'/product/list',
        bgColor: 'rgb(131,203,203)',
        query:{
            keyWords:'礼品',
            t: new Date().getTime()//增加时间戳，保证session中的判断都是forward
        }
    },
    {
        imgUrl: require('../../../../../themes/default/img/index/banner/bg_home_kangyi.png'),
        path:'/product/list',
        bgColor: 'rgb(162,184,231)',
        query:{
            keyWords:'防护',
            t: new Date().getTime()//增加时间戳，保证session中的判断都是forward
        }
    },
    {
        imgUrl: require('../../../../../themes/default/img/index/banner/bg_home_guanfangzhengpin.png'),
        path:'/product/list',
        bgColor: 'rgb(181,223,207)',
        query:{
            keyWords:'酒',
            t: new Date().getTime()//增加时间戳，保证session中的判断都是forward
        }
    }
]


