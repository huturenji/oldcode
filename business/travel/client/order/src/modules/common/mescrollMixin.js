import MescrollVue from 'mescroll.js/mescroll.vue'
var mescrollMixin = {
    components: {
        MescrollVue
    },
    data(){
        return {
            mescroll: null,
            mescrollDown: {
                use: true,
                auto: false,
                textLoading: '数据加载中',
                callback: this._getOrderDetail
            }, //下拉刷新的配置.
            mescrollUp: { // 上拉加载的配置.
                use: false
            }
        }
    },
    methods: {
        mescrollInit(mescroll){
            this.mescroll = mescroll
        },
        async _getOrderDetail(){
            await this.getOrderDetail();
            this.mescroll.endDownScroll()
        }
    }
}

export default mescrollMixin;
    

