<template>
    <!-- 作为地图容器 -->
    <div ref="mapBox" style="height: 100%;"></div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue';
const mapBox = ref(null);
const { proxy } = getCurrentInstance();

// 验证坐标是否有效
const isValidCoordinate = (lng, lat) => {
    return !isNaN(lng) && !isNaN(lat) && 
           lng >= -180 && lng <= 180 && 
           lat >= -90 && lat <= 90;
}

// 转换坐标字符串为数字，处理可能的格式问题
const parseCoordinate = (coord) => {
    if (!coord) return [NaN, NaN];
    
    try {
        if (Array.isArray(coord)) {
            if (coord.length === 2) {
                const lng = parseFloat(coord[0]);
                const lat = parseFloat(coord[1]);
                return [lng, lat];
            } else if (coord.length === 1 && typeof coord[0] === 'string') {
                // 处理 "112.583804,37.423954" 格式
                const parts = coord[0].split(',');
                if (parts.length === 2) {
                    const lng = parseFloat(parts[0].trim());
                    const lat = parseFloat(parts[1].trim());
                    return [lng, lat];
                }
            }
        } else if (typeof coord === 'string') {
            // 处理 "112.583804,37.423954" 格式
            const parts = coord.split(',');
            if (parts.length === 2) {
                const lng = parseFloat(parts[0].trim());
                const lat = parseFloat(parts[1].trim());
                return [lng, lat];
            }
        }
    } catch (error) {
        console.error('解析坐标失败:', error, '原始坐标:', coord);
    }
    
    return [NaN, NaN];
}

// 获取有效的设备坐标
const getValidDeviceCoordinates = (response) => {
    const validCoordinates = [];
    
    if (response && response.data && Array.isArray(response.data)) {
        response.data.forEach(engineer => {
            // 处理工程坐标
            const engineerCoords = parseCoordinate(engineer.position);
            if (isValidCoordinate(engineerCoords[0], engineerCoords[1])) {
                validCoordinates.push({
                    lng: engineerCoords[0],
                    lat: engineerCoords[1],
                    type: 'engineer',
                    name: engineer.name,
                    id: engineer.id
                });
                console.log(`有效工程坐标: ${engineer.name} - [${engineerCoords[0]}, ${engineerCoords[1]}]`);
            } else {
                console.warn(`无效工程坐标: ${engineer.name} - ${engineer.position}`);
            }

            // 处理设备坐标
            if (engineer.children && Array.isArray(engineer.children)) {
                engineer.children.forEach(device => {
                    const deviceCoords = parseCoordinate(device.position);
                    if (isValidCoordinate(deviceCoords[0], deviceCoords[1])) {
                        validCoordinates.push({
                            lng: deviceCoords[0],
                            lat: deviceCoords[1],
                            type: 'device',
                            name: device.name,
                            online_status: device.online_status,
                            id: device.id
                        });
                        console.log(`有效设备坐标: ${device.name} - [${deviceCoords[0]}, ${deviceCoords[1]}]`);
                    } else {
                        console.warn(`无效设备坐标: ${device.name} - ${device.position}`);
                    }
                });
            }
        });
    }
    
    return validCoordinates;
}

// 创建地图标记
const createMapMarker = (AMap, map, item) => {
    try {
        const position = new AMap.LngLat(item.lng, item.lat);
        
        // 根据类型设置不同的标记样式
        let content = '';
        let title = item.name;
        
        if (item.type === 'engineer') {
            content = `<div style="background-color: #1890ff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; white-space: nowrap;">${item.name}</div>`;
        } else if (item.type === 'device') {
            const color = item.online_status === 1 ? '#52c41a' : '#ff4d4f';
            const statusText = item.online_status === 1 ? '在线' : '离线';
            content = `<div style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; white-space: nowrap;">${item.name}(${statusText})</div>`;
            title = `${item.name} (${statusText})`;
        }
        
        const marker = new AMap.Marker({
            position: position,
            title: title,
            content: content,
            offset: new AMap.Pixel(-10, -34) // 调整偏移量
        });
        
        map.add(marker);
        return marker;
    } catch (error) {
        console.error(`创建标记失败 (${item.name}):`, error);
        return null;
    }
}

const loadMap = async () => {
    try {
        console.log('开始加载地图...');
        
        // 等待高德地图加载
        return new Promise((resolve, reject) => {
            if (window.AMap) {
                initializeMap(window.AMap);
                resolve();
            } else {
                // 检查是否已加载
                if (window.AMapLoader) {
                    window.AMapLoader.load({
                        key: "c1eaa446667d170242a1e59328ebca88",
                        version: "2.0",
                    })
                    .then((AMap) => {
                        window.AMap = AMap;
                        initializeMap(AMap);
                        resolve();
                    })
                    .catch((e) => {
                        console.error('地图加载失败:', e);
                        reject(e);
                    });
                } else {
                    console.error('高德地图Loader未找到');
                    reject(new Error('高德地图Loader未找到'));
                }
            }
        });
    } catch (error) {
        console.error('加载地图失败:', error);
        // 尝试创建简单的地图
        createSimpleMap();
    }
}

const initializeMap = async (AMap) => {
    try {
        // 先获取设备树数据
        const response = await proxy.$api.getEngineerDeviceTree();
        console.log('设备树数据原始响应:', response);
        
        // 获取有效的设备坐标
        const validCoordinates = getValidDeviceCoordinates(response);
        console.log('有效坐标:', validCoordinates);
        
        // 设置默认中心点
        let center = [103,36];
        
        // 如果有有效坐标，计算中心点
        if (validCoordinates.length > 0) {
            // 计算所有坐标的平均值作为中心点
            const sumLng = validCoordinates.reduce((sum, item) => sum + item.lng, 0);
            const sumLat = validCoordinates.reduce((sum, item) => sum + item.lat, 0);
            center = [sumLng / validCoordinates.length, sumLat / validCoordinates.length];
        }
        
        console.log('地图中心点:', center);
        
        // 创建地图 - 使用简单配置
        const map = new AMap.Map(mapBox.value, {
            viewMode: '2D', // 使用2D模式避免3D问题
            zoom: 5, // 初始缩放级别
            center: center,
            mapStyle: 'amap://styles/normal'// 使用标准样式
        });
        
        console.log('地图创建成功');
        
        // 添加标记
        if (validCoordinates.length > 0) {
            validCoordinates.forEach(item => {
                createMapMarker(AMap, map, item);
            });
        } else {
            // 如果没有有效坐标，添加默认标记
            console.log('没有有效坐标，使用默认标记');
            const position = new AMap.LngLat(104.195, 35.861);
            const marker = new AMap.Marker({
                position: position,
                title: '中国大气环境监测中心'
            });
            map.add(marker);
        }
        
        // 尝试添加控件（如果存在）
        try {
            if (AMap.Scale) {
                map.addControl(new AMap.Scale());
            }
            if (AMap.ToolBar) {
                map.addControl(new AMap.ToolBar());
            }
        } catch (ctrlError) {
            console.warn('地图控件添加失败:', ctrlError);
        }
        
        console.log('地图加载完成');
    } catch (error) {
        console.error('初始化地图数据失败:', error);
        // 创建简单的地图
        createSimpleMapWithAMap(AMap);
    }
}

const createSimpleMap = () => {
    // 使用备用方法加载地图
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=c1eaa446667d170242a1e59328ebca88&callback=initSimpleMap`;
    script.onerror = () => {
        console.error('无法加载高德地图脚本');
        showMapError();
    };
    document.head.appendChild(script);
    
    // 定义回调函数
    window.initSimpleMap = () => {
        const map = new AMap.Map(mapBox.value, {
            zoom: 5,
            center: [104.195, 35.861]
        });
        
        const marker = new AMap.Marker({
            position: [104.195, 35.861],
            title: '大气环境监测中心'
        });
        map.add(marker);
    };
}

const createSimpleMapWithAMap = (AMap) => {
    try {
        const map = new AMap.Map(mapBox.value, {
            viewMode: '2D',
            zoom: 5,
            center: [104.195, 35.861]
        });
        
        const marker = new AMap.Marker({
            position: [104.195, 35.861],
            title: '大气环境监测中心'
        });
        map.add(marker);
    } catch (error) {
        console.error('创建简单地图失败:', error);
        showMapError();
    }
}

const showMapError = () => {
    mapBox.value.innerHTML = `
        <div style="color: white; text-align: center; padding: 20px;">
            <h3>地图加载失败</h3>
            <p>无法加载地图数据，请检查网络连接或配置</p>
            <p>设备位置信息:</p>
            <div id="device-list" style="text-align: left; margin-top: 10px;"></div>
        </div>
    `;
    
    // 显示设备列表作为备用
    proxy.$api.getEngineerDeviceTree().then(response => {
        if (response.data) {
            const deviceList = document.getElementById('device-list');
            let html = '<ul>';
            response.data.forEach(engineer => {
                html += `<li><strong>${engineer.name}</strong></li>`;
                if (engineer.children && engineer.children.length > 0) {
                    html += '<ul>';
                    engineer.children.forEach(device => {
                        const status = device.online_status === 1 ? '在线' : '离线';
                        html += `<li>${device.name} - ${status} - 坐标: ${device.position}</li>`;
                    });
                    html += '</ul>';
                }
            });
            html += '</ul>';
            deviceList.innerHTML = html;
        }
    });
}

onMounted(() => {
    console.log('地图组件挂载');
    // 延迟加载地图，确保DOM完全渲染
    setTimeout(() => {
        loadMap();
    }, 500);
})
</script>
<style lang="less" scoped>
/* 确保地图容器有明确的大小 */
:deep(#mapBox) {
    width: 100%;
    height: 100%;
    min-height: 400px;
}
</style>