export const AppConfig = {
    // API配置
    api: {
        baseURL: 'http://123.57.81.149:7001',
        timeout: 10000,
        endpoints: {
            deviceStatus: '/dashboard/queryDeviceOnlineNumber',
            engineerDeviceTree: '/dashboard/findEngineerDeviceTree',
            monthData: '/dashboard/queryMouthData',
            serviceOverview: '/dashboard/queryEngineerBindDeviceNumber'
        }
    },

    // 地图配置
    map: {
        key: 'c1eaa446667d170242a1e59328ebca88',
        securityJsCode: '984d70611179d656d9e42db69a1e4ac8',
        version: '2.0',
        center: [104.195, 35.861],
        zoom: 5,
        style: 'amap://styles/normal'
    },

    // 数据配置
    data: {
        refreshInterval: 10000, // 10秒
        daysToShow: 8,
        mockData: {
            temperature: {
                seed: 12345,
                baseValue: 15,
                range: 2
            },
            humidity: {
                seed: 54321,
                baseValue: 50,
                range: 10
            },
            particulate: {
                pm25Base: 55,
                pm10Base: 95,
                range: 10
            }
        }
    },

    // 阈值配置
    thresholds: {
        temperature: {
            min: 15,
            max: 25,
            warning: { min: 10, max: 30 }
        },
        humidity: {
            min: 30,
            max: 70,
            warning: { min: 20, max: 80 }
        },
        particulate: {
            pm25: { normal: 35, warning: 75 },
            pm10: { normal: 50, warning: 150 }
        }
    },

    // 主题配置
    theme: {
        colors: {
            primary: '#1890ff',
            success: '#52c41a',
            warning: '#faad14',
            error: '#f5222d',
            info: '#722ed1'
        },
        chartColors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']
    }
}