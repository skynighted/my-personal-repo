let cachedTemperatureData = null

const generateConsistentTemperatureData = () => {
    if (cachedTemperatureData) return cachedTemperatureData

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

        const baseTemp = 15
        const randomOffset = (pseudoRandom(i) - 0.5)
        const value = baseTemp + randomOffset

        data.push({
            date: dateStr,
            value: parseFloat(value.toFixed(1))
        })
    }

    cachedTemperatureData = data
    return data
}

export const getConsistentTemperatureData = () => [...generateConsistentTemperatureData()]