<template>
    <div>
        <!-- 父子组件传值
            1.父组件将传递的数据写入子组件中 
        -->
        <Title :title="title"></Title>
        <!-- 2.提供图表容器 ref是模板应用 可以快速定位dom元素 -->
        <div ref="left1" style="height: 150px;margin-top: 15px;"></div>
    </div>
</template>
<script setup>
import Title from './Title.vue';
import { ref, onMounted } from 'vue';
// 引入折线图表的构造函数
import { Line } from '@antv/g2plot';
const title = ref("实时温度曲线");
// 声明模板引用
const left1 = ref(null);
// 将创建折线图表实例封装在函数中 封装折线图表函数
const loadLine = () => {
    const data = [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 },
    ];

    const line = new Line(left1.value, {
        data,
        xField: 'year',
        yField: 'value',
        // 折线文本配置项
        label: {
            style: {
                fill: 'white'
            }
        },
        // 配置x轴字段
        xAxis: {
            label: {
                rotate: -45,
                style: {
                    fill: 'white',
                    fontsize: 14,
                }
            }
        },
        // 配置y轴字段
        yAxis: {
            label: {
                style: {
                    fill: 'white',
                    fontsize: 18,
                }
            }
        },
        // 设置曲线是否平滑
        smooth: 'true',
        point: {
            size: 5,
            shape: 'circle',
            style: {
                fill: 'pink',
                stroke: '#6eaf6a',
                lineWidth: 2,
            },
        },
        animation: {
            appear: {
                animation: 'wave-in',
                duration: 3000,
            },
        },
        tooltip: { 
            domStyles:{
                "g2-tooltip":{
                    background:'#147',
                    color:'white',
                    fontsize:18
                }
            },
            showMarkers: true 
        },
        state: {
            active: {
                style: {
                    shadowBlur: 4,
                    stroke: '#000',
                    fill: 'red',
                },
            },
        },
        interactions: [{ type: 'marker-active' }],
    });

    line.render();
}
// onMounted生命周期才能完成渲染
onMounted(() => {
    loadLine();
})
</script>
<style lang="less" scoped></style>