<template>
    <div class="page-history">
        <section class="search-history" v-if="searchHistory.length>0">
            <div class="title">
                <span>浏览记录</span>
                <span class="inline-btn cursorp" @click="clearSearchHistory">清空历史</span>
            </div>
            <ul class="historyItemWrap">
                <li class="cursorp" v-for="history in searchHistory" @click="chooseHistory(history)" :key="history.time">
                    <div class="recommenHotelItem">
                      <div class="hotel-img">
                        <div class="topbg" v-bind:style="{backgroundImage: 'url(' + changUrlToHttps(history.img) + ')'}"></div>
                      </div>
                      <div class="hotel-info">
                        <div class="itemName ">{{history.name}}</div>
                      </div>
                      <div class="moneyWrap">
                        <span class="rmb">&yen;</span>
                        <span class="middle">{{history.price}}</span>
                      </div>
                    </div>
                </li>
            </ul>
        </section>
        <section class="trip-history" v-if="tripHistory.length>0">
            <div class="title">预订记录</div>
            <HotelList class="hotel-list"  v-for="(item,index) in tripHistory" :key="index" @click.native='openDetail(item)'
                  :hotel="item" :locationPoint='locationPoint' :isCityPosition='isCityPosition'/>
        </section>
    </div>
</template>

<script>
import requestHandler from "custCommon/requestHandler.js";
import HotelList from './hotelList.vue';
import extendUtils from "custCommon/extend.js";
const key = '_searchHotelHistory';
export default {
    components: {HotelList},
    data() {
        return {
            searchHistory: [],
            tripHistory: [],
            isCityPosition: false,
            locationPoint: {}
        }
    },
    props:{
        inDate:{
            type:Number,
            default: new Date().getTime()
        },
        outDate:{
            type:Number,
            default:new Date().getTime()+24*60*60*1000
        },
        lat:{
            type:Number,
            default:0
        },
        lng:{
            type:Number,
            default:0
        }
    },
    watch: {
        lat(val){
            this.locationPoint.lat = val;
            if (this.locationPoint.lng != null){
                this.isCityPosition = true;
            }
        },
        lng(val){
            this.locationPoint.lng = val;
            if (this.locationPoint.lat != null){
                this.isCityPosition = true;
            }
        }
    },
    mounted(){
        let that = this;
        this.loadHistory();
        extendUtils.winCloseCbSingleton.register(sinosdk.sino.onChildWindowClose, ()=>{
            that.loadHistory();
        })
    },
    methods: {
        /**
         * 艺龙图片使用https
         */ 
        changUrlToHttps(url){
            return extendUtils.changUrlToHttps(url);
        },
        loadHistory(){
            this.getSearchHistory();
            this.getTripHistroy();
        },
        chooseHistory(history){
            this.$emit('clickActive', history)
        },
        clearSearchHistory(){
            extendUtils.removeStorage(requestHandler.primaryKey + key);
            this.getSearchHistory();
        },
        async getSearchHistory(){
            await extendUtils.authInterceptor();
            this.searchHistory = JSON.parse(extendUtils.getStorage(requestHandler.primaryKey + key) || '[]');
        },
        getTripHistroy(){
            let param = {
                inDate: new Date(this.inDate).format('yyyy/MM/dd'),
                outDate: new Date(this.outDate).format('yyyy/MM/dd')
            }
            requestHandler.getHotelOrderList(param).then(res => {
                if (!!res && !!res.result){
                    this.tripHistory = res.result.hotelList || [];
                    if (this.lat!=null && this.lng!=null){
                        this.isCityPosition = true;
                    }
                    this.locationPoint = {
                        lat: this.lat,
                        lng: this.lng
                    }
                }
            });
        },
        /**
         * 打开酒店详情
         * @param {Object} hotel
         */
        openDetail:function(item){
            this.chooseHistory({
                price: item.minPrice,
                img: item.defaultPicture,
                id: item.hotelId,
                providerType: item.providerType
            })
        }
    }
}

</script>
<style scoped lang="less">
    @import '~styles/core/common.less';
    .page-history{
        margin-top: .3rem;
        padding: 0 0.3rem;
        section{
            font-size: .24rem;

            .title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: .1rem;
            font-size: .36rem;
            font-weight: bold;
            margin-bottom: .2rem;

            .inline-btn{
                color: @theme-color;
                font-weight: normal;
                font-size: .26rem;
            }
            }

            &.search-history{
                padding: .2rem 0 0 0;
                ul{
                    padding-bottom: 0.2rem;
                    overflow-x: auto;
                    display: flex;
                    justify-content: flex-start;
                    li{
                    margin-right: .2rem;
                    .recommenHotelItem{
                        position: relative;
                        width: 2.74rem;
                        display: inline-block;
                        border-radius: .08rem;
                        box-shadow:0px .06rem .2rem 0px rgba(101,112,242,0.12);
                        background: #fff;
                        .hotel-img{
                        height: 1.44rem;
                        background: url(~themes/default/img/hotel/empty.png) no-repeat center;
                        background-size: cover;
                        .topbg{
                            border-radius: .08rem .08rem 0 0;
                            width: 100%;
                            height: 100%;
                            background: url(~themes/default/img/hotel/empty.png) no-repeat center;
                            background-size: cover;
                        }
                        }
                        .hotel-info{
                        width: 2.74rem;
                        height: 0.92rem;
                        padding: 0 .16rem .1rem;
                        display: flex;
                        align-items: center;
                        .itemName{
                            width: 2.42rem;
                            font-size: 15px;
                            color: #333;
                            overflow: hidden;
                            -webkit-line-clamp: 2;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                        }
                        }
                        .moneyWrap{
                        position: absolute;
                        left: 0;
                        top: .88rem;
                        height: .44rem;
                        line-height: .44rem;
                        border-radius: 0 .44rem .44rem 0;
                        color: #ff4e3a;
                        text-align: left;
                        padding: 0 .22rem 0 .02rem;
                        font-size: 0;
                        font-weight: bold;
                        background: rgba(255,255,255,.8);
                        .rmb{
                            font-size: 0.24rem;
                        }
                        .middle{
                            font-size: 0.3rem;
                        }
                        }
                    }
                    }
                }
                }

                &.trip-history {
                    margin: 0 -.3rem;
                .title {
                    padding: 0 .3rem;
                }
            }
        }
    }
</style>
