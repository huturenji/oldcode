<template>
<div class="content_box">
    <headBreadcrumb
        title="补充商品"
        :showbtn="false"
        @goback="gotoBack"
    ></headBreadcrumb>
    <div class="warp">
        <div class="title_tab" v-if='onLineShow'><span class="title_line"></span><span>线上奖品</span></div>
        <div class="prize" v-if='onLineShow'>
            <div v-for="(item, index) in prizeOnLine" :key="index" class="goodsWarpItem">
                <div class="prizeNum" v-if="!!item.gradeName">{{item.gradeName}}</div>
                <div class="prizeNum" v-else>奖品{{activityNum(index)}}</div>
                <div class="prizeDetail" v-if="item.type=='1'">
                    <div class="prizeName">
                        <div class="prizekey">奖品名称</div>
                        <div class="prizeval">{{item.name}}</div>
                    </div>
                    <goodsItem
                        :good = item
                        @changeNum="changeNum(item)"
                    ></goodsItem>
                    <div class="prizeName">
                        <div class="prizekey">奖品图片:</div>
                        <el-image class="img" :src="item.imgUrl | urlFilter" lazy fit="cover" v-if='item.mainImage!=item.imgUrl'>
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                        <div v-else>
                            未上传
                        </div>
                    </div>
                    <div class="prizeName">
                        <div class="prizekey">兑奖方式:</div>
                        <div>{{exchangeType[item.exchangeType]}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="title_tab" v-if='offLineShow'><span class="title_line"></span><span>线下奖品</span></div>
        <div class="prize" v-if='offLineShow'>
            <div v-for="(item, index) in prizeOffLine" :key="index" class="goodsWarpItem">
                <div class="prizeNum" v-if="!!item.gradeName">{{item.gradeName}}:{{offPrizeType[item.offPrizeType]}}</div>
                <div class="prizeNum" v-else>奖品{{activityNum(index)}}:{{offPrizeType[item.offPrizeType]}}</div>
                <div class="prizeDetail">
                    <div class="prizeName">
                        <div class="prizekey">奖品名称:</div>
                        <div>{{item.name}}</div>
                    </div>
                    <div class="prizeName">
                        <div class="prizekey">奖品图片:</div>
                        <el-image class="img" :src="item.imgUrl | urlFilter" lazy fit="cover">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </div>
                    
                    <div class="prizeName" style="align-items:center">
                        <div class="prizekey">奖品数量:</div>
                        <el-input-number size="mini" v-model="item.addCount" @change="changeNum(item)" :min="0" label="奖品数量"></el-input-number>
                    </div>
                    <div class="prizeName">
                        <div class="prizekey">兑奖方式:</div>
                        <div>{{exchangeType[item.exchangeType]}}</div>
                    </div>
                    <div class="prizeName" v-if="item.exchangeUrl">
                        <div class="prizekey">领取链接:</div>
                        <div class="prizeurl">{{item.exchangeUrl}}</div>
                    </div>
                    <div class="prizeName" style="align-items:center" v-if="item.exchangeType==4">
                        <div class="prizekey_code">兑换码:</div>
                        <div>
                            <el-upload
                                class="upload-demo"
                                slot="component"
                                :before-upload="(file)=>beforeAvatarUpload(file,item)"
                                :on-remove="(file, fileList)=>removeVoucher(file, fileList,item)"
                                :on-error="uploaderror"
                                :file-list="item.voucherList">
                                <el-button size="small" type="primary" icon="el-icon-upload2">请选择文件</el-button>
                                <span slot="tip" class="upload__tip" @click="downTemplate(item.offPrizeType)">下载模板</span>
                            </el-upload>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div class="goWarp">
        <div class="priceWarp" v-if="prizes[0].type=='1'">
            <div>线上商城商品待结算金额：</div>
            <div class="price">￥</div>
            <div class="price num">{{totalPrice.toFixed(2)||"0.00"}}</div>
        </div>
        <div class="button">
            <el-button type="primary" @click='gonext'>提交</el-button>
        </div>
    </div>
</div>
</template>
<script>
import { utils,cloudservices, eventlistenerhandler } from "opcl";
import apihandler from "bislibs/requestHandler/activityhandler";
import { allbuildinIcons } from "bislibs/home/newlottery-lifecycle";
import { downLoad_front } from "bislibs/utils/index";
const headBreadcrumb = () => import("biscomponents/activity/head-breadcrumb.vue");
const goodsItem = () => import("biscomponents/activity/goodsitem.vue");
export default {
    components: {
        headBreadcrumb,goodsItem
    },
  data() {
    return {
      prizes:JSON.parse(utils.getStorage("customer_prizes")),
      prizelist:[],
      prizeOnLine:[],   // 线上商品
      prizeOffLine:[],  // 线下商品
      goodsNum:[
        {key:0,value:'一'},
        {key:1,value:'二'},
        {key:2,value:'三'},
        {key:3,value:'四'},
        {key:4,value:'五'},
        {key:5,value:'六'},
        {key:6,value:'七'},
        {key:7,value:'八'},
        {key:8,value:'九'},
        {key:9,value:'十'},
        {key:10,value:'十一'},
        {key:11,value:'十二'}
      ],
      offPrizeType:{
        '1':'商云优惠券',
        '2':'实物奖品',
        '3':'虚拟奖品',
        '4':'商云红包'
      },
      exchangeType:{
        '1':'在线领取',
        '2':'线下领取',
        '3':'邮寄',
        '4':'凭兑奖码领取'
      },
      totalPrice:0,
      totalNum:0
    };
  },
  created() {},
  mounted() {
    this.prizelist = this.prizes.map((item)=>{
        return {
            id:item.prizeId,
            gradeName:item.gradeName,
            addCount:"0",
            skuName:item.skuName||"",
            name:item.name,
            imgUrl:item.imgUrl,
            type:item.type,
            price:item.price,
            mainImage:item.mainImage,                // sku的主图  线上商品
            offPrizeType:item.offPrizeType ||'1',   // 1-商云优惠券；2-实物奖品；3-虚拟奖品
            exchangeType:item.exchangeType||'4',   // 兑换方式：1-在线领取；2-线下领取；3-邮寄；4-凭兑奖码领取
            exchangeUrl:'',   // 领取链接
            voucherList:[],   // 前端上传显示数据
            voucherCodeUrl:'' // 上传的url
        }
    })
    this.prizeOnLine = this.prizelist.filter((item)=>item.type==1)
    this.prizeOffLine = this.prizelist.filter((item)=>item.type==2)

    
    // console.log(this.prizeOnLine,this.prizeOffLine)
  },
  computed:{
    onLineShow(){
        return  this.prizeOnLine.length>0
    },
    offLineShow(){
        return  this.prizeOffLine.length>0
    }
  },
  filters:{
    urlFilter(val){
            if(val.indexOf('http')>-1){
                return val
            }else{
                let ele = allbuildinIcons.find((item)=>item.key == val)
                return ele.src
            }

        }
  },
  methods: {
    activityNum(numindex){
        let num = ''
        num = this.goodsNum.filter(item=>item.key==numindex)[0].value
        return num
    },
    changeNum(num){
        let list = this.prizelist
        let totalPrice = 0,totalNum = 0
        for (let i = 0; i < list.length; i++) {
            totalNum += list[i].addCount
            if(list[i].type=="1") totalPrice += list[i].addCount*list[i].price
        }
        this.totalPrice = totalPrice
        this.totalNum = totalNum
        // console.log(list)

    },
    beforeAvatarUpload(file,target){
         const type = file.type
        //  console.log(type)
         if(type=="application/vnd.ms-excel"){
            this.manualUpload(file,target)
         }else{
            utils.showToast("请选择正确的文件格式")
         }
          return false
        //   return this.autoUpload();
         
    },
    manualUpload(file,target) {
            file.businessType = "agreement";
            file.uid = new Date().getTime();
            cloudservices
                .upload2Ceph('/activitystudio/presign/v1/getUploadUrl',[file])
                .then((allRes) => {
                   file.url = allRes[0].downLoadUrl
                   target.voucherCodeUrl = allRes[0].downLoadUrl
                   target.voucherList = [file]
                })
                .catch(() => {
                   target.voucherList = []
                   target.voucherCodeUrl = ''
                });
    },
    removeVoucher(file, fileList,target){
        if(file){
            target.voucherList = []
            target.voucherCodeUrl = ''
         }
    },
    uploaderror(err, file, fileList){

    },
    downTemplate(type){
        let fileTypeMap = {
            '1': "coupon_code",
            '3': "exchange_code",
            '4': "redpacket_code"
        }
        downLoad_front(fileTypeMap[type]);
    },
    gotoBack(){
        this.$router.go(-1)
    },
    gonext(){
        let that = this;
        let errInfo = [];
        let arr = that.prizelist.filter((item)=>{
            return item.addCount>=1
        })
         // 如果是线下 并且兑换方式 是凭兑奖码领取exchangeType为4的 需要校验voucherUrl为必填
        that.prizeOffLine.map((item,index)=>{
            if(item.addCount>=1 && item.type=='2' && item.exchangeType=='4'&& item.voucherCodeUrl=='' ){
                errInfo.push(`线下奖品${that.activityNum(index)},请上传兑换码`)
            }
        })
        if(errInfo.length>0){
            utils.showToast(errInfo.join(';'));
            return false
        }
        let addPrizeCountVOS = arr.map((item)=>{
            return {
                "addCount": item.addCount,
                "id": item.id,
                "voucherUrl": item.voucherCodeUrl?item.voucherCodeUrl:''
            }
        })
        let reqData = {
            activityId:utils.getStorage("customer_activityId"),
            addPrizeCountVOS:addPrizeCountVOS,
            // "channelId": "",
            // "companyId": "",
            "userId": apihandler.userInfo.userId,
        }
        if(that.totalNum<=0){
            utils.showToast("请补充至少一件商品");
        }else{
            that.$iLoading.show();
            apihandler
            .addPrize(reqData)
            .then((res) => {
                if (!!res && res.resultCode == 0) {
                    utils.showToast("补充成功");
                    that.$router.push({
                        path: "/activity/addsuccess",
                        query: {
                            orderId: !!res.result?res.result.orderId:""
                        }
                    });
                }else{
                    utils.showToast("补充失败");
                }
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                that.$iLoading.hide();
            });
        }
    }
  },
};
</script>
<style lang="less" scoped>
@import "~styles/common.less";
.title_tab{
    margin-top: 24px;
    display: flex;
    align-items: center;
    color: #1d2129;
    font-size: 18px;
    font-weight: bold;
    .title_line{
        width: 4px;
        height: 16px;
        margin-right: 8px;
        background: #409eff;
    }
}
.warp{
    padding: 0px 25px 10px;
    background: #fff;
    margin-bottom: 90px;
    .prize{
        // 这里采用grid布局，flex布局需要添加隐藏item占位才能保持样式正常
        // display: flex;
        // flex-wrap: wrap;
        // justify-content: space-between;

        display: grid;
        grid-template-columns: repeat(3,32%);
        grid-gap: 2%;
        .goodsWarpItem{
            border: #e4e4e4 1px solid;
            margin-top: 17px;
        }
        .prizeNum{
            padding: 10px;
            font-size: 18px;
            font-weight: bold;
            border-bottom: #e4e4e4 1px solid;
        }
        .prizeDetail{
            padding: 0 10px;
            .prizeName{
                display: flex;
                margin: 15px 0;
                flex: 0 0 auto;
                .prizekey{
                    width: 70px;
                }
                .prizekey_code{
                    width: 90px;
                }
                .prizeurl{
                    word-break: break-word;
                    flex: 1;
                }
                .prizeval{
                    max-width: 328px;
                    text-align: justify;
                    word-break: break-all;
                    text-overflow:ellipsis;
                    display: -webkit-box; 
                    /*!autoprefixer:off;*/
                    -webkit-box-orient: vertical; 
                    -webkit-line-clamp: 2; 
                    overflow: hidden; 
                }
            }
            .img{
                width: 70px;
                height: 70px;
            }
            .img .el-icon-picture-outline{font-size: 70px;}
        }
        .upload__tip{
            margin-left: 5px;
            color: #478aee;
            cursor: pointer;
        }
    }
    
}
.goWarp{
    box-shadow:#e4e4e4 5px 5px 5px 5px;
    // text-align: center;
    width: calc(100% - 200px);
    height: 80px;
    position: fixed;
    bottom: 0;
    left: 200px;
    right: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    .priceWarp{
        position: absolute;
        left: 0;
        display: flex;
        margin-left: 95px;
        div{
            height: 30px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }
        .price{
            color: red;
        }
        .num{
            font-size: 18px;
        }
    }
    .button{
        display: flex;
        div{
            width: 100px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border: 1px solid #e4e4e4;
            border-radius: 5px;
            margin-left: 20px;
            cursor: pointer;
        }
        .firstBtn{
            background-color: #fff;
        }
    }
}
</style>