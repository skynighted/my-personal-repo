import { ref } from 'vue'
import { apiInstance } from '../../services/apiService'

export function useApi() {
    const loading = ref(false)
    const error = ref(null)
    const data = ref(null)

    const fetchData = async (url, params = {}, config = {}) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiInstance.get(url, { params, ...config })
            data.value = response
            return response
        } catch (err) {
            error.value = err.message || '请求失败'
            throw err
        } finally {
            loading.value = false
        }
    }

    const postData = async (url, payload, config = {}) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiInstance.post(url, payload, config)
            data.value = response
            return response
        } catch (err) {
            error.value = err.message || '请求失败'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        data,
        fetchData,
        postData
    }
}