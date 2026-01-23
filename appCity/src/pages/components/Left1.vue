<template>
    <div>
        <Title :title="title"></Title>
        <div ref="left1" style="height: 150px;margin-top: 15px;"></div>
    </div>
</template>
<script setup>
import Title from './Title.vue';
import { ref, onMounted, getCurrentInstance, onUnmounted } from 'vue';
import { Line } from '@antv/g2plot';
import { getConsistentTemperatureData } from './temperatureData';

const title = ref("实时温度曲线");
const left1 = ref(null);
const { proxy } = getCurrentInstance();
let chartInstance = null;
let refreshTimer = null;

const loadLine = async () => {
    try {
        let chartData;

        // 使用一致的随机温度数据
        chartData = getConsistentTemperatureData();

        console.log('左图表温度数据:', chartData);

        // 如果存在旧的图表实例，先销毁
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }

        // 确保容器存在
        if (!left1.value) {
            console.error('图表容器未找到');
            return;
        }

        chartInstance = new Line(left1.value, {
            data: chartData,
            xField: 'date',
            yField: 'value',
            label: {
                style: {
                    fill: 'white'
                }
            },
            xAxis: {
                label: {
                    rotate: -45,
                    style: {
                        fill: 'white',
                        fontSize: 12,
                    }
                }
            },
            yAxis: {
                label: {
                    style: {
                        fill: 'white',
                        fontSize: 12,
                    }
                },
                min: 14,
                max: 16
            },
            smooth: true,
            point: {
                size: 5,
                shape: 'circle',
                style: {
                    fill: '#ff4d4f',
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
                domStyles: {
                    "g2-tooltip": {
                        background: '#147',
                        color: 'white',
                        fontSize: 14
                    }
                },
                showMarkers: true,
                formatter: (datum) => {
                    return { name: '温度', value: `${datum.value.toFixed(1)}℃` };
                }
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

        chartInstance.render();
    } catch (error) {
        console.error('加载温度图表失败:', error);
    }
}

onMounted(() => {
    // 延迟加载，确保DOM渲染完成
    setTimeout(() => {
        loadLine();
    }, 500);

    // 每10秒刷新一次数据（可以添加微小变化）
    refreshTimer = setInterval(() => {
        loadLine();
    }, 10000);
})

onUnmounted(() => {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
})
</script>
<style lang="less" scoped></style>