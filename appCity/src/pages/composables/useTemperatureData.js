import { ref, onMounted } from 'vue'
import { getConsistentTemperatureData } from '../components/temperatureData'

export function useTemperatureData() {
    const loading = ref(true)
    const error = ref(null)
    const data = ref([])

    const load = async () => {
        try {
            loading.value = true
            error.value = null

            // 这里可以调用 API 获取数据，暂时使用本地生成的数据
            const temperatureData = getConsistentTemperatureData()
            data.value = temperatureData

        } catch (err) {
            console.error('加载温度数据失败:', err)
            error.value = err.message || '加载温度数据失败'

            // 使用后备数据
            data.value = getConsistentTemperatureData()
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        load()
    })

    return {
        loading,
        error,
        data,
        load
    }
}