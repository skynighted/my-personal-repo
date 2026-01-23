<template>
    <!-- 作为地图容器 -->
    <div ref="mapBox" style="height: 100%;">
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
const mapBox = ref(null);
const loadMap = () => {
    AMapLoader.load({
        key: "c1eaa446667d170242a1e59328ebca88", //申请好的Web端开发者key，调用 load 时必填
        version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
    })
        .then((AMap) => {
            //JS API 加载完成后获取AMap对象
            // 创建地图
            const map = new AMap.Map(mapBox.value, {
                // viewMode: '2D', //默认使用 2D 模式
                // zoom: 11, //地图级别
                // center: [116.397428, 39.90923], //地图中心点
                // mapStyle: "amap://styles/normal", //设置地图的显示样式
                pitch: 50, //地图俯仰角度，有效范围 0 度- 83 度
                viewMode: '3D', //地图模式
                rotateEnable: true, //是否开启地图旋转交互 鼠标右键 + 鼠标画圈移动 或 键盘Ctrl + 鼠标左键画圈移动
                pitchEnable: true, //是否开启地图倾斜交互 鼠标右键 + 鼠标上下移动或键盘Ctrl + 鼠标左键上下移动
                zoom: 17, //初始化地图层级
                rotation: -15, //初始地图顺时针旋转的角度
                zooms: [2, 20], //地图显示的缩放级别范围
                center: [113.12,36.20] //初始地图中心经纬度
            });
            const position = new AMap.LngLat(113.12,36.20); //Marker 经纬度
            const marker = new AMap.Marker({
                position: position
            });
            map.add(marker);
        })
        .catch((e) => {
            console.error(e); //加载错误提示
        });
}
onMounted(() => {
    loadMap();
})
</script>
<style lang="less" scoped></style>