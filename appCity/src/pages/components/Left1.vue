<template>
    <div>
        <!-- 父子组件传值
            1.父组件将传递的数据写入子组件中 
        -->
        <Title :title="title"></Title>
    </div>
</template>
<script setup>
    import Title from './Title.vue';
    import { ref } from 'vue';
    const title = ref("实时温度曲线");
</script>
<style lang="less" scoped>
    
</style> 