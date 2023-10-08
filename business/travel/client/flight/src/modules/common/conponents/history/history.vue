<template>
    <div class="page-history">
        <section class="search-history" v-if="searchHistory.length>0">
            <div class="title">
                <span>历史记录</span>
                <span class="inline-btn cursorp" @click="clearSearchHistory">清空历史</span>
            </div>
            <div class="history_content">
                <div v-for="(history,index) in searchHistory" @click="chooseHistory(history)" :key="index+''+searchHistory.time" class="history_item cursorp">
                    {{history.start}}&ndash;{{history.end}} {{history.time | dateFormat}}
                </div>
            </div>
        </section>
        <section class="trip-history" v-if="tripHistory.length>0">
            <div class="title">历史订单</div>
            <div class="history_content">
                <div v-for="history in tripHistory" @click="chooseHistory(history)" :key="history.orderNo" class="history_item cursorp">
                    {{history.start}}&ndash;{{history.end}}
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import extendUtils from 'flightCommon/extend.js';
import requestHandler from 'flightCommon/requestHandler.js';
const key = '_searchFlightHistory';
export default {
    components: {},
    data() {
        return {
            searchHistory: [],
            tripHistory: []
        }
    },
    filters: {
        dateFormat(date) {
            return new Date(date).format('MM月dd日')
        }
    },
    mounted(){
        this.loadHistory();
    },
    methods: {
        loadHistory(){
            this.getSearchHistory();
            this.getTripHistroy();
        },
        chooseHistory(history){
            this.$emit('click', history)
        },
        async clearSearchHistory(){
            await extendUtils.authInterceptor();
            extendUtils.removeStorage(requestHandler.primaryKey + key);
            this.getSearchHistory();
        },
        async getSearchHistory(){
            await extendUtils.authInterceptor();
            this.searchHistory = JSON.parse(extendUtils.getStorage(requestHandler.primaryKey + key) || '[]');
        },
        getTripHistroy(){
            requestHandler.getTripHistroy({}).then(res => {
                if (!!res && !!res.result){
                    this.tripHistory = [];
                    res.result.flightHistory.forEach(his => {
                        this.tripHistory.push({
                            start: his.departCityName,
                            end: his.arriveCityName
                        })
                    })
                }
            });
        }
    }
}

</script>
<style scoped lang="less">
    @import '~themes/default/styles/history/history.less';
</style>
