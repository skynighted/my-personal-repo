export class DataProcessor {
    static processData(data, type) {
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

        return filteredData.slice(-8)
    }

    static generateMockData(type, config = {}) {
        const { seed = 12345, baseValue = 50, range = 5, days = 8 } = config
        const data = []
        const today = new Date()

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(today.getDate() - i)
            const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

            const pseudoRandom = (index) => {
                const x = Math.sin(seed + index) * 10000
                return x - Math.floor(x)
            }

            const randomOffset = (pseudoRandom(i) - 0.5) * range
            const value = baseValue + randomOffset

            data.push({
                date: dateStr,
                value: parseFloat(value.toFixed(1))
            })
        }

        return data
    }

    static calculateStats(dataSets) {
        const stats = {
            avgTemperature: '0.0',
            avgHumidity: '0.0',
            avgPM25: '0.0',
            avgPM10: '0.0',
            anomalies: 0
        }

        dataSets.forEach((data, index) => {
            if (data.length > 0) {
                const sum = data.reduce((acc, item) => acc + item.value, 0)
                const avg = (sum / data.length).toFixed(1)

                switch (index) {
                    case 0: stats.avgTemperature = avg; break
                    case 1: stats.avgHumidity = avg; break
                    case 2: stats.avgPM25 = avg; break
                    case 3: stats.avgPM10 = avg; break
                }
            }
        })

        return stats
    }
}