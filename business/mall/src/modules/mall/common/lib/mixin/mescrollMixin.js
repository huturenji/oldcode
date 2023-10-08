import MescrollVue from 'mescroll.js/mescroll.vue'
import Bus from 'common/lib/bus/bus.js';
export default {
    components: { MescrollVue },
    data() {
        return {
            mescroll: null, // mescroll实例对象
            mescrollDown: {
                callback: this._refresh,
                auto: false,
                textInOffset: '下拉刷新',
                textOutOffset: '松开刷新',
                textLoading: '刷新中',
                offset: 80,
            }, //下拉刷新的配置.
            mescrollUp: { // 上拉加载的配置.
                auto: true,
                scrollbar: false,
                callback: this._getListData,
                onScroll: this.onScroll,
                noMoreSize: 0,
                loadFull: {
                    use : false,
                    timeout: 10,//连续翻页n秒后停止该功能
                },
                page: {
                    num: 0,
                    size: this.BMallConfig.PAGE_SIZE.DEFAULT
                },
                toTop: {
                    html: '<div class="btn"></div>',
                    offset: 200,
                    warpClass: 'mescroll-toTop-btn'
                },
                htmlNodata: '<p class="mescroll-upwarp-nodata">没有更多了~</p>',
                empty: {
                    warpId: 'dataList',
                    icon: require('themes/default/img/defaultPage/img_defpage_nocontent@2x.png'),
                    tip: '暂无内容'
                },
                htmlLoading: '<p class="upwarp-progress noborder mescroll-rotate"></p><p class="upwarp-tip">正在加载中...</p>'
            },
            waiteFuncStack: [],//等待执行的函数栈
            firstLoad: true,
            loadFullInterval: false,
            loadFullHoldOn: true,//loadFull时是否每次查询后都关闭loading
        }
    },
    beforeRouteEnter (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteEnter不用写
        next(vm => {
            // 滚动到原来的列表位置,恢复顶部按钮和isBounce的配置
            vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter();
            //每次重新进入路由时，如果函数栈中有被缓存的函数，则执行
            while(vm.waiteFuncStack && vm.waiteFuncStack.length>0){
                let funcObj = vm.waiteFuncStack.pop();
                typeof funcObj.func == 'function' && funcObj.func.apply(vm, funcObj.param)
            }
        })
    },
    beforeRouteLeave (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteLeave不用写
        // 记录列表滚动的位置,隐藏顶部按钮和isBounce的配置
        this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave()
        next()
    },
    created() {
        //外界调用，主动触发下拉刷新
        Bus.$on('triggerDownScroll', ()=>{
            this.mescroll.triggerDownScroll();
        })
    },
    methods: {
        // mescroll组件初始化的回调,可获取到mescroll对象
        mescrollInit(mescroll) {
            this.mescroll = mescroll;
            this.agentMethod(mescroll);
            this.overwriteMethod(mescroll);
        },

        /**
         * 覆盖原始函数
         * @param {*} me 
         */
        overwriteMethod(me){
            me.loadFull = function () {
                var me = this;
                if (me.optUp.loadFull.use && !me.optUp.isLock && me.optUp.hasNext && me.optUp.callback && me.getClientHeight()!=0 && me.getScrollHeight() <= me.getClientHeight()) {
                  setTimeout(function () {
                    // 延时之后,还需再判断一下高度,因为可能有些图片在延时期间加载完毕撑开高度
                    if (me.getScrollHeight() <= me.getClientHeight()) me.triggerUpScroll();
                  }, me.optUp.loadFull.delay)
                }
              }
        },

        /**
         * 对mescroll对象的函数做扩展
         */
        agentMethod(me){
            let that = this;
            let seriesPageDataLength = 0;//计算自动连续翻页时的总数据条数
            let isEmpty = true;//标识列表是否有数据
            //代理函数
            var agent = {
                /**
                 * 扩展功能： 如果加载出错，需要显示空白页
                 */
                endErr: (_endErr=>{
                    return ()=>{
                        let prePageNum = me.optUp.page.num;
                        _endErr.call(me);
                        // 结束上拉加载
                        if (me.optUp.use) {
                            if(prePageNum<=1){
                                me.showEmpty();
                            }
                        }
                    }
                })(me.endErr),

                /**
                 * 扩展功能： 如果无数据了，则锁定不可上拉加载
                 */
                showEmpty: (_showEmpty=>{
                    //自定义参数，如果找不到dom，是否将函数压入栈
                    return (cache=true)=>{
                        if(cache){
                            //showEmpty之前先判断dom是否存在,如果不存在，可能是原页面保活，此时已经跳转到其他页面了。此时将showEmpty存入一个栈，等下次回到原页面时执行
                            let warpId = me.optUp.empty.warpId || me.optUp.clearEmptyId; 
                            var emptyWarp = !!warpId ? me.getDomById(warpId) : null; 
                            if(!emptyWarp || emptyWarp.length==0){
                                that.waiteFuncStack.push({
                                    func: me.showEmpty,
                                    param: [false]
                                })
                                return;
                            }
                        }
                        _showEmpty.call(me);
                        me.lockUpScroll();
                    }
                })(me.showEmpty),

                /**
                 * 扩展功能： 防止服务器每页数据不足page.size条
                 */
                endByPage: ((_endByPage)=>{
                    return (dataSize, totalPage, systime)=>{
                        if(this.mescrollUp.loadFull.use){
                            //如果一页不满page.size条，则继续静默获取下一页（loading不可停），直到这一系列的总条数不小于page.size为止
                            seriesPageDataLength += dataSize;
                            if(me.optUp.page.num < totalPage && seriesPageDataLength < me.optUp.page.size && that.loadFullHoldOn){
                                that.openLoadFullInterval();//开启定时器
                                me.isUpScrolling = false; // 标记结束上拉加载
                                me.triggerUpScroll()
                                return;
                            }else if(!that.loadFullHoldOn){//如果是超时了，则直接认为没有数据了
                                if(isEmpty){//没数据时显示空布局
                                    me.optUp.page.num = totalPage = 1;
                                }else{//否则显示无数据提示
                                    me.optUp.page.num = totalPage
                                }
                            }
                        }

                        //一旦有数据了，就改变标识
                        if(dataSize!=0){
                            isEmpty = false;
                        }

                        //服务器返回的每页数据，可能不足me.optUp.page.size条（因为可能在分页后被过滤了一部分），因此在当前页小于总页数时，将dataSize写死成me.optUp.page.size
                        //但如果是超时导致的不继续翻页，则把原始的dataSize传下去，让组件做正确的展示
                        dataSize = that.loadFullHoldOn && me.optUp.page.num < totalPage ? me.optUp.page.size : dataSize

                        //初始化工作
                        that.closeLoadFullInterval();//初始化定时器
                        that.loadFullHoldOn = true;//初始化开关
                        seriesPageDataLength = 0;//初始化计数

                        _endByPage.call(me, dataSize, totalPage, systime)
                    }
                })(me.endByPage),

                /**
                 * 扩展功能： 有数据时，要放开上拉加载的功能
                 */
                endSuccess: ((_endSuccess, _isLock)=>{
                    return (dataSize, hasNext, systime)=>{
                        if(dataSize && dataSize>0){
                            me.lockUpScroll(_isLock);
                        }
                        _endSuccess.call(me, dataSize, hasNext, systime);
                    }
                })(me.endSuccess, me.optUp.isLock),
                
                /**
                 * 扩展功能： 正在加载的loading需要等页面动画奇幻结束后才执行 目前动画切换的时间为250ms
                 */
                triggerUpScroll: ((_triggerUpScroll, time)=>{
                    return ()=>{
                        //firstLoad用来标识是否为第一次加载数据
                        if(that.firstLoad){
                            setTimeout(()=>{
                                _triggerUpScroll.call(me);
                                that.firstLoad = false;
                            }, time)
                        }else{
                            _triggerUpScroll.call(me);
                        }
                    }
                })(me.triggerUpScroll, 250)
            }
            
            //将代理函数代替原函数
            Object.keys(agent).forEach(key => {
                me[key] = agent[key];
            })
        },

        /**
         * 下拉刷新的代理方法
         * @param {*} mescroll 
         */
        _refresh(mescroll){
            this.re_fresh(mescroll);
        },

        _getListData(page, mescroll){
            this.getListData(page, mescroll);
        },

        /**
         * 开启loadFull定时器
         */
        openLoadFullInterval(){
            let that = this;
            if(!that.mescrollUp.loadFull.use){
                return;
            }
            let time = that.mescrollUp.loadFull.timeout;
            //首次loadFull的时候开启定时器
            if(!that.loadFullInterval && time>0){
                that.loadFullHoldOn = true;
                that.loadFullInterval = setInterval(()=>{
                    time--;
                    if(time <= 0){
                        that.closeLoadFullInterval();
                        that.loadFullHoldOn = false;
                    }
                }, 1000);
            }
        },

        /**
         * 关闭loadFull定时器
         */
        closeLoadFullInterval(){
            let that = this;
            if(!that.mescrollUp.loadFull.use){
                return;
            }
            clearInterval(that.loadFullInterval);
            that.loadFullInterval = null;
        }
    }
}
