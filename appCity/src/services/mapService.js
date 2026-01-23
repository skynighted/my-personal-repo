export class MapService {
    static isValidCoordinate(lng, lat) {
        return !isNaN(lng) && !isNaN(lat) &&
            lng >= -180 && lng <= 180 &&
            lat >= -90 && lat <= 90
    }

    static parseCoordinate(coord) {
        if (!coord) return [NaN, NaN]

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

        return [NaN, NaN]
    }

    static getValidCoordinates(response) {
        const validCoordinates = []

        if (response && response.data && Array.isArray(response.data)) {
            response.data.forEach(engineer => {
                const engineerCoords = this.parseCoordinate(engineer.position)
                if (this.isValidCoordinate(engineerCoords[0], engineerCoords[1])) {
                    validCoordinates.push({
                        lng: engineerCoords[0],
                        lat: engineerCoords[1],
                        type: 'engineer',
                        name: engineer.name,
                        id: engineer.id
                    })
                }

                if (engineer.children && Array.isArray(engineer.children)) {
                    engineer.children.forEach(device => {
                        const deviceCoords = this.parseCoordinate(device.position)
                        if (this.isValidCoordinate(deviceCoords[0], deviceCoords[1])) {
                            validCoordinates.push({
                                lng: deviceCoords[0],
                                lat: deviceCoords[1],
                                type: 'device',
                                name: device.name,
                                online_status: device.online_status,
                                id: device.id
                            })
                        }
                    })
                }
            })
        }

        return validCoordinates
    }

    static createMarker(AMap, map, item) {
        try {
            const position = new AMap.LngLat(item.lng, item.lat)

            let content = ''
            let title = item.name

            if (item.type === 'engineer') {
                content = `<div style="background-color: #1890ff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; white-space: nowrap;">${item.name}</div>`
            } else if (item.type === 'device') {
                const color = item.online_status === 1 ? '#52c41a' : '#ff4d4f'
                const statusText = item.online_status === 1 ? '在线' : '离线'
                content = `<div style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; white-space: nowrap;">${item.name}(${statusText})</div>`
                title = `${item.name} (${statusText})`
            }

            const marker = new AMap.Marker({
                position: position,
                title: title,
                content: content,
                offset: new AMap.Pixel(-10, -34)
            })

            map.add(marker)
            return marker
        } catch (error) {
            console.error(`创建标记失败 (${item.name}):`, error)
            return null
        }
    }
}