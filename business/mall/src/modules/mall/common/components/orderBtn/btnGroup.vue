<!--
    商品缩略图及相应的各个状态
-->
<template>
    <div class="btn-group-container" ref='btnContainer'>
        <div v-if='showMoreBtn' ref='moreBtnContainer' class='more-btn-container'>
            <div ref='moreBtn' class='more-btn cursorp' @click.stop='moreBtnClick'>更多</div>
            <div ref='moreBtnGroup' class='more-btn-group hidden cursorp'></div>
        </div>
        <btnFactory 
            class='btn-factory'
            ref='btnItem' 
            :type='btn' 
            :orderInfo='orderInfo' 
            v-for="(btn, index) in btnTypes" 
            :key='index' 
            @click='basicClickEvent'
            @cancelOrderCompleted="$emit('cancelOrderCompleted')"
            @confirmReceiptCompleted="$emit('confirmReceiptCompleted')"
            @deleteOrderCompleted="deleteOrderCompleted"
            @updateLimitTime="updateLimitTime"
        ></btnFactory>
    </div>
</template>
<script>
    import extendUtils from 'common/lib/utils';
    import btnFactory from 'common/components/orderBtn/btnFactory';
    import bus from 'common/lib/bus/bus'
    export default {
        components: {btnFactory},
        props: {
            limitSize: {//可显示的按钮数量，其他的收纳在“更多”按钮中  TODO（未实现）
                type: Number,
                defalut: null
            },
            btnTypes: {
                type: Array,
                default: ()=>{
                    return ['afterSale', 'deleteOrder', 'refundDetail', 'invoiceDetail', 'createInvoice', 'cancelOrder', 'confirmReceipt', 'showExpress', 'orderAgain', 'pay', 'approval']
                }
            },
            orderInfo:{
                type: Object,
                default: ()=>{}
            },
        },
        data(){
            return Object.assign(extendUtils.stateManager.setData([
            ]), {
                showMoreBtn: false,
            })
        },
        watch:{
            btnTypes(_new){
                this.init();
            },
            orderInfo(_new){
                this.init();
            }
        },
        mounted(){
            let that = this;
            this.init();
            //点击页面其他地方，或其他btnGroup的按钮时，需要关闭更多按钮的面板
            document.body.onclick = event=>{
                if(event.target != that.$refs.moreBtn){
                    that.toggleMoreBtnGroup(false);
                }
            }
            bus.$on('closeMoreBtnGroup', target=>{
                if(that.$refs.moreBtn != target){
                    that.toggleMoreBtnGroup(false);
                }
            })
        },
        methods: {
            async init(){
                await this.getPackagedBtns();//获取已被收纳的按钮（如果有）
                if(this.showMoreBtnFunc()){
                    this.showMoreBtn = true;
                    this.$nextTick(()=>{
                        this.dynamicBtn();
                    })
                } 
            },
            /**
             * 点击“更多”按钮
             */ 
            moreBtnClick(){
                this.toggleMoreBtnGroup();
            },
            /**
             * btnFactory的基础点击事件，点击任何一个按钮都会触发这个事件
             */ 
            basicClickEvent(btnObj){
                //关闭“更多”面板
                bus.$emit('closeMoreBtnGroup', this.$refs.moreBtn);
            },
            /**
             * 是否显示“更多”按钮
             * 如果设置了limitSize，则优先以limitSize来判断。
             * 但如果子元素长度超过了父元素，则无视limitSize的值
             */
            showMoreBtnFunc(){
                if(this.limitSize && this.btnTypes.length>this.limitSize ){
                    return true;
                }
                let btnContainer = this.$refs.btnContainer;
                let btnItem = btnContainer.querySelectorAll('.btn-factory')
                
                return extendUtils.domOverflow(btnContainer, btnItem)
            },

            /**
             * 切换显示“更多”按钮组
             * statu: true显示；false不显示
             */
            toggleMoreBtnGroup(statu){
                const HIDDEN_CLASS = 'hidden';
                let moreBtnGroup = this.$refs.moreBtnGroup;
                if(statu==null || statu==undefined){
                    statu = moreBtnGroup && moreBtnGroup.classList.contains(HIDDEN_CLASS);
                }
                Array.prototype.forEach.call(document.querySelectorAll('.btn-group-container .more-btn-group'), dom=>{
                    dom.classList.add(HIDDEN_CLASS)
                })
                if(!moreBtnGroup){
                    return;
                }
                if(statu){
                    moreBtnGroup.classList.remove(HIDDEN_CLASS)
                }else{
                    moreBtnGroup.classList.add(HIDDEN_CLASS)
                }
            },

            /**
             * 动态排列按钮，将超过宽度的按钮放到“更多”里面
             */
            dynamicBtn(){
                let that = this;
                let moreBtn = this.$refs.moreBtn;
                //判断更多按钮存
                if(!moreBtn || !(moreBtn instanceof Element)){
                    return;
                }
                let btnContainer = this.$refs.btnContainer;
                let btnItem = btnContainer.querySelectorAll('.btn-factory');//这里不能用refs，因为getPackagedBtns()函数会移动这些dom，导致refs不准确
                btnItem = [...btnItem];
                let moreBtnArr = []
                btnItem.push(moreBtn);
                //依次从原btngroup中弹出最前面一个，并加上“更多”按钮，检查是否超出容器。直到正好不超出为止。
                for(let i=btnItem.length-1; i>=0; i--){
                    moreBtnArr.push(btnItem.shift());//将弹出的按钮放入缓存中
                    if(!extendUtils.domOverflow(btnContainer, btnItem)){
                        break;
                    }
                }

                /**
                 * 将缓存中的按钮添加到“更多”面板中 
                 */
                let moreBtnGroup = this.$refs.moreBtnGroup;
                //初始化面板
                while(moreBtnGroup.children.length>0){
                    moreBtnGroup.children[moreBtnGroup.children.length-1].remove();
                }
                //箭头
                let arrow = document.createElement('div');
                arrow.classList.add('arrow');
                //面板
                let div = document.createElement('div');
                div.classList.add('fragment');//标识是用于装载原btnItem的容器
                Array.prototype.forEach.call(moreBtnArr, btn=>{
                    let dom = btn.$el || btn;
                    if(!!dom && dom instanceof Element){
                        dom.onclick = function(){
                            that.toggleMoreBtnGroup();
                        }
                        div.appendChild(dom);
                    }
                })
                moreBtnGroup.appendChild(div);
                moreBtnGroup.style.top = `-${div.offsetHeight}px`;
            },

            /**
             * 获取已被收纳的按钮
             */ 
            getPackagedBtns(){
                let that = this;
                return new Promise(resolve=>{
                    try{
                        let moreBtnGroup = that.$refs.moreBtnGroup;
                        //判断更多按钮是否存在
                        if(!moreBtnGroup || !(moreBtnGroup instanceof Element)){
                            resolve();
                            return;
                        }
                        let fragment = moreBtnGroup.querySelector('.fragment');
                        //判断更多按钮面板是否存在
                        if(!fragment || !(fragment instanceof Element)){
                            resolve();
                            return;
                        }
                        that.toggleMoreBtnGroup(false);
                        //隐藏更多按钮
                        that.showMoreBtn = false;
                        //将已收纳的按钮恢复到原位置
                        let btnContainer = that.$refs.btnContainer;
                        let moreBtnContainer = that.$refs.moreBtnContainer;
                        let children = fragment.children;
                        let result = [];
                        while(fragment.children.length>0){
                            let child = fragment.children[fragment.children.length-1];
                            btnContainer.insertBefore(child, moreBtnContainer.nextElementSibling);
                            result.push(child);
                        }
                        //等待dom被vue刷新后再执行下一步
                        that.$nextTick(()=>{
                            resolve();
                        })
                    }catch(e){
                        console.error(e);
                        resolve()
                    }
                })
            },

            /**
             * 将倒计时时间发射出来
             */
            updateLimitTime(limitTime){
                this.$emit('updateLimitTime', limitTime);
            },

            /**
             * 删除订单，删除后要隐藏“更多”按钮面板
             */ 
            deleteOrderCompleted(){
                this.$emit('deleteOrderCompleted')
                this.toggleMoreBtnGroup();
            }
        }
    }

</script>
<style scoped lang="less">
    @import '~themes/default/styles/order/orderList/btnGroup.less';
</style>