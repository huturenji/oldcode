<template>
    <div class="page-history">
        <section class="search-history" v-if="searchHistory.length>0">
            <div class="title">
                <span>历史记录</span>
                <span class="inline-btn cursorp" @click="clearSearchHistory">清空历史</span>
            </div>
            <ul class="clear">
                <li v-for="(history, index) in searchHistory" :key="index">
                    <div @click="chooseHistory(history)" class="btn cursorp" inline size="small" shape="round" :ghost="true">
                        {{history.start}} - {{history.end}} {{history.time | dateFormat}}
                    </div>
                </li>
            </ul>
        </section>
        <section class="trip-history" v-if="tripHistory.length>0">
            <div class="title">历史订单</div>
            <ul class="clear">
                <li v-for="history in tripHistory" :key="history.orderNo">
                    <div @click="chooseHistory(history)" class="btn cursorp" inline size="small" shape="round" :ghost="true">
                      {{history.start}} - {{history.end}}
                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import trainHandler from 'trainHandler/common/lib/trainHandler.js';

    const key = '_searchTrainHistory';
    export default {
        data() {
            return {
                searchHistory: [],
                tripHistory: [],
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
            clearSearchHistory(){
                trainHandler.removeStorage(trainHandler.primaryKey + key);
                this.getSearchHistory();
            },
            async getSearchHistory(){
                await trainHandler.authInterceptor();
                this.searchHistory = JSON.parse(trainHandler.getStorage(trainHandler.primaryKey + key) || '[]');
            },
            getTripHistroy(){
              let param = {
                "limitBound": 3
              }
              trainHandler.getTripHistroy(param).then(res => {
                if(!!res && !!res.result){
                  this.tripHistory = [];
                  res.result.trainHistories.forEach(his => {
                    this.tripHistory.push({
                      start: his.startStation,
                      end: his.endStation
                    })
                  })
                }
              });
            }
        }
    }

</script>
<style scoped lang="less">
@import '~themes/default/styles/history.less';
</style>
