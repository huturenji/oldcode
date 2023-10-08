import React from 'react';
import { Row, Col } from 'antd';
import ALibbSvg from '@/components/ALibbSvg';

// 图标展示
const Index = () => {

    const icons = ["huiyuanzhongxin","tongjizhongxin","xuanzhong1","shuaxin2","rili","shangsheng","xiajiang","chengjiaozhuanhua","huizong","liulanfangwen","jinrishishi","liuliangfenxi","AK-PX_kepaixu","youxiang","pingfen","wen1","shangpinfenxi","shuaxin","a-dianhua01","shishifenxi","jiaoyifenxi","yonghufenxi","xuanzhongshangpin","shanchushangpin","drxx70","yinlian","yonghu","huiyuan1","gengduo1","changjianwenti","biaoqing","drxx106","tupian3","bianji2","shanchu7","shanchu6","xinxi3","ziyuan115","daoru","yanzhengma2","ziyuan114","zhanshi","shangpinzhanshi","kuaijiehuifu","kuaijiehuifu1","zhuanjie","yanzhengma","tupian2","kuaijiehuifu1-copy-copy","ziyuan113","cuowutishi","piliangshanchu2","fabu1","daijiesuanjine","ziyuan86","ziyuan84","ziyuan85","ziyuan83","ziyuan80","ziyuan27","ziyuan261","ziyuan251","ziyuan241","ziyuan221","ziyuan231","ziyuan20","ziyuan211","ziyuan181","ziyuan191","ziyuan112","ziyuan26","lianxi","sousuo3","mima1","zhanghao1","lianxikefu1","shenhetongguo","quxiaotuijian2","shenhejujue","glsz","nav-tuijian","shanchu3","fabu21","zhanghu","mima","yanzheng","guanzhu-copy","guanzhu","jiantou","pintu","lianxikefu","fangxingxuanzhong","pintu1","guanzhu1","yikaitong","gengduo","xieyi","gongyingshang","kaitongkecheng","caiwu","wuliu1","shouhou","zhanghao","wenti","fujian","jiesuan","dianpu","gaikuang","dianpu1","tengxunyunjiejuefangan_yewuchangjing_quanzhanjiejuefangan_hangyejiejuefangan_zhuanxiangjiejuefangan-tengxunyun-","cuxiao","zhanghaoguanli","baoyou2","dingdan","shouhou1","ziyuan110","ziyuan57","ziyuan58","ziyuan52","ziyuan31","ziyuan25","1","xinzeng1","ziyuan18","tongzhi1","yijujue","all","sousuo2","wuliu","fabu2","xitong","shishijiankong1","tongzhi11","baokuantuijian","ziyuan33","shangchengzhuangxiu","xitong11","shangcheng","gouwuche1","yunying1","ziyuan12","jiahao","xiaoxi","saoyisao","ziyuan24","fanhui1","fanhuishangji","dayoutubiao_fanhui","goods","weigui","activeHome-copy-copy-copy","iconbiaoji","ziyuan23","piliangshanchu","piliangshanchu1","daochu1","fabu1-copy","daochu1-copy","piliangshangjia","piliangxiajia","xinzeng","qiyong1","jinzhi","gouwuche","bukejian11","xiayi1","xiayi","kejian","shoppingCart","tupian1","2","bofang11","guanbi4","shangyi1","bukejian1","guanbi3","shangyi","ziyuan121","ziyuan22","ziyuan3","ziyuan4","ziyuan8","ziyuan1","ziyuan71","ziyuan5","ziyuan6","ziyuan91","ziyuan111","ziyuan10","ziyuan13","ziyuan15","ziyuan17","ziyuan16","ziyuan14","ziyuan19","shanchu5","sousuo","iconjia","duoxuan","lianjie","move-up1","shangpinguanli","add-sy","bianji1","yixuan","duoxuan1","ziyuan2","ziyuan51","ziyuan11","ziyuan43","ziyuan21","daoru1","xitongguanli","yunyingguanli","xitongpeizhi","cangkuguanli1","shangchengguanli2","add-fill","cuxiaohuodong-","cuxiaohuodong-2","jifen-","jifen-1","jifen-2","jifen-3","jifen-4","jifen-5","jifen-6","jifen-7","jifen-8","jifen-9","jifen-10","jifen-11","cuxiaohuodong-manjiusong","daipingjia","shenhetongguo2","tuangou","xujiapei","shangpin","dingdanguanli","man","huiyuan","iconfonttuijianren","bianzu","qinglihuancun1","duihao","disanfangzhanghaoguanli1","erweima","tishi1","erweima1","wen","fenlei2","guanggao","fenlei1","shuaxin1","tishi2","dingdanjine1","yunfei","daochu2","daochu","AD-","quanxian","shouji1","tongzhi","guanbi","arrow-left-copy-copy","guanbi1","tianjia","yincangdaan1","xitong1","xia1","move-up","shanchu4","notice","phone","xianshihongtou-henji","unie621","xiangshang","yunying","shouji","diannao","tishi","qiyeruzhu","yudingchenggong","shangpinjibenxinxi","jinyong1","jujue1","tuihuanhuo","xiangqing1","xiangxia","jujue","shenhetongguo1","review","jifen","tuijian","zhiding","pinglun3-copy","ai53","fukuan","zhanghuyue","yishoukuan","fuzhi","ic_paid","zhuangxiu","duizhang","pingtaishenhe","xiangqing","zhongzhi-","xiugaimima","quxiaotuijian1","huodong","iconddsho","fahuo","xiajicaozuo","qiyong","shensushenpi1","shanchu2","fafang","fabu","xiajia","shangjia1","shoukuanguanli","icon_tingzhi","ziyuan","bianji","chehuisekuai","hedui","queren","shenhetijiao","shousuo","zhankai","chakan","shoukuan","shangchengguanli","shangjia","tijiaoshenhe","sousuo1","fenlei","shouyegouwuche","xiajiantou","edit","shanchu1","tupian","jia","fanhui","xiala","qingchu","xuanzhong","xinzengzuyuan","xinzengfenlei","kefu","tianjialouceng1","baocun","quxiaotuijian","fanhuiliebiao","shanchu","xiajiashangpin","tuijianxiangmu","shouyekaipingtu","querenshoukuan"];


    return (
        <div>
            <Row>
                {
                    icons.map((item,index)=><Col span={3} key={index} style={{textAlign:'center'}}>
                        <ALibbSvg fill="#FC701E" width={40} height={40} type={item} />
                        <p style={{overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{item}</p>
                    </Col>) 
                }
            </Row>
        </div>
    )
}

export default Index;
