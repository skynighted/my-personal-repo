export class DateUtils {
    static formatDate(date, format = 'MM-DD') {
        const d = new Date(date)
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        const year = d.getFullYear()

        switch (format) {
            case 'MM-DD':
                return `${month}-${day}`
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`
            case 'HH:mm:ss':
                return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
            default:
                return `${month}-${day}`
        }
    }

    static getRecentDates(days = 8) {
        const dates = []
        const today = new Date()

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(today.getDate() - i)
            dates.push(this.formatDate(date))
        }

        return dates
    }

    static getCurrentDateTime() {
        const now = new Date()
        return {
            date: now.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            }),
            time: now.toLocaleTimeString('zh-CN', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            timestamp: now.getTime()
        }
    }
}