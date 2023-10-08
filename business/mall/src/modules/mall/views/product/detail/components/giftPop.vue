<template>
    <div class="goods-gift-container">
        <div class="title-box">
            <AddressTitle :showTitle='true' :showBottomBorder='true' @closePopup='closePopup' title='优惠'></AddressTitle>
        </div>
        
        <div class="content-box">
			<div class="title"><symbolGift :name="type=='gift'?'赠品':'附件'" /></div>
			<ul class="list">
				<li v-for="(item, index) in list" :key="index" @click="gotoDetail(item)">
					<div class="top-content">
						<span class="content">{{item.name}}<i v-if="!!item.requirement">(条件: {{item.requirement}}，赠完即止)</i></span>
						<!-- <span class="right_icon"><Icon type='icon_common_rightarrow' size='.24'></Icon></span> -->
					</div>
					<div class="num">x{{item.num}}</div>
				</li>
			</ul>
		</div>   
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';
import scrollLockMixin from 'common/lib/mixin/scrollLockMixin.js';
const AddressTitle = ()=>import('common/components/base/AddressTitle.vue');
const Icon = ()=>import('common/components/base/Icon.vue');
import symbolGift from 'common/components/base/symbolGift.vue';
export default {
    name: 'giftPop',
    mixins: [scrollLockMixin],
    components: {AddressTitle, Icon, symbolGift},
    props:{
        list:{ //列表数据
			type: Object,
			require: true,
			default(){
				return []
			}
		},
        type:{ //区分赠品还是附件 gift代表赠品  attachment代表附件
			type: String,
			require: true,
			default:''
		}
    },
    data(){
        return {
			
        }
	},
	computed:{
              
    },
	watch: {
		
    },
    created(){
		
    },
    mounted(){},
    methods: {
        
        //关闭弹窗
        closePopup(){
            this.$emit('closePopup');
		},

		//暂时屏蔽掉该功能跳转商品详情
		gotoDetail(item){
			// this.$router.push(
            //     {
            //         path: '/product/detail',
			// 		params:{
			// 			sku: item.sku,
			// 		}
            //     }
            // )
		}
		
		
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/product/detail/components/giftPop.less';
</style>