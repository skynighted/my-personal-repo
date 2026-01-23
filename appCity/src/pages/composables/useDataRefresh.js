import { ref, onMounted, onUnmounted } from 'vue'

export function useDataRefresh(refreshFunction, interval = 10000) {
    const isRefreshing = ref(false)
    let refreshTimer = null

    const startRefresh = () => {
        if (refreshTimer) {
            clearInterval(refreshTimer)
        }

        refreshTimer = setInterval(async () => {
            if (!isRefreshing.value) {
                isRefreshing.value = true
                try {
                    await refreshFunction()
                } catch (error) {
                    console.error('数据刷新失败:', error)
                } finally {
                    isRefreshing.value = false
                }
            }
        }, interval)
    }

    const stopRefresh = () => {
        if (refreshTimer) {
            clearInterval(refreshTimer)
            refreshTimer = null
        }
    }

    onMounted(() => {
        startRefresh()
    })

    onUnmounted(() => {
        stopRefresh()
    })

    return {
        isRefreshing,
        startRefresh,
        stopRefresh
    }
}