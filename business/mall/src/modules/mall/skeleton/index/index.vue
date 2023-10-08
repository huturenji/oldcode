<template>
	<div class="index-container fixed-dom-part" id='skeleton'>
      <div class="content-box">
        <div ref='searchBannerContent' class='search-banner-content'>
          <!-- 顶部的搜索栏 -->
          <searchComp class='search-content float' theme='transparent' :isDisabled="true" /> 

          <!-- banner区域 -->
          <div class="swiper-content">
			  <div class='content'>
				<defaultImg/>
			  </div>
		  </div>
          <!-- 顶部的tips部分 无需垫付 发票保障  合规透明 -->
          <topTips class="top-tips-wrap"></topTips>
        </div>
        <!-- 中间产品分类筛选区域 -->
        <div class="goods-categories"></div>

        <!-- 底部的商品列表区域 -->
        <div id='dataList' ref='listPart' class="list-part">
            <ul class="goods-list">
              <li class="goods-item" v-for='(item, index) in new Array(10)' :key='index'>
				  <thumb01/>
              </li>
            </ul>
        </div>
      </div>
	</div>
</template>

<script>
	import thumb01 from 'skeleton/thumbnail/thumb01'
	import defaultImg from 'skeleton/thumbnail/defaultImg'
	const searchComp = ()=>import('common/components/search/simpleSearch.vue');
	import topTips from 'view/index/components/topTips.vue';

	export default {
		name: 'indexSkeleton',
		components: {searchComp, topTips, defaultImg, thumb01},
	}
</script>

<style lang="less" scoped>
	@import '~themes/default/styles/index/index.less';
  	@import '~themes/default/styles/skeleton/index/index.less';
</style>