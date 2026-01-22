<template>
    <div class="box">
        <div class="icon"></div>    
        <div class="text">
            {{ title }}
        </div>
    </div>
</template>
<script setup>
    // 2.子组件接受父组件传递的数据 defineProps宏
    import { defineProps } from 'vue';
    defineProps(['title']);
</script>
<style lang="less" scoped>
.box{
    display: flex;
    .icon{
        width: 24px;
        height: 36px;
        background-image: url(../../assets/layout/box_title_icon.png);
        background-size: 100% 100%;
    }
    .text{
        color:white;
        font-family: "楷体";
        margin-left: 10px;
        font-size: 20px;
        line-height: 30px;
    }
}
</style> 