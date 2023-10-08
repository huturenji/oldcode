<template>
<div class="recommendList">
    <HotelList v-for="(item,index) in hotelList" :key="index" class="cursorp" @click.native='openDetail(item.hotelId, item.providerType)' :hotel="item" :locationPoint='locationPoint' :isrecommendList='true'/>
    <LoadingX v-show="loading" />
    <EmptyX v-if="!loading && hotelList.length == 0" tipsText='暂无酒店数据'/>
</div>
</template>
<script>
import hotelHandler from 'hotelHandler/hotelHandler.js'
import HotelList from 'hotelComponent/hotelcomp/hotelList.vue';
import EmptyX from "components/empty/EmptyX.vue";
import LoadingX from "components/loading/LoadingX.vue";
export default {
    mixins: [hotelHandler.mixin.tChatEventMixin],
    components: {
        HotelList,
        LoadingX,
        EmptyX
    },
    data: function () {
        return {
            loading:true,//数据加载
            locationPoint:{},//当前位置
            hotelList:[],
            tripNo:'',//行程ID
            systemEnvT:0,//环境ID
            hotelUseType:this.$route.query.useType//因公因私
        }
    },
    created: function () {
        var _this = this;
        _this.initData();
        if (!!_this.$route.query.tripNo){
            _this.tripNo = _this.$route.query.tripNo;
        }  
        if (!!JSON.parse(hotelHandler.getStorage('systemEnv'))){
            _this.systemEnvT = JSON.parse(hotelHandler.getStorage('systemEnv')).envType;
        }   
        if (!!_this.$route.query.locationPoint){
            _this.locationPoint = JSON.parse(_this.$route.query.locationPoint);
        }  
    },
    mounted: function () {
    },
    methods: { 
    /**
     * 注册并监听t信返回事件
     */ 
        initData(){
            let _this = this;
            _this.loading = true;
            _this.hotelList = JSON.parse(hotelHandler.getStorage('similarHotelListData'));
            _this.loading = false;
        },
        /**
        * T信回退事件的注册回调 必须是goBackFun
        */
        goBackFun(){
            var _this = this;
            _this.$router.back();             
        },          
        /**
         * 打开酒店详情
         * @param {Object} hotel
         */
        openDetail:function(hid,providerType){
            let _this = this;
            //统一收集数据
            let hotelObj = {
                hid:hid,
                inDate:_this.$route.query.inDate,
                outDate:_this.$route.query.outDate,
                inDays:_this.$route.query.inDays,
                providerType:providerType,
                useType:_this.$route.query.useType,
                tripNo:_this.tripNo,
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
        }
    }
}
</script>
<style scoped lang="less">
@import './recommendList.less';
</style>
