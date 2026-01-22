<template>
    <div>
        <Title :title="title"></Title>
    </div>
</template>
<script setup>
    import Title from './Title.vue';
    import { ref } from 'vue';
    const title = ref("服务事项概览");
</script>
<style lang="less" scoped>
    
</style>  