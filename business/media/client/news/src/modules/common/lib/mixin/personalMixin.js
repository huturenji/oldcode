/*
 * personalMixin的混入js
 */
import extendUtils from 'common/lib/utils';
import newsHandler from 'common/lib/requestHandler/newsHandler';
var personalMixin = {
    data(){
        return {
            newsList: [], //我的收藏新闻列表
            listItemConfig:{ //列表的相关配置
                disablePlay: false
            },
            showCheck: false,//列表是否显示批量选择的功能
            choosedNewsList:[],//选择的新增item
            operationText: '编辑',
            showOperation: true,
            noInfo: true//数据为空  
        }
    },
    watch:{
        showCheck(val){
            if(!!val){
                //为了解决当为选择状态的时候，点击视频不能选中，而是播放视频的bug
                this.$set(this.listItemConfig, 'disablePlay', true)
            }else{
                this.$set(this.listItemConfig, 'disablePlay', false)
            }
        }
    },
    mounted() {
       
    },   
    
    destroyed() {
      
    },
   
    methods: {
        /** 
        * title组件右侧自己提供的方法回调
        */
        operationFun(){    
            this.showCheck = !this.showCheck;
        },
        /**
         * 初始化我的收藏列表
         */
        getRecord(page){
            let that = this;
            return new Promise((resolve, reject)=>{
                let param = {
                    companyId: newsHandler.companyId,
                    channelId: newsHandler.channelId,
                    userId: newsHandler.userId,
                    type: that.listType,
                    pageSize: page.size,
                    pageIndex: page.num
                }
                newsHandler.getRecord(param).then(async (res) => {
                    try {
                        if(res.resultCode == 0 && res.result.resultCount == 0){
                            that.noInfo = true;
                        }
                    }catch (error) {

                    }
                    if(res.resultCode == 0 && res.result.hitResult.length > 0){
                        that.noInfo = false;
                        let articleIdList = res.result.hitResult;
                        try {
                            let articleListObj = await that.getListByIds(articleIdList);
                            resolve(articleListObj);
                        } catch (error) {
                            resolve({});
                        }
                    }else{
                        resolve({});
                    }
                }).catch((err) => {
                    console.log(err);
                    reject(false);
                });
            })
        },

        /** 
        * 通过articleIds查询新闻列表
        */
        getListByIds(articleIds){
            return new Promise((resolve) => {
                let param = {
                    companyId: newsHandler.companyId,
                    channelId: newsHandler.channelId,
                    userId: newsHandler.userId,
                    articleIds: articleIds
                }
                newsHandler.getNewsList(param).then(res => {
                    if(res.resultCode == 0 && !!res.result){
                        resolve(res.result);
                    }else{
                        resolve({});
                    }
                }).catch(e => {
                    console.log(e);
                    resolve({});
                })
            })
        },
        /** 
        * 一键清空 
        */
        clearAll(){
            let that = this;
            let text = that.clearAllText;
            extendUtils.showConfirm(text, function(){
                that.deleteAllRecord();
            }, 2, '取消', '确定', null, null, true);
        },
        /**
         * 删除所有点赞、踩、收藏、浏览或不喜欢（不感兴趣）的记录
         */ 
        deleteAllRecord(){
            let that = this;
            let param = {
                companyId:newsHandler.companyId,
                channelId:newsHandler.channelId,
                userId:newsHandler.userId,
                type:that.listType,
                deleteAll:true
            }
            newsHandler.deleteRecord(param).then(() => {
                that.showCheck = false;
                that.$refs.listTemplate.init(true);
            }).catch((err) => {
                console.log(err);
            });
        }, 
        /** 
        * 删除选中的新闻
        */
        deleteItem(){
            let that = this;
            let length = this.choosedNewsList.length;
            if(length <= 0){
                extendUtils.showToast('请选择要删除的新闻');
            }else{
                let text = '确认删除吗？';
                // console.log(text)
                extendUtils.showConfirm(text, function(){
                    let choosedList = that.choosedNewsList.map((item)=>{
                        return item.articleId
                    })
                    that.setNewsUserPrivate(choosedList);
                    
                }, 2, '取消', '删除', null, null, true);
            }
        },
        /**
         * 删除点赞、踩、收藏、浏览或不喜欢（不感兴趣）的记录
         * @param choosedNewsList 选中的资讯id
         */ 
        setNewsUserPrivate(choosedNewsList){
            let that = this;
            let param = {
                companyId:newsHandler.companyId,
                channelId:newsHandler.channelId,
                userId:newsHandler.userId,
                articlesId:choosedNewsList ,
                type:that.listType
            }
            newsHandler.deleteRecord(param).then(() => {
                that.$refs.listTemplate.init(true);
                that.showCheck = false;
            }).catch((err) => {
                console.log(err);
            });
        },        
        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            let pageFrom = extendUtils.getUserPara('pageFrom')
            if(pageFrom=='personal' || pageFrom == 'article'){
                this.$router.back();  
            }else{
                extendUtils.closePage(null, 1); 
            }
                             
        }
    }
}

export default personalMixin;
