export class StringUtils {
    static truncate(str, length = 6, suffix = '...') {
        if (!str || str.length <= length) return str
        return str.substring(0, length) + suffix
    }

    static formatCoordinate(lng, lat) {
        return `经度: ${lng.toFixed(4)}, 纬度: ${lat.toFixed(4)}`
    }

    static capitalize(str) {
        if (!str) return ''
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
}