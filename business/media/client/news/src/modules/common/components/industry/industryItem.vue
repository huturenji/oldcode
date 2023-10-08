<template>
  <div @click="clickResourceItem(item)" class="industryItem" :class="{row: direction=='row'}">
    <img :src="item.logo">
    <p v-html="setTitleHeightLight(item.siteName,keyword)"></p>
  </div>
</template>

<script>
import extendUtils from 'common/lib/utils';
export default {
    name: 'industryItem',
    props:{
        item:{
            type:Object,
            default(){
                return {}
            }
        },
        direction:{ //row或column
            type:String,
            default: 'column'
        },
        keyword:{//高亮关键字
            type:String,
            default: ''
        }
    },
    data(){
        return {

        }
    },
    methods:{
    /*
    * 点击每一个行业的item下的资源item
    */
        clickResourceItem(item){
      
            let url = item.phoneUrl;
            if(!!extendUtils.isPC()){
                url = item.pcUrl
            }
            if(item.id !='all' && (!url || (url.indexOf('http://') == -1 && url.indexOf('https://') == -1))){ //校验行业网站地址是存在并且是否存在https和http
                extendUtils.showToast('行业网站地址配置有误');
                return
            }
            extendUtils.openPage(url)
        },
        /**
     * title高亮处理
     * @param str 字符串
     * @param keyWord 高亮关键字
     */
        setTitleHeightLight(str,keyword){
            let titleText = str
            if(''!=keyword){
                titleText = titleText.replace(new RegExp(keyword, 'g'),'<span class="highlight">'+keyword+'</span>')
            }
            return titleText;
        }
    }
}
</script>

<style lang="less">
@import './style/industryItem.less';
</style>