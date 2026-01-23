import { apiInstance } from '../services/apiService'
import { DataProcessor } from '../services/dataService'
import { AppConfig } from '../config/appConfig'

class ApiService {
  constructor() {
    this.api = apiInstance
  }

  // 设备状态
  async getDeviceStatus() {
    try {
      const response = await this.api.get(AppConfig.api.endpoints.deviceStatus)

      // 数据标准化处理
      return this.normalizeDeviceStatus(response)
    } catch (error) {
      console.error('获取设备状态失败:', error)
      return this.getDefaultDeviceStatus()
    }
  }

  // 工程师设备树
  async getEngineerDeviceTree() {
    return this.api.get(AppConfig.api.endpoints.engineerDeviceTree)
  }

  // 温度数据
  async getTemperatureData(engineer_id = 1, device_id = 1) {
    try {
      const response = await this.api.get(AppConfig.api.endpoints.monthData, {
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
      const response = await this.api.get(AppConfig.api.endpoints.monthData, {
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
      const response = await this.api.get(AppConfig.api.endpoints.monthData, {
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
      const response = await this.api.get(AppConfig.api.endpoints.serviceOverview)
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
      const response = await this.api.get(AppConfig.api.endpoints.engineerDeviceTree)

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
    // ... 现有逻辑
  }

  generateMockTemperatureData() {
    return DataProcessor.generateMockData('temperature', AppConfig.data.mockData.temperature)
  }

  generateMockHumidityData() {
    return DataProcessor.generateMockData('humidity', AppConfig.data.mockData.humidity)
  }

  generateMockParticulateData() {
    // ... 现有逻辑
  }

  processParticulateData(data) {
    // ... 现有逻辑
  }

  extractMonitoringPoints(data) {
    // ... 现有逻辑
  }

  getDefaultDeviceStatus() {
    return [
      { type: '在线', value: 8 },
      { type: '离线', value: 2 }
    ]
  }

  getDefaultMonitoringPoints() {
    return [
      // ... 默认数据
    ]
  }
}

// 导出单例实例
export const apiService = new ApiService()
export default apiService