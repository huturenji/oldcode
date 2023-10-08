<template>
    <view class="btnContainer" ref='btnContainer'>
        <view v-if='showMoreBtn' ref='moreBtnContainer' class='more-btn-container'>
            <view ref='moreBtn' class='more-btn cursorp' @click.stop='moreBtnClick'>更多</view>
            <view ref='moreBtnGroup' class='more-btn-group hidden cursorp'></view>
        </view>
        <view ref="btnBox" :class="{ btnBox: true, moreShow: showMoreBtn }">
            <btnFactory
                class='btn-factory'
                v-for="btn in btnTypes" 
                :key='btn.type'
                ref='btnItem'
                :btnInfo='btn' 
                :info='info'
                :bgColor="btn.bgColor"
                :textColor="btn.textColor"
                :borderColor="btn.borderColor"
                :size="size"
                :otherProps="otherProps"
                @click='basicClickEvent'
                @orderEvents="orderEvents"
                @cancelResult="cancelResult"
                @viewInvoice="viewInvoiceFun"
                @giftCanceled="giftCanceled"
            ></btnFactory>
        </view>
    </view>
</template>

<script>
import btnFactory from '@/components/button/btnFactory';
import { domOverflow } from '@/utils/common.js'

export default {
    components: {
        btnFactory
    },
    props: {
        // 按钮类型
        btnTypes: { 
            type: Array,
            default: ()=>{
                return []
            }
        },
        info: {
            type: Object,
            default: () => {}
        },
        size: {
            type: String,
            default: 'normal'
        },
        otherProps: {
            type: Object,
            default: () => {
                return {
                    goToIndexType: 'give',
                    choosedCardIndex: 0
                }
            }
        }
    },
    data() {
        return {
            showMoreBtn: false
        };
    },
    mounted(){
        let that = this;
        this.init();

        uni.$on('closeMoreBtnGroup', () => {
            that.toggleMoreBtnGroup(false)
        })
        //点击页面其他地方，或其他btnGroup的按钮时，需要关闭更多按钮的面板
        document.addEventListener('click', this.outerClick)
    },
    methods: {
        outerClick(event) {
            let flag = false
            const path = event.path || (event.composedPath && event.composedPath())
            path.forEach(dom => {
                if (dom.className === 'fragment') {
                    flag = true
                }
            })

            if (!flag) {
                this.toggleMoreBtnGroup(false);
            }
        },
        cancelResult(data){
            this.$emit('cancelResult',data)
        },
        viewInvoice(){
            this.$emit('viewInvoice')
        },
        giftCanceled(){
            this.$emit('giftCanceled')
        },
        orderEvents(params) {
            this.$emit('orderEvents', params)
        },
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
        basicClickEvent(){
            //关闭“更多”面板
            uni.$emit('closeMoreBtnGroup');
        },
        /**
         * 是否显示“更多”按钮
         */
        showMoreBtnFunc(){
            let btnContainer = this.$refs.btnBox.$el;
            let btnItem = btnContainer.querySelectorAll('.btn-factory')
            return domOverflow(btnContainer, btnItem)
        },
        /**
         * 切换显示“更多”按钮组
         * statu: true显示；false不显示
         */
        toggleMoreBtnGroup(statu){
            if (!this.showMoreBtn) {
                return
            }
            const HIDDEN_CLASS = 'hidden';
            let moreBtnGroup = this.$refs?.moreBtnGroup?.$el;
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
            let moreBtn = this.$refs.moreBtn.$el;
            //判断更多按钮存
            if(!moreBtn || !(moreBtn instanceof Element)){
                return;
            }
            let btnContainer = this.$refs.btnBox.$el;
            let btnItem = btnContainer.querySelectorAll('.btn-factory');//这里不能用refs，因为getPackagedBtns()函数会移动这些dom，导致refs不准确
            btnItem = [...btnItem];
            let moreBtnArr = []
            //依次从原btngroup中弹出最前面一个，并加上“更多”按钮，检查是否超出容器。直到正好不超出为止。
            for(let i=btnItem.length-1; i>=0; i--){
                moreBtnArr.push(btnItem.shift());//将弹出的按钮放入缓存中
                if(!domOverflow(btnContainer, btnItem)){
                    break;
                }
            }

            /**
             * 将缓存中的按钮添加到“更多”面板中 
             */
            let moreBtnGroup = this.$refs.moreBtnGroup.$el;
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
            moreBtnGroup.appendChild(arrow);
            moreBtnGroup.style.top = `-${div.offsetHeight + 4}px`;
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
        }
    },
    destroyed() {
        document.removeEventListener('click', this.outerClick)
    }
}
</script>

<style lang="scss">
.btnContainer {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .more-btn-container {
        width: 68rpx;
        position: relative;
        display: flex;
        align-items: center;

        .more-btn{
            font-size: 28rpx;
            padding-left: 8rpx;
            text-align: left;
            color: #333;
        }

        .more-btn-group{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            position: absolute;
            top: -100%;
            left: -18rpx;
            background: rgba(0, 0, 0, 0.85);
            border-radius: .08rem;
            box-shadow:0px 4px 8px 0px rgba(204,204,204,0.5);
            opacity:0.8;
            z-index: 99;

            &.hidden{
                visibility: hidden;
            }

            ::v-deep .fragment {
                padding: 12rpx 0;
            }

            ::v-deep .arrow {
                width: .1rem;
                border-width: .1rem;
                border-style: solid;
                border-color: #272827 transparent transparent transparent;
                position: absolute;
                left: 40rpx;
                bottom: -0.2rem;
            }

            ::v-deep .btnFactory .btn {
                background-color: transparent !important;
                border: none !important;
                color: #fff !important;
                padding: 0 18rpx;
                font-size: 26rpx;
                font-weight: 600;
                margin-left: 0
            }
        }
    }

    .btnBox {
        width: 100%;
        display: flex;
        justify-content: flex-end;

        &.moreShow {
            width: calc(100% - 64rpx);
        }
    }
}
</style>
