import axios from 'axios'

const api = axios.create({
  baseURL: 'http://123.57.81.149:7001',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

// 数据处理辅助函数
const processData = (data, type) => {
  if (!data || !Array.isArray(data)) {
    console.log(`processData: 没有数据或数据不是数组，类型: ${type}`)
    return []
  }

  const filteredData = data
    .filter(item => item && typeof item === 'object' && item.type === type)
    .map(item => {
      let dateStr = item.date
      if (dateStr && dateStr.includes('T')) {
        dateStr = dateStr.split('T')[0]
      }
      if (dateStr && dateStr.includes('-')) {
        const parts = dateStr.split('-')
        if (parts.length === 3) {
          dateStr = `${parts[1]}-${parts[2]}`
        }
      }
      return {
        date: dateStr,
        value: parseFloat(item.value) || 0
      }
    })
    .sort((a, b) => {
      try {
        return new Date(a.date) - new Date(b.date)
      } catch (e) {
        return 0
      }
    })

  console.log(`处理后的${type}数据:`, filteredData)
  return filteredData.slice(-8)
}

// 模拟数据生成函数
const generateMockTemperatureData = () => {
  const data = []
  const today = new Date()
  const seed = 12345

  for (let i = 7; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const pseudoRandom = (index) => {
      const x = Math.sin(seed + index) * 10000
      return x - Math.floor(x)
    }

    const baseTemp = 20.5
    const randomOffset = (pseudoRandom(i) - 0.5)
    const value = baseTemp + randomOffset

    data.push({
      date: dateStr,
      value: parseFloat(value.toFixed(1))
    })
  }
  return data
}

const generateMockHumidityData = () => {
  const data = []
  const today = new Date()
  const seed = 54321

  for (let i = 7; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const pseudoRandom = (index) => {
      const x = Math.sin(seed + index) * 10000
      return x - Math.floor(x)
    }

    const baseHumidity = 50.0
    const randomOffset = (pseudoRandom(i) - 0.5) * 2
    const value = baseHumidity + randomOffset

    data.push({
      date: dateStr,
      value: parseFloat(value.toFixed(1))
    })
  }
  return data
}

const generateMockParticulateData = () => {
  const data = []
  const today = new Date()

  for (let i = 7; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const pm25Value = 55.0 + (Math.random() - 0.5) * 2
    const pm10Value = 95.0 + (Math.random() - 0.5) * 2

    data.push({
      date: dateStr,
      value: parseFloat(pm25Value.toFixed(1)),
      type: 'PM2.5'
    })

    data.push({
      date: dateStr,
      value: parseFloat(pm10Value.toFixed(1)),
      type: 'PM10'
    })
  }
  return data
}

export const apiService = {
  getDeviceStatus: async () => {
    try {
      const response = await api.get('/dashboard/queryDeviceOnlineNumber')

      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          const formattedData = response.map(item => ({
            type: item.type || item.name || '未知',
            value: Number(item.value) || 0
          }))
          if (formattedData.length === 0) {
            return [
              { type: '在线', value: 8 },
              { type: '离线', value: 2 }
            ]
          }
          return formattedData
        }

        if (response.data && Array.isArray(response.data)) {
          const onlineCount = response.data.filter(item => item.online_status === 1).length
          const offlineCount = response.data.filter(item => item.online_status === 0).length
          return [
            { type: '在线', value: onlineCount },
            { type: '离线', value: offlineCount }
          ]
        }

        if (response.online !== undefined && response.offline !== undefined) {
          return [
            { type: '在线', value: Number(response.online) || 0 },
            { type: '离线', value: Number(response.offline) || 0 }
          ]
        }

        const entries = Object.entries(response)
        if (entries.length > 0) {
          return entries.map(([key, value]) => ({
            type: key,
            value: Number(value) || 0
          }))
        }
      }

      return [
        { type: '在线', value: 8 },
        { type: '离线', value: 2 }
      ]
    } catch (error) {
      console.error('获取设备状态失败:', error)
      return [
        { type: '在线', value: 8 },
        { type: '离线', value: 2 }
      ]
    }
  },

  getEngineerDeviceTree: () => api.get('/dashboard/findEngineerDeviceTree'),

  getTemperatureData: async (engineer_id = 1, device_id = 1) => {
    try {
      const response = await api.get('/dashboard/queryMouthData', {
        params: { engineer_id, device_id }
      })

      if (!response || !response.data || response.data.length === 0) {
        return generateMockTemperatureData()
      }
      return processData(response.data, 'temperature')
    } catch (error) {
      console.error('获取温度数据失败:', error)
      return generateMockTemperatureData()
    }
  },

  getHumidityData: async (engineer_id = 1, device_id = 1) => {
    try {
      const response = await api.get('/dashboard/queryMouthData', {
        params: { engineer_id, device_id }
      })

      if (!response || !response.data || response.data.length === 0) {
        return generateMockHumidityData()
      }
      return processData(response.data, 'humidity')
    } catch (error) {
      console.error('获取湿度数据失败:', error)
      return generateMockHumidityData()
    }
  },

  getParticulateData: async (engineer_id = 1, device_id = 1) => {
    try {
      const response = await api.get('/dashboard/queryMouthData', {
        params: { engineer_id, device_id }
      })

      if (response.data && response.data.length > 0) {
        const pm25 = response.data
          .filter(item => item.type === 'pm25')
          .map(item => {
            let dateStr = item.date
            if (dateStr && dateStr.includes('T')) {
              dateStr = dateStr.split('T')[0]
            }
            return {
              date: dateStr,
              value: parseFloat(item.value) || 0,
              type: 'PM2.5'
            }
          })

        const pm10 = response.data
          .filter(item => item.type === 'pm10')
          .map(item => {
            let dateStr = item.date
            if (dateStr && dateStr.includes('T')) {
              dateStr = dateStr.split('T')[0]
            }
            return {
              date: dateStr,
              value: parseFloat(item.value) || 0,
              type: 'PM10'
            }
          })

        const result = [...pm25, ...pm10]
          .sort((a, b) => {
            try {
              return new Date(a.date) - new Date(b.date)
            } catch (e) {
              return 0
            }
          })
          .slice(-10)

        if (result.length > 0) {
          return result
        }
      }
      return generateMockParticulateData()
    } catch (error) {
      console.error('获取颗粒物数据失败:', error)
      return generateMockParticulateData()
    }
  },

  getServiceOverview: async () => {
    try {
      const response = await api.get('/dashboard/queryEngineerBindDeviceNumber')
      if (response.data) {
        return response.data.map(item => ({
          name: item.type,
          value: item.value
        }))
      }
      return []
    } catch (error) {
      console.error('获取服务事项数据失败:', error)
      return []
    }
  },

  getMonitoringPoints: async () => {
    try {
      const response = await api.get('/dashboard/findEngineerDeviceTree')
      if (response.data) {
        const points = []
        response.data.forEach(engineer => {
          if (engineer.children && engineer.children.length > 0) {
            engineer.children.forEach(device => {
              points.push({
                name: device.name,
                engineer: engineer.name,
                status: device.online_status === 1 ? '在线' : '离线',
                position: device.position || []
              })
            })
          }
        })
        return points
      }
      return []
    } catch (error) {
      console.error('获取监测点数据失败:', error)
      return []
    }
  }
}

export default apiService