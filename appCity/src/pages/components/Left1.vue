<template>
    <div class="chart-container">
        <Title :title="title" />
        <div class="chart-content">
            <div v-if="loading" class="loading-state">
                <div class="loading-spinner"></div>
                <div class="loading-text">数据加载中...</div>
            </div>
            <div v-else-if="error" class="error-state">
                <span class="error-icon">⚠️</span>
                <div class="error-text">{{ error }}</div>
                <button class="retry-btn" @click="loadChartData">重试</button>
            </div>
            <div v-else ref="chartContainer" class="chart-canvas"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, onUnmounted } from 'vue'
import Title from './Title.vue'
import { Line } from '@antv/g2plot'
import { getConsistentTemperatureData } from './temperatureData'

const title = ref("实时温度曲线")
const chartContainer = ref(null)
const chartInstance = ref(null)
const loading = ref(true)
const error = ref('')
const { proxy } = getCurrentInstance()

const loadChartData = async () => {
    loading.value = true
    error.value = ''

    try {
        // 使用硬编码的温度数据
        const temperatureData = getConsistentTemperatureData()

        if (chartInstance.value) {
            chartInstance.value.destroy()
        }

        if (chartContainer.value) {
            chartInstance.value = new Line(chartContainer.value, {
                data: temperatureData,
                xField: 'date',
                yField: 'value',
                label: {
                    style: {
                        fill: 'white'
                    }
                },
                xAxis: {
                    label: {
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
                        fill: '#1890ff',
                        stroke: '#fff',
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
                        return { name: '温度', value: `${datum.value.toFixed(1)}℃` }
                    }
                },
                color: '#1890ff',
                lineStyle: {
                    lineWidth: 2,
                },
            })

            chartInstance.value.render()
            error.value = ''
        }
    } catch (err) {
        console.error('加载温度图表失败:', err)
        error.value = `图表加载失败: ${err.message}`
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    // 延迟加载，确保DOM渲染完成
    setTimeout(() => {
        loadChartData()
    }, 100)

    // 每10秒刷新一次
    const refreshTimer = setInterval(() => {
        loadChartData()
    }, 10000)

    onUnmounted(() => {
        if (chartInstance.value) {
            chartInstance.value.destroy()
        }
        clearInterval(refreshTimer)
    })
})
</script>

<style lang="less" scoped>
.chart-container {
    height: 100%;
    display: flex;
    flex-direction: column;

    .chart-content {
        flex: 1;
        margin-top: 15px;
        position: relative;

        .chart-canvas {
            height: 100%;
            width: 100%;
        }

        .loading-state {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #ccc;

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255, 255, 255, 0.1);
                border-top-color: #1890ff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 12px;
            }

            .loading-text {
                font-size: 14px;
            }
        }

        .error-state {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #ff4d4f;

            .error-icon {
                font-size: 32px;
                margin-bottom: 12px;
            }

            .error-text {
                font-size: 14px;
                margin-bottom: 16px;
                max-width: 80%;
            }

            .retry-btn {
                padding: 8px 16px;
                background: rgba(245, 34, 45, 0.1);
                border: 1px solid rgba(245, 34, 45, 0.3);
                color: #ff4d4f;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;

                &:hover {
                    background: rgba(245, 34, 45, 0.2);
                    transform: translateY(-1px);
                }
            }
        }
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>