import { ref, onUnmounted } from 'vue'
import { ChartUtils } from '../../utils/chartUtils'

export function useChart(chartType) {
    const chartInstance = ref(null)
    const chartContainer = ref(null)

    const initChart = (data, options = {}) => {
        if (!chartContainer.value) {
            console.error('图表容器不存在')
            return
        }

        // 清理旧的图表实例
        destroyChart()

        switch (chartType) {
            case 'line':
                chartInstance.value = ChartUtils.createLineChart(chartContainer.value, data, options)
                break
            case 'pie':
                chartInstance.value = ChartUtils.createPieChart(chartContainer.value, data, options)
                break
            case 'column':
                chartInstance.value = ChartUtils.createColumnChart(chartContainer.value, data, options)
                break
            default:
                throw new Error(`不支持的图表类型: ${chartType}`)
        }

        chartInstance.value.render()
    }

    const updateChart = (data) => {
        if (chartInstance.value) {
            chartInstance.value.changeData(data)
        }
    }

    const destroyChart = () => {
        if (chartInstance.value) {
            chartInstance.value.destroy()
            chartInstance.value = null
        }
    }

    // 组件卸载时自动清理
    onUnmounted(() => {
        destroyChart()
    })

    return {
        chartContainer,
        chartInstance,
        initChart,
        updateChart,
        destroyChart
    }
}