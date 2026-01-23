<template>
    <div>
        <Title :title="title"></Title>
        <div ref="right1" style="height: 150px;margin-top: 15px;"></div>
    </div>
</template>
<script setup>
import Title from './Title.vue';
import { ref, onMounted, getCurrentInstance, onUnmounted } from 'vue';
import { Line } from '@antv/g2plot';
import { getConsistentTemperatureData } from './temperatureData';

const title = ref("实时湿度曲线");
const right1 = ref(null);
const { proxy } = getCurrentInstance();
let chartInstance = null;

// 生成模拟湿度数据（使用固定种子确保一致性）
const generateConsistentHumidityData = () => {
    const data = [];
    const today = new Date();
    const seed = 54321; // 固定种子，确保随机数据一致
    
    for (let i = 7; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        // 使用固定种子生成可预测的随机数
        const pseudoRandom = (index) => {
            const x = Math.sin(seed + index) * 10000;
            return x - Math.floor(x);
        };
        
        // 模拟湿度在 45-55% 之间波动
        const baseHumidity = 50.0;
        const randomOffset = (pseudoRandom(i) - 0.5) * 2; // -1 到 +1
        const value = baseHumidity + randomOffset;
        
        data.push({
            date: dateStr,
            value: parseFloat(value.toFixed(1))
        });
    }
    
    return data;
};

const loadLine = async () => {
    try {
        // 获取湿度数据（可以使用API）
        let humidityData = [];
        if (proxy && proxy.$api && proxy.$api.getHumidityData) {
            humidityData = await proxy.$api.getHumidityData(1, 1);
        }

        // 如果API没有返回数据或调用失败，使用一致的模拟湿度数据
        if (!humidityData || humidityData.length === 0) {
            humidityData = generateConsistentHumidityData();
        }

        // 使用一致的随机温度数据（与左图表保持一致）
        const temperatureData = getConsistentTemperatureData();
        console.log('右图表数据:', { 
            温度: temperatureData, 
            湿度: humidityData 
        });

        // 合并数据，添加类型标识
        let chartData = [];

        // 处理湿度数据
        humidityData.forEach(item => {
            chartData.push({
                date: item.date,
                value: item.value,
                type: '湿度'
            });
        });

        // 处理温度数据（使用一致的随机数据）
        temperatureData.forEach(item => {
            chartData.push({
                date: item.date,
                value: item.value,
                type: '温度'
            });
        });

        // 按日期排序
        chartData.sort((a, b) => {
            try {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
            } catch (e) {
                return 0;
            }
        });

        // 如果存在旧的图表实例，先销毁
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Line(right1.value, {
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
                showMarkers: true,
                formatter: (datum) => {
                    const unit = datum.type === '温度' ? '℃' : '%';
                    return { name: datum.type, value: `${datum.value.toFixed(1)}${unit}` };
                }
            },
            state: {
                active: {
                    style: {
                        shadowBlur: 4,
                        stroke: '#000',
                    },
                },
            },
            interactions: [{ type: 'marker-active' }],
            color: ['#1890ff', '#ff4d4f'],
            lineStyle: {
                lineWidth: 2,
            },
            legend: {
                position: 'top',
                itemName: {
                    style: {
                        fill: 'white',
                        fontSize: 12
                    }
                }
            },
        });

        chartInstance.render();
    } catch (error) {
        console.error('加载温湿度数据失败:', error);
        // 后备数据
        const humidityData = generateConsistentHumidityData();
        const temperatureData = getConsistentTemperatureData();
        const fallbackData = [
            ...humidityData.map(item => ({ ...item, type: '湿度' })),
            ...temperatureData.map(item => ({ ...item, type: '温度' }))
        ];

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Line(right1.value, {
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
                showMarkers: true,
                formatter: (datum) => {
                    const unit = datum.type === '温度' ? '℃' : '%';
                    return { name: datum.type, value: `${datum.value.toFixed(1)}${unit}` };
                }
            },
            state: {
                active: {
                    style: {
                        shadowBlur: 4,
                        stroke: '#000',
                    },
                },
            },
            interactions: [{ type: 'marker-active' }],
            color: ['#1890ff', '#ff4d4f'],
            legend: {
                position: 'top',
                itemName: {
                    style: {
                        fill: 'white',
                        fontSize: 12
                    }
                }
            },
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