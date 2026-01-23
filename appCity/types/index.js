/**
 * @typedef {Object} DeviceStatus
 * @property {string} type - 设备状态类型
 * @property {number} value - 设备数量
 */

/**
 * @typedef {Object} TemperatureData
 * @property {string} date - 日期
 * @property {number} value - 温度值
 */

/**
 * @typedef {Object} MonitoringPoint
 * @property {number} id - 监测点ID
 * @property {string} name - 监测点名称
 * @property {string} engineer - 所属工程
 * @property {'online' | 'offline'} status - 在线状态
 * @property {string} position - 位置信息
 */

// 导出类型
export const DeviceStatus = {}
export const TemperatureData = {}
export const MonitoringPoint = {}