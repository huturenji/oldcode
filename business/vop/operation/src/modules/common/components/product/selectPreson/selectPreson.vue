<!--
 * @Author: chengMingRui
 * @Date: 2020-03-02 17:42:00
 * @LastEditTime: 2020-03-02 18:17:13
 * @Description: 新增定价规则提交模块
 -->
<template>
    <div class="selectPreson">
        <div class="selectPreson_left">
            <span class="selectPreson_left_dec">提交给：</span>
            <el-input 
                type="text" 
                placeholder="请选择复核人" 
                class="selectPreson_left_input"
            />
        </div>
        <div class="selectPreson_right">
            <i class="el-icon-user"></i>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="less">
@import "./selectPreson.less";
</style>