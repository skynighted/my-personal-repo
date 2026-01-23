<template>
    <div>
        <Title :title="title"></Title>
        <!-- 设置饼图图标容器 -->
        <div ref="left2" style="height: 150px;"></div>
    </div>
</template>
<script setup>
import Title from './Title.vue';
import { ref, onMounted, getCurrentInstance } from 'vue';
import { Pie } from '@antv/g2plot';
const title = ref("设备状态分布");
const left2 = ref(null);
const { proxy } = getCurrentInstance();

// 封装加载饼图函数
const loadPie = async () => {
    try {
        // 从API获取设备状态数据
        const response = await proxy.$api.getDeviceStatus();
        console.log('设备状态API响应:', response);

        // 根据API文档，数据在response.data中
        // API返回格式: { "status": 200, "message": "success", "data": [{ "type": "在线", "value": 5 }, ...], "timestamp": ... }
        const data = response.data || [
            { type: '在线', value: 5 },
            { type: '离线', value: 5 },
        ];

        const piePlot = new Pie(left2.value, {
            appendPadding: 10,
            data,
            angleField: 'value',
            colorField: 'type',
            radius: 0.8,
            label: {
                style: {
                    fill: 'white'
                },
                type: 'outer',
                content: '{name} {value}个',
            },
            interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
            color: ({ type }) => {
                if (type === '在线') {
                    return '#a2a6e2';
                }
                return 'pink';
            },
            legend: {
                itemName: {
                    style: {
                        fill: 'white'
                    },
                }
            },
            statistic: {
                title: {
                    style: {
                        fill: 'white'
                    }
                },
                content: {
                    style: {
                        fill: 'white'
                    }
                }
            }
        });

        piePlot.render();
    } catch (error) {
        console.error('加载设备状态数据失败:', error);
        // 后备数据
        const fallbackData = [
            { type: '在线', value: 5 },
            { type: '离线', value: 5 },
        ];

        const piePlot = new Pie(left2.value, {
            appendPadding: 10,
            data: fallbackData,
            angleField: 'value',
            colorField: 'type',
            radius: 0.8,
            label: {
                style: {
                    fill: 'white'
                },
                type: 'outer',
                content: '{name} {value}个',
            },
            interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
            color: ({ type }) => {
                if (type === '在线') {
                    return '#a2a6e2';
                }
                return 'pink';
            },
            legend: {
                itemName: {
                    style: {
                        fill: 'white'
                    },
                }
            },
            statistic: {
                title: {
                    style: {
                        fill: 'white'
                    }
                },
                content: {
                    style: {
                        fill: 'white'
                    }
                }
            }
        });
        piePlot.render();
    }
}
onMounted(() => {
    loadPie();
})
</script>
<style lang="less" scoped></style>