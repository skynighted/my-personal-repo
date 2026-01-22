<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="container">
    <!-- 路由匹配出口 -->
    <RouterView />
  </div>
</template>

<style scoped>
  /* 设置背景图片 */
  .container{
    width: 100vw;
    height: 100vh;
    background-image: url(./assets/layout/container_bg.png);
    background-size: 100%,100%;
  }
</style>
