<template>
<div class="hotelDetail" :key="hid">
    <wrapperHotelDetail v-if="isLoading"></wrapperHotelDetail>
    <div v-if="!isLoading">
        <div class="swiperWrap cursorp" @click="gotoHotelImgList">
            <swiper :list="imgShowList" v-model="imgIndex"
                :min-moving-distance="120" @on-index-change="onIndexChange" ></swiper>
            <div class="tipsText">
                <div class="tipsWrap">
                    <span class="numwrap" v-if='0!=hotelInfo.commentScorer||".0"!=hotelInfo.commentScorer'><span class="bigNum num-font">{{hotelInfo.commentScorer*10}}</span>%好评率</span>
                    <span class="numwrap" v-else>暂无评论</span>
                    <span>{{hotelInfo.commentContentNum || 0}}人评论</span>
                    <!-- <Icon v-if="!inwxmini" type='icon_common_rightarrow' class="numwrapRight" size=".2"/> -->
                </div>
            </div>
            <!-- <div class="tipsType" :class="'star'+hotelInfo.Star">{{starLevelListMap[hotelInfo.Star] || 其他}}</div> -->
            <div class="tipsNum"><Icon type='icon_common_picture' class="imgNum" size=".24"/>{{imgList.length}}</div>
        </div>
        <HotelItem :hotel='hotelInfo' :hid='hid' :serviceList="serviceList" :locationPoint='locationPoint' :isLocationCity="isLocationCity"/>
        <hotelDate @click.native="selectCalendar" class="hotelDate cursorp" :inDate='inDate' :outDate='outDate' :inDays='inDays'/>
        <!--房间的筛选标签-->
        <div class="tagFilter">
            <div class="tagItem cursorp" v-for="(item,index) in hotelTags" :key="index" @click='filterRoomList(index)'>
                <span v-if="item.checked" class="selected">{{item.key}}</span>
                <span v-else>{{item.key}}</span>
            </div>
        </div>
        <MyTripList ref="myTripList" v-model="myTripModelData" :departDate='departDate' :initTripNo="initTripNo"></MyTripList>
        <hotelRoom v-show='hasRoomData' ref="room" v-for="(item,index) in rooms" :key="index" @showBooking='showBooking' @openApplyFun='openApply' :roomIndex='index' :room="item" :myTripModelData='myTripModelData'/>
        <EmptyX v-show="!hasRoomData" class="noroom" :styleType="'top'" tipsText='未找到符合要求的房型'/>
        <div v-transfer-dom>
            <popup v-model="roomInfoShow" max-height="80%" is-transparent>
                <hotelReserve @touchmove.prevent @scroll.prevent :room='roomInfo' :roomInfoShow="roomInfoShow" :productIndex='productIndex' :roomIndex='roomIndex' @openApplyFunFromRserver='openApply' @showRoomproduct='showRoomProducts' @close="roomInfoShow=false" :service='service' :myTripModelData='myTripModelData'/>
            </popup>
        </div>
        <div class="recommendWrap" v-if="0 < similarHotelList.length">
            <div class="recommendTit">相似酒店推荐</div>
            <div class="recommendright cursorp" @click="gotoRecommendList">{{similarHotelListData.length}}家</div>
        </div>
        <div class="recommenHotelWrap" v-if="0 < similarHotelList.length">
            <HotelRecommen class="cursorp" v-for="(item,index) in similarHotelList" :key="index" @click.native='openDetail(item)' :hotel="item" :locationPoint="{'lat':hotelInfo.lat,'lng':hotelInfo.lng}"/>
        </div>
        <!--<div class="rightWrap" v-if='hotelInfo.hoteTel'>
            <div class="text">酒店电话</div>
            <div class="right">{{hotelInfo.hoteTel}}</div>
        </div>-->
    </div>
        
    <div v-transfer-dom>
        <popup v-model="showHotelCalendar" position="bottom" :show-mask="true" hide-on-blur style="min-height: 8rem;background: #ffffff ">
            <div class="calendar">
                <CalendarNewX ref="hotelCalendar" @commitDate="chooseDate" :displayMode="displayMode" :markedRange='rangeDate'></CalendarNewX>
            </div>
        </popup>
    </div>
</div>
</template>

<script>
import hotelHandler from 'hotelHandler/hotelHandler.js'
import HotelItem from 'hotelComponent/hotelcomp/HotelItem.vue';
import HotelDate from 'hotelComponent/hotelcomp/HotelDate.vue';
import HotelRoom from 'hotelComponent/hotelcomp/HotelRoom.vue';
import HotelReserve from "hotelComponent/hotelcomp/HotelReserve";
import HotelRecommen from 'hotelComponent/hotelcomp/HotelRecommen.vue';
import wrapperHotelDetail from 'hotelComponent/hotelcomp/wrapperHotelDetail.vue';
import MyTripList from 'components/trip/MyTripList.vue';
import {TransferDom,Popup,Swiper} from 'vux';
import CalendarNewX from "components/calendarNew/CalendarNewX.vue";
import EmptyX from "components/empty/EmptyX.vue";
// import LoadingX from "components/loading/LoadingX.vue";
import {hotelServerTypeList,hotelServerData} from '../../enum/hotelEnum.js';
import Icon from 'components/icon';
export default {
    mixins: [hotelHandler.mixin.tChatEventMixin],
    directives: {
        TransferDom
    },
    components: {
        EmptyX,Popup,Swiper,HotelItem,HotelDate,HotelRoom,HotelReserve,HotelRecommen,CalendarNewX,wrapperHotelDetail,MyTripList,Icon
    },
    data: function () {
        return {
            locationPoint:{},//当前位置
            hid:0,//酒店ID
            inDate:0,//入住时间
            outDate:0,//离店时间
            inDays:0,//入住天数
            imgList:[],//图片list
            imgShowList:[],//图片list展示用
            imgIndex:0,//图片索引
            roomInfoShow:false,//房型详情界面是否显示
            hotelInfo:{},//酒店数据对象
            rooms:[{}],//房型list，用于显示和业务操作
            similarHotelListData:[],//推荐相似酒店
            similarHotelList:[],//推荐相似酒店前四条用于详情展示
            roomSource:[{}],//房型list缓存数据源
            hasRoomData:true,//是否显示房间列表的DOM
            roomInfo:{},//房间信息
            productIndex:-1,//产品ID,-1表示为暂时房型信息，非-1时为产品信息
            roomIndex:0,//房间索引
            service:'',//酒店服务
            serviceList:[],//酒店服务列表，用于酒店详情展示
            isLoading:true,//数据请求中
            providerType:-1,//渠道商ID
            starLevelListMap: {//酒店星级map
                5: '豪华',
                4: '高档',
                3: '舒适',
                2: '其他',
                1: '快捷',
                0: '其他'
            },
            //房间的筛选标签
            hotelTags: [{
                checked: false,
                value: 1,
                key: '在线付'
            },
            {
                checked: false,
                value: 2,
                key: '到店付'
            },
            {
                checked: false,
                value: 3,
                key: '含早'
            },
            {
                checked: false,
                value: 4,
                key: '有返现'
            },
            {
                checked: false,
                value: 5,
                key: '立即确认'
            },
            {
                checked: false,
                value: 6,
                key: '大床房'
            }
            ],
            pageFrom:'',//页面跳转来源
            showHotelCalendar:false,//日历显示
            hotelCalendarIsShow:false,//酒店日历很快关闭的控制
            displayMode:4,//日历模式
            rangeDate:[],//日历默认时间
            departDate:'',//出发日期
            initTripNo:this.$route.query.tripNo || '',//页面初始化携带的tripNo
            myTripModelData:{
                'choosedTrip':'',
                'haveAuth':false,
                'tripListLength':0,
                'hotelUseType':this.$route.query.useType,
                'getAuthing':true
            },
            hotelServerTypeListData:hotelServerTypeList,//酒店服务类型数据
            hotelServerMap:hotelServerData,//酒店服务数据
            locationCity:'',//当前定位城市名
            isLocationCity:false,//是否是当前定位城市
            hotelImg:[],//储存到vuex的img
            inwxmini:hotelHandler.MINIPROGRAM_CONFIG.IN_MINIPROGRAM || false//是否微信小程序运行环境
        }
    },
    created: function () {
        let _this = this;   
        _this.initdata();
    },
    mounted: function () {},
    watch: {
        '$route': function () {
            let _this = this; 
            //酒店id变化才重新拉取数据
            if (!!_this.$route.query.hid && _this.$route.query.hid != _this.hid){
                _this.initdata();
            } 
        }
    },
    activated(){
    },
    methods: {
        /**
         * 艺龙图片使用https
         */ 
        changUrlToHttps(url){
            return hotelHandler.changUrlToHttps(url);
        },
        /**
         * 页面初始化
         */
        initdata:function(){
            let _this = this;   
            _this.getLocation();
            //数据获取
            if (hotelHandler.getSession('nextDirection')=='forward'){
                _this.myTripModelData.choosedTrip = _this.$route.query.tripNo || '';
            } 
            if (!!this.$route.query.pageFrom){
                this.pageFrom = this.$route.query.pageFrom;
            } 
            this.hid = this.$route.query.hid;
            let hotelSearchJson = {};
            if (!!hotelHandler.getStorage('hotelSearch')){
                hotelSearchJson = JSON.parse(hotelHandler.getStorage('hotelSearch'));
            }
            _this.myTripModelData.hotelUseType = _this.$route.query.useType;
            if (!!this.$route.query.inDate && (this.pageFrom == 'orderDetail' || this.pageFrom == 'orderSuc' || this.pageFrom=='customerService')){
                hotelSearchJson.inDate = parseInt(this.$route.query.inDate);
            }
            if (!!this.$route.query.outDate && (this.pageFrom == 'orderDetail' || this.pageFrom == 'orderSuc' || this.pageFrom=='customerService')){
                hotelSearchJson.outDate = parseInt(this.$route.query.outDate);
            }
            _this.inDate = parseInt(hotelSearchJson.inDate);
            _this.outDate = parseInt(hotelSearchJson.outDate);
            _this.departDate = new Date(parseInt(hotelSearchJson.inDate)).format('yyyy/MM/dd');
            _this.rangeDate = [new Date(parseInt(_this.inDate)).format('yyyy/MM/dd'),new Date(parseInt(_this.outDate)).format('yyyy/MM/dd')];
            setTimeout(()=>{
                _this.$refs.hotelCalendar.resetViewByRange();
            },300)
            _this.inDays = parseInt((hotelSearchJson.outDate - hotelSearchJson.inDate) / (24 * 60 * 60 * 1000));
            this.providerType = this.$route.query.providerType;
            this.isLoading = true;
            this.getHotelDetail(this.hid,this.inDate,this.outDate,this.providerType);
        },

        addHistory(){
            try {
                hotelHandler.addHistory({
                    name: this.hotelInfo.hotelName,
                    price: this.hotelInfo.minPrice,
                    img: this.hotelInfo.defaultPicture,
                    id: this.hid,
                    providerType: this.providerType
                })//新增访问历史
            } catch (e){
                console.error(e);
            }
        },
        /**
         * 打开图片list页面
         */
        gotoHotelImgList:function(){
            var _this = this;
            _this.$router.push({
                path:'/img', 
                query:{
                    hid:_this.hid,
                    inDate:_this.inDate,
                    outDate:_this.outDate,
                    providerType:_this.providerType
                }
            })
        },
        /**
         * 设置图片index
         * @index 索引
         */
        onIndexChange:function(index){
            var _this = this;
            _this.imgIndex = index;
            if (_this.imgShowList.length-1 == index && 2 < _this.imgShowList.length){ //切换至最后一页时跳转到图片列表页面，最少2张才跳转
                _this.gotoHotelImgList();
            }
        },
        /**
         * 查询酒店详情
         * @hid 酒店ID
         * @inDate 入住日期
         * @outDate 离店日期
         * @providerType 渠道商ID
         * 时间需要格式化
         */
        getHotelDetail:function(hid,inDate,outDate,providerType){
            if (!hid){
                return;
            }
            var _this = this;
            let key = 'hotelDetail'+hid+'_'+_this.$route.query.inDate+'_'+_this.$route.query.outDate;
            if (!!hotelHandler.getStorage(key) && ''!=hotelHandler.getStorage(key)){
                let res = JSON.parse(hotelHandler.getStorage(key));
                _this.afterGetHotelDetail(res);
                localStorage.removeItem(key)
                return;
            }
            hotelHandler.getHotelDetail({
                hid:hid,
                inDate:new Date(parseInt(inDate)).format('yyyy/MM/dd'),
                outDate:new Date(parseInt(outDate)).format('yyyy/MM/dd'),
                providerType:providerType,
                useType:_this.$route.query.useType
            }).then(function(res){
                if (0==res.resultCode){
                    _this.afterGetHotelDetail(res);
                }
            });
        },
        /**
         * 获取酒店详情之后的数据处理
         * @param {Object} hotel
         */
        afterGetHotelDetail(res){
            let _this = this;
            _this.isLoading = false;
            _this.$emit('showOff', true);
            _this.hotelInfo = res.result.hotelDetails;
            if (res.result&&res.result.hotelRooms){
                _this.rooms = (res.result.hotelRooms[0]||{}).rooms || [];
                //房型列表的数据源缓存
                _this.roomSource = _this.rooms;
            }
            _this.service = _this.hotelInfo.service;
            _this.serviceList = _this.hotelInfo.service.split(',') || [];
            _this.similarHotelListData = res.result.similarHotelList;
            hotelHandler.setStorage('similarHotelListData',JSON.stringify(res.result.similarHotelList));
            _this.similarHotelList = res.result.similarHotelList.slice(0,4);
            let imgTemp = res.result.dataPictures;   
            //处理酒店详情顶部图片list数据
            _this.imgList = [];
            let allImgList = [];
            for (var i=0,len=imgTemp.length;i<len;i++){
                for (var j=0,leng=imgTemp[i].pictureInfo.length;j<leng;j++){
                    _this.imgList.push({url: 'javascript:',img: _this.changUrlToHttps(imgTemp[i].pictureInfo[j].bigPic)});
                    allImgList.push({
                        msrc:_this.changUrlToHttps(imgTemp[i].pictureInfo[j].smallPic),
                        src: _this.changUrlToHttps(imgTemp[i].pictureInfo[j].bigPic),
                        title:imgTemp[i].pictureInfo[j].title,
                        w: 800,
                        h: 800
                    })
                }
            } 
            _this.imgShowList = _this.imgList.splice(0,5);
            if (1 < _this.imgList.length){
                _this.imgShowList.push({url: 'javascript:',img: './assets/img/hotel/allimg.png'});
            }
            //处理图片list页面数据
            let hotelImgList = [{type:0,pictureInfo:allImgList,imgsLeng:allImgList.length}];
            for (var index=0,le=imgTemp.length;index<le;index++){
                let imgArr = [];
                for (var jn=0,lengt=imgTemp[index].pictureInfo.length;jn<lengt;jn++){
                    imgArr.push({
                        msrc:_this.changUrlToHttps(imgTemp[index].pictureInfo[jn].smallPic),
                        src: _this.changUrlToHttps(imgTemp[index].pictureInfo[jn].bigPic),
                        title:imgTemp[index].pictureInfo[jn].title,
                        w: 800,
                        h: 800
                    })
                }
                hotelImgList.push({type:imgTemp[index].type,pictureInfo:imgArr,imgsLeng:imgArr.length});
            }    
            //存储图片list页面所需数据
            hotelHandler.setStorage('hotelImgList', JSON.stringify(hotelImgList));
            //存储酒店介绍页面所需数据
            hotelHandler.setStorage('hotelDetailInfo', JSON.stringify(res.result.hotelDetails));
            //执行筛选条件判断是否显示缺省信息
            _this.filterRoomList('',true);
            _this.addHistory();

        },
        /**
         * 打开酒店介绍
         */
        openIntroduction:function(){
            var _this = this;
            _this.$router.push({
                path:'/introduction' 
            })
        },
        /**
         * 打开房型详情
         * @room 房型信息
         */
        showBooking:function(room){
            let _this = this;
            if (room.roomInfo.roomStatus){
                hotelHandler.showToast('房间已定完，请选择其他房型');
                return;
            }
            _this.roomInfo = room.roomInfo;
            _this.productIndex = room.productIndex;
            _this.roomIndex = room.roomIndex;
            _this.roomInfoShow = true;
        },
        /**
         * 点击房间信息底部按钮打开房间产品列表
         * @roomIndex 房型索引
         */
        showRoomProducts(roomIndex){
            let _this = this;
            console.log(roomIndex)
            _this.roomInfoShow = false;
            // let index = 'room'+roomIndex;
            _this.$refs.room[roomIndex].toggleShow(true);
        },
        /**
         * 打开提交表单页面
         * @item 产品索引
         */
        openApply: function(item){
            hotelHandler.authHandler.moduleGate(async ()=>{
                let _this = this;
                let myTripData = _this.myTripModelData;
                if ((await hotelHandler.useTypeConfig(hotelHandler.USE_TYPE_SCENE.TO_ORDER)).isPublic(myTripData.hotelUseType) && !myTripData.getAuthing){ //因公且已经获取权限数据
                    if (myTripData.haveAuth){ //有特殊授权
                        if (myTripData.tripListLength == 0){ //无合法行程
                        } else if (myTripData.tripListLength > 0 && myTripData.choosedTrip == ''){ //有行程且未选择
                            hotelHandler.showToast('请先选择出差行程');
                            return;
                        }                       
                    } else if (myTripData.tripListLength == 0){ //无特殊授权
                        //无合法行程
                        _this.toTravelReq();
                        return;
                    } else if (myTripData.tripListLength > 0 && myTripData.choosedTrip == ''){ //有行程且未选择
                        hotelHandler.showToast('请先选择出差行程');
                        return;
                    }
                   

                }
                let index = item.index;
                _this.roomInfo = item.roomInfo;
                //处理酒店没有图片时跳转问题
                if (_this.imgShowList.length>0){
                    _this.hotelImg=_this.imgShowList[0].img
                } else {
                    _this.hotelImg=null
                }
                let hotelRoomInfo = {
                    roomInfo:_this.roomInfo,
                    productIndex:index,
                    service:_this.hotelInfo.service,
                    hotelImg:_this.hotelImg
                }
                hotelHandler.setStorage('hotelRoomInfo', JSON.stringify(hotelRoomInfo));
                _this.$router.push({
                    path:'/order/confirm', 
                    query:{
                        cityName:_this.$route.query.cityName,
                        hid:_this.hid,
                        providerType:_this.providerType,
                        inDate:_this.inDate,
                        outDate:_this.outDate,
                        inDays:_this.inDays,
                        tripNo:_this.myTripModelData.choosedTrip,
                        useType:_this.$route.query.useType,
                        roomName:_this.roomInfo.roomName,
                        hotelName:_this.hotelInfo.hotelName,
                        roomId:_this.roomInfo.roomId,
                        roomTypeId:_this.roomInfo.roomProducts[index].roomTypeId,
                        productId:_this.roomInfo.roomProducts[index].productId,
                        salePrice:_this.roomInfo.roomProducts[index].priceCalendar[0].salePrice,
                        totalPrice:_this.roomInfo.roomProducts[index].totalPrice,
                        settlePrice:_this.roomInfo.roomProducts[index].settlePrice,
                        returnCash:_this.roomInfo.roomProducts[index].perDayReturnCash*(_this.$route.query.inDays),
                        paymentType:_this.roomInfo.roomProducts[index].paymentType,
                        guaranteeType:_this.roomInfo.roomProducts[index].guaranteeType,
                        guaranteeRule:JSON.stringify(_this.roomInfo.roomProducts[index].guaranteeRule),
                        prepayRuleDesc:(_this.roomInfo.roomProducts[index].prepayRule||{}).description,
                        inventory:_this.roomInfo.roomProducts[index].inventory,
                        invoiceMode :_this.roomInfo.roomProducts[index].invoiceMode
                    }
                })
                this.roomInfoShow = false;
            })
        },
        /**
         * 打开审批申请页面
         */
        toTravelReq(){
            // let that = this;
            let appplyAddress = '';
            sinosdk.sino.overwriteWindowopen();
            hotelHandler.getApplyTravelUrl({}).then((res) => {
                if (!!res.result.approveTravelUrl ) {
                    appplyAddress = res.result.approveTravelUrl;
                }
                if (!!appplyAddress && '' != appplyAddress){
                    hotelHandler.hotelOpenPage(appplyAddress,'href');
                } else {
                    hotelHandler.showToast('还未设置出差申请地址，请前往运营后台设置');
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        /**
         * 按照Tag条件过滤房型列表
         * @param {Object} index 过滤条件
         */
        filterRoomList(index,initFilter){
            let _this = this;
            if (!!initFilter){
                let hotelTagslength = _this.hotelTags.length;
                for (var i=0;i<hotelTagslength;i++){
                    _this.hotelTags[i].checked = false;
                }
            } else {
                //在线付、到店付互斥
                if (0==index && !_this.hotelTags[index].checked){
                    _this.hotelTags[1].checked = false;
                }
                if (1==index && !_this.hotelTags[index].checked){
                    _this.hotelTags[0].checked = false;
                }
                _this.hotelTags[index].checked = !_this.hotelTags[index].checked;
            }
            var tagList = [];
            //遍历找出选中的筛选条件
            for (let ind = 0;ind<_this.hotelTags.length;ind++){
                if (_this.hotelTags[ind].checked){
                    tagList.push(_this.hotelTags[ind]);
                }
            }   
            var result = [];
            //如果有筛选条件，我们就遍历数据源筛选，
            if (!!tagList && tagList.length > 0){
                for (let ind=0;ind<_this.roomSource.length;ind++){
                    let room = JSON.parse(JSON.stringify(_this.roomSource[ind]));
                    room.roomProducts =[];
                    for (let k =0;k<_this.roomSource[ind].roomProducts.length;k++){
                        let roomPro = _this.roomSource[ind].roomProducts[k];
                        //这个字段标志某个房间数据在使用的筛选条件过程中是否有不满足条件的情况，默认为true。
                        let allTagFilterResult=true;
                        //所有的筛选条件结果默认为false不满足
                        for (let j=0;j<tagList.length;j++){
                            tagList[j].judgeResult = false;
                        }
                        //某个房间 遍历所有的筛选条件并且全部满足，才会进入筛选结果。
                        for (let j=0;j<tagList.length;j++){
                            //在线付
                            if (tagList[j].value == 1 && roomPro.paymentType == 1){
                            //满足某个条件即可，退出本层循环；
                                tagList[j].judgeResult = true;
                                continue;
                            }
                            //到店付
                            if (tagList[j].value ==2 && roomPro.paymentType == 0){
                                //满足某个条件即可，退出本层循环；
                                tagList[j].judgeResult = true;
                                continue;
                            }
                            //含早 早餐类型， 不含早，含早，单早，双早等
                            if (tagList[j].value ==3 && roomPro.breakfastType != '不含早'){
                                //满足某个条件即可，退出本层循环；
                                tagList[j].judgeResult = true;
                                continue;
                            }
                            //有返现,目前没有发现这种字段，我们使用价格日历里面的ReturnCash来处理。
                            if (tagList[j].value == 4 && !!roomPro.priceCalendarInfo){
                                for (let l=0;l<roomPro.priceCalendarInfo.length;l++){
                                    if (roomPro.priceCalendarInf[l].returnCash > 0){
                                        //满足某个条件即可，退出循环；
                                        tagList[j].judgeResult = true;
                                        l = roomPro.priceCalendarInfo.length;
                                        continue;
                                    }
                                }
                                continue;
                            }
                            //立即确认
                            if (tagList[j].value ==5 && roomPro.instantConfirmation){
                                //满足某个条件即可，退出本层循环；
                                tagList[j].judgeResult = true;
                                continue;
                            }
                            //大床房
                            if (tagList[j].value ==6 && (room.bedType.indexOf('大床') != -1 || room.roomName.indexOf('大床') != -1)){
                                //满足某个条件即可，退出本层循环；
                                tagList[j].judgeResult = true;
                                continue;
                            }
                            //如果走完了所有的可能性都没有赋值为真，说明不满足筛选条件，直接进入下一个房间的循环
                            if (!tagList[j].judgeResult){
                                allTagFilterResult = false;
                                j = tagList.length;
                                continue;
                            }
                        }
                        //只有满足筛选条件，才能赋值房间数据。
                        if (allTagFilterResult){
                            room.roomProducts.push(JSON.parse(JSON.stringify(roomPro)));
                        }
                    }
                    //如果RoomProducts有数据，增加本层级的room
                    if (room.roomProducts.length > 0){
                        result.push(room);
                    }
                }
            } else {
                //没有筛选条件，默认全部显示
                result =JSON.parse(JSON.stringify(_this.roomSource));
            }
            if (result.length > 0){
                _this.rooms = result;
                _this.hasRoomData = true;
            } else {
                _this.hasRoomData = false;
            }
        },
        /**
         * 获取定位
         */
        getLocation(){
            let _this = this;
            if (!!hotelHandler.getStorage('lng') && parseInt(hotelHandler.getStorage('lng')) > 0 ){
                _this.locationPoint = {
                    lng:hotelHandler.getStorage('lng'),
                    lat:hotelHandler.getStorage('lat')
                }
            }
            var onComplete = function(data){
                _this.locationCity = (data.addressObj.addressComponent.city || data.addressObj.addressComponent.province || '北京').replace('市', '');
                _this.isLocationCity = _this.$route.query.cityName == _this.locationCity;
                _this.locationPoint = {
                    lng:data.point.x || 0,
                    lat:data.point.y || 0
                }
            }
            var onError = function(){
                _this.locationPoint = {
                    lng:0,
                    lat:0
                }
            }
            hotelHandler.geoLocationByGaode(onComplete,onError);
        },
        /**
         * 打开酒店详情
         * @param {Object} hotel
         */
        openDetail:function(item){
            let _this = this;
            //统一收集数据
            let hotelObj = {
                hid:item.hotelId,
                inDate:_this.inDate,
                outDate:_this.outDate,
                inDays:_this.inDays,
                providerType:item.providerType,
                useType:_this.$route.query.useType,
                tripNo:_this.myTripModelData.choosedTrip,
                cityName:_this.$route.query.cityName
            }
            if (_this.$vux.loading.isVisible()){
                return;
            }
            //先查询酒店详情是否状态正常
            _this.$vux.loading.show({text: ''})
            hotelHandler.getHotelDetail({
                hid:hotelObj.hid,
                inDate:new Date(parseInt(hotelObj.inDate)).format('yyyy/MM/dd'),
                outDate:new Date(parseInt(hotelObj.outDate)).format('yyyy/MM/dd'),
                providerType:hotelObj.providerType,
                useType:hotelObj.useType
            }).then(function(res){
                _this.$vux.loading.hide();
                if (0==res.resultCode){
                    hotelHandler.setSession('forceDirection', 'forward');
                    let key = 'hotelDetail'+hotelObj.hid+'_'+hotelObj.inDate+'_'+hotelObj.outDate;
                    hotelHandler.setStorage(key,JSON.stringify(res));
                    _this.$router.push({
                        path:'/detail', 
                        query:{
                            hid: hotelObj.hid,
                            inDate:hotelObj.inDate,
                            outDate:hotelObj.outDate,
                            inDays:hotelObj.inDays,
                            tripNo:hotelObj.tripNo,
                            useType:hotelObj.useType,
                            providerType: hotelObj.providerType,
                            cityName:hotelObj.cityName
                        }
                    })
                }
            }).catch(()=>{
                //异常情况下由公共错误码进行提示
                _this.$vux.loading.hide()
            })           
        },
        gotoRecommendList(){                                  
            let _this = this;
            hotelHandler.setSession('forceDirection', 'forward');
            _this.$router.push({
                path:'/recommend', 
                query:{
                    inDate:_this.inDate,
                    outDate:_this.outDate,
                    inDays:_this.inDays,
                    tripNo:_this.myTripModelData.choosedTrip,
                    useType:_this.$route.query.useType,
                    cityName:_this.$route.query.cityName,
                    locationPoint:JSON.stringify({'lat':_this.hotelInfo.lat,'lng':_this.hotelInfo.lng})
                }
            })

        },
        /**
         * 打开选择时间组件
         * @type 业务类型
         */
        selectCalendar() {
            let that = this;
            let chooseDay = parseInt(that.inDate) / 1000;
            that.rangeDate = [new Date(parseInt(that.inDate)).format('yyyy/MM/dd'),new Date(parseInt(that.outDate)).format('yyyy/MM/dd')];
            setTimeout(()=>{
                that.$refs.hotelCalendar.resetViewByRange();
            },300)
            that.$refs.hotelCalendar.setDate(chooseDay);
            that.showHotelCalendar = true;
            that.hotelCalendarIsShow = false;
            setTimeout(()=>{
                that.hotelCalendarIsShow = true;
            },200)
        },
        /**
         * 酒店选择时间
         * @data 时间
         */
        chooseDate(data) {
            let _this = this;
            if (!_this.hotelCalendarIsShow){
                return
            }
            if (!data.startTime.getTime()) {
                hotelHandler.showToast('请选择正确开始时间')
                return;
            }
            _this.inDate = data.startTime.getTime();
            if (!data.endTime.getTime()) {
                hotelHandler.showToast('请选择正确结束时间')
                return;
            }
            _this.outDate = data.endTime.getTime();
            if (_this.inDate == _this.outDate) {
                hotelHandler.showToast('开始时间和结束时间不能是同一天')
                return;
            }
            let hotelSearch = {
                inDate:_this.inDate,
                outDate:_this.outDate
            }
            if (_this.pageFrom != 'orderDetail' && _this.pageFrom != 'orderSuc'){
                hotelHandler.setStorage('hotelSearch', JSON.stringify(hotelSearch));
            }
            _this.inDays = parseInt((_this.outDate - _this.inDate) / (24 * 60 * 60 * 1000));
            _this.showHotelCalendar = false;
            _this.getHotelDetail(_this.hid,_this.inDate,_this.outDate,_this.providerType);
            _this.departDate = new Date(parseInt(_this.inDate)).format('yyyy/MM/dd');
            //window.opener.rereadHotel();
        },
        /**
        * 维数组是否包含元素
        */
        arrhaveitem(item, arr, key) {
            // let _this = this;
            var isInArr = false;
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (!!key ? arr[i][key] == item : arr[i] == item) {
                    isInArr = true;
                    break;
                }
            }
            return isInArr;
        },
        /**
        * 元素在数组中的索引
        */
        indexOfArr(val, arr, key) {
            for (var i = 0; i < arr.length; i++) {
                if (!!key ? arr[i][key] == val : arr[i] == val) {
                    return i;
                }
            }
            return -1;
        },  
        /**
        * 前往评论详情页面
        */
        showComments:function(){
            if (!this.inwxmini){
                window.open('index.html#/comments?hid='+this.hid)
            }
        },  
        /**
        * T信回退事件的注册回调 必须是goBackFun
        */
        goBackFun(){
            let _this = this;   
            if (_this.showHotelCalendar) {
                _this.showHotelCalendar = false;
            } else if (_this.pageFrom=='orderSuc'){
                hotelHandler.closePage('');
            } else if (_this.pageFrom=='customerService'){
                hotelHandler.closePage('');
            } else if (_this.$route.query.close==1){
                hotelHandler.closePage('');
            } else {
                _this.hid = null;//保活时返回上一个页面，把酒店id清空，否则下次进这个酒店，数据就不会刷新了
                _this.$router.back(); 
            }
        }              
    }
}
</script>
<style lang="less">
  @import './hotelDetail.less';
</style>
