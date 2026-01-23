<template>
    <div>
        <Title :title="title"></Title>
        <div ref="right2" style="height: 150px;margin-top: 15px;"></div>
    </div>
</template>
<script setup>
import Title from './Title.vue';
import { ref, onMounted, getCurrentInstance, onUnmounted } from 'vue';
import { Line } from '@antv/g2plot';
const title = ref("实时颗粒物曲线");
const right2 = ref(null);
const { proxy } = getCurrentInstance();
let chartInstance = null;

// 生成模拟颗粒物数据
const generateMockParticulateData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 7; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        // 模拟PM2.5数据 (50-60之间)
        const pm25Base = 55.0;
        const pm25Offset = (Math.random() - 0.5) * 2; // -1 到 +1
        const pm25Value = pm25Base + pm25Offset;
        
        // 模拟PM10数据 (90-100之间)
        const pm10Base = 95.0;
        const pm10Offset = (Math.random() - 0.5) * 2; // -1 到 +1
        const pm10Value = pm10Base + pm10Offset;
        
        data.push({
            date: dateStr,
            value: parseFloat(pm25Value.toFixed(1)),
            type: 'PM2.5'
        });
        
        data.push({
            date: dateStr,
            value: parseFloat(pm10Value.toFixed(1)),
            type: 'PM10'
        });
    }
    
    return data;
};

const loadLine = async () => {
    try {
        // 从API获取颗粒物数据
        const data = await proxy.$api.getParticulateData(1, 1);

        console.log('颗粒物数据:', data);

        // 如果API没有返回数据，使用模拟数据
        const chartData = data.length > 0 ? data : generateMockParticulateData();

        // 如果存在旧的图表实例，先销毁
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Line(right2.value, {
            data: chartData,
            xField: 'date',
            yField: 'value',
            seriesField: 'type',
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
                }
            },
            smooth: true,
            point: {
                size: 3,
                shape: 'circle',
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
            color: ['#ff4d4f', '#faad14'] // PM2.5红色，PM10黄色
        });

        chartInstance.render();
    } catch (error) {
        console.error('加载颗粒物数据失败:', error);
        // 后备数据
        const fallbackData = generateMockParticulateData();

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Line(right2.value, {
            data: fallbackData,
            xField: 'date',
            yField: 'value',
            seriesField: 'type',
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
                }
            },
            smooth: true,
            point: {
                size: 3,
                shape: 'circle',
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
            color: ['#ff4d4f', '#faad14']
        });
        chartInstance.render();
    }
}

let refreshTimer = null;

onMounted(() => {
    loadLine();
    
    // 每10秒刷新一次数据
    refreshTimer = setInterval(() => {
        loadLine();
    }, 10000);
});

onUnmounted(() => {
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
})
</script>
<style lang="less" scoped></style>