import axios from 'axios'
import { DataProcessor } from './dataService'

const BASE_URL = 'http://123.57.81.149:7001'

// 创建axios实例
const createApiInstance = () => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  })

  // 请求拦截器
  instance.interceptors.request.use(
    config => {
      // 可以在这里添加token等认证信息
      return config
    },
    error => Promise.reject(error)
  )

  // 响应拦截器
  instance.interceptors.response.use(
    response => response.data,
    error => {
      console.error('API请求错误:', error)
      return Promise.reject(error)
    }
  )

  return instance
}

export const apiInstance = createApiInstance()

// 辅助函数：解析坐标
const parseCoordinate = (coord) => {
  if (!coord) return [null, null]

  try {
    if (Array.isArray(coord)) {
      if (coord.length === 2) {
        const lng = parseFloat(coord[0])
        const lat = parseFloat(coord[1])
        return [lng, lat]
      } else if (coord.length === 1 && typeof coord[0] === 'string') {
        const parts = coord[0].split(',')
        if (parts.length === 2) {
          const lng = parseFloat(parts[0].trim())
          const lat = parseFloat(parts[1].trim())
          return [lng, lat]
        }
      }
    } else if (typeof coord === 'string') {
      const parts = coord.split(',')
      if (parts.length === 2) {
        const lng = parseFloat(parts[0].trim())
        const lat = parseFloat(parts[1].trim())
        return [lng, lat]
      }
    }
  } catch (error) {
    console.error('解析坐标失败:', error, '原始坐标:', coord)
  }

  return [null, null]
}

// 定义 ApiService 类
class ApiService {
  constructor() {
    this.api = apiInstance
  }

  // 设备状态
  async getDeviceStatus() {
    try {
      const response = await this.api.get('/dashboard/queryDeviceOnlineNumber')
      return this.normalizeDeviceStatus(response)
    } catch (error) {
      console.error('获取设备状态失败:', error)
      return this.getDefaultDeviceStatus()
    }
  }

  // 工程师设备树
  async getEngineerDeviceTree() {
    try {
      return await this.api.get('/dashboard/findEngineerDeviceTree')
    } catch (error) {
      console.error('获取工程师设备树失败:', error)
      return { data: [] }
    }
  }

  // 温度数据
  async getTemperatureData(engineer_id = 1, device_id = 1) {
    try {
      const response = await this.api.get('/dashboard/queryMouthData', {
        params: { engineer_id, device_id }
      })

      if (!response?.data?.length) {
        return this.generateMockTemperatureData()
      }

      return DataProcessor.processData(response.data, 'temperature')
    } catch (error) {
      console.error('获取温度数据失败:', error)
      return this.generateMockTemperatureData()
    }
  }

  // 湿度数据
  async getHumidityData(engineer_id = 1, device_id = 1) {
    try {
      const response = await this.api.get('/dashboard/queryMouthData', {
        params: { engineer_id, device_id }
      })

      if (!response?.data?.length) {
        return this.generateMockHumidityData()
      }

      return DataProcessor.processData(response.data, 'humidity')
    } catch (error) {
      console.error('获取湿度数据失败:', error)
      return this.generateMockHumidityData()
    }
  }

  // 颗粒物数据
  async getParticulateData(engineer_id = 1, device_id = 1) {
    try {
      const response = await this.api.get('/dashboard/queryMouthData', {
        params: { engineer_id, device_id }
      })

      if (!response?.data?.length) {
        return this.generateMockParticulateData()
      }

      return this.processParticulateData(response.data)
    } catch (error) {
      console.error('获取颗粒物数据失败:', error)
      return this.generateMockParticulateData()
    }
  }

  // 服务概览
  async getServiceOverview() {
    try {
      const response = await this.api.get('/dashboard/queryEngineerBindDeviceNumber')
      return response.data?.map(item => ({
        name: item.type,
        value: item.value
      })) || []
    } catch (error) {
      console.error('获取服务事项数据失败:', error)
      return []
    }
  }

  // 监测点信息
  async getMonitoringPoints() {
    try {
      const response = await this.api.get('/dashboard/findEngineerDeviceTree')

      if (!response.data) return this.getDefaultMonitoringPoints()

      return this.extractMonitoringPoints(response.data)
    } catch (error) {
      console.error('获取监测点数据失败:', error)
      return this.getDefaultMonitoringPoints()
    }
  }

  // 私有方法
  normalizeDeviceStatus(response) {
    // 统一的设备状态处理逻辑
    return response.data || [
      { type: '在线', value: 8 },
      { type: '离线', value: 2 }
    ]
  }

  generateMockTemperatureData() {
    return DataProcessor.generateMockData('temperature', {
      seed: 12345,
      baseValue: 15,
      range: 2
    })
  }

  generateMockHumidityData() {
    return DataProcessor.generateMockData('humidity', {
      seed: 54321,
      baseValue: 50,
      range: 10
    })
  }

  generateMockParticulateData() {
    const data = []
    const today = new Date()

    for (let i = 7; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      // PM2.5
      const pm25Value = 55 + (Math.random() - 0.5) * 2
      data.push({
        date: dateStr,
        value: parseFloat(pm25Value.toFixed(1)),
        type: 'PM2.5'
      })

      // PM10
      const pm10Value = 95 + (Math.random() - 0.5) * 2
      data.push({
        date: dateStr,
        value: parseFloat(pm10Value.toFixed(1)),
        type: 'PM10'
      })
    }

    return data
  }

  processParticulateData(data) {
    const pm25Data = DataProcessor.processData(data, 'PM2.5')
    const pm10Data = DataProcessor.processData(data, 'PM10')

    // 给数据添加类型字段
    const processedData = []
    pm25Data.forEach(item => {
      processedData.push({ ...item, type: 'PM2.5' })
    })
    pm10Data.forEach(item => {
      processedData.push({ ...item, type: 'PM10' })
    })

    return processedData
  }

  extractMonitoringPoints(data) {
    const points = []

    if (data && Array.isArray(data)) {
      data.forEach(engineer => {
        if (engineer.children && Array.isArray(engineer.children)) {
          engineer.children.forEach(device => {
            // 解析坐标
            const [lng, lat] = parseCoordinate(device.position)

            let positionText = '坐标数据异常'
            if (lng !== null && lat !== null) {
              positionText = `经度: ${lng.toFixed(6)}, 纬度: ${lat.toFixed(6)}`
            }

            points.push({
              id: device.id,
              name: device.name,
              engineer: engineer.name,
              status: device.online_status === 1 ? '在线' : '离线',
              position: positionText
            })
          })
        }
      })
    }

    return points.slice(0, 4) // 只返回前4个
  }

  getDefaultDeviceStatus() {
    return [
      { type: '在线', value: 8 },
      { type: '离线', value: 2 }
    ]
  }

  getDefaultMonitoringPoints() {
    return [
      { id: 1, name: '一号设备', engineer: '太原理工大学一号教学楼工程', status: '在线', position: '经度: 112.5225, 纬度: 37.8614' },
      { id: 2, name: '二号设备', engineer: '太原理工大学一号教学楼工程', status: '在线', position: '经度: 112.5218, 纬度: 37.8618' },
      { id: 3, name: '三号设备', engineer: '山西农大主体育场工程', status: '离线', position: '经度: 112.5838, 纬度: 37.4239' },
      { id: 4, name: '四号设备', engineer: '兰州理工大学', status: '在线', position: '经度: 103.7765, 纬度: 36.0552' }
    ]
  }
}

// 导出单例实例
export const apiService = new ApiService()