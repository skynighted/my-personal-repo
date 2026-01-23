[Bottom4.vue]
<template>
    <div>
        <Title :title="title"></Title>
        <div class="monitoring-video">
            <div class="video-container">
                <div class="video-item" v-for="(camera, index) in cameras" :key="index">
                    <div class="video-header">
                        <div class="camera-info">
                            <span class="camera-name">{{ camera.name }}</span>
                            <span class="camera-status" :class="camera.status">
                                <span class="status-dot"></span>
                                {{ camera.status === 'online' ? '在线' : '离线' }}
                            </span>
                        </div>
                    </div>
                    <div class="video-content" :class="{ 'offline': camera.status === 'offline' }">
                        <div v-if="camera.status === 'online'" class="live-video">
                            <div class="video-placeholder">
                                <div class="timestamp">{{ camera.time }}</div>
                                <div class="overlay-info">
                                    <span class="temp">{{ camera.temperature }}°C</span>
                                    <span class="humidity">{{ camera.humidity }}%</span>
                                </div>
                                <div class="video-controls">
                                    <button class="control-btn" @click="toggleFullscreen(camera)">
                                        <i class="fullscreen-icon">⛶</i>
                                    </button>
                                    <button class="control-btn" @click="toggleSound(camera)">
                                        <i class="sound-icon">{{ camera.soundOn ? '🔊' : '🔇' }}</i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-else class="offline-placeholder">
                            <i class="offline-icon">📷</i>
                            <p>摄像头离线</p>
                            <button class="reconnect-btn" @click="reconnectCamera(camera)">重新连接</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Title from './Title.vue';
import { ref, onMounted, onUnmounted } from 'vue';

const title = ref("监测视频");

// 只保留两个摄像头数据
const cameras = ref([
    {
        id: 1,
        name: '一号设备',
        status: 'online',
        temperature: 21.5,
        humidity: 55,
        time: '14:30:25',
        soundOn: false
    },
    {
        id: 2,
        name: '二号设备',
        status: 'online',
        temperature: 20.8,
        humidity: 52,
        time: '14:30:30',
        soundOn: false
    }
]);

// 更新时间戳
let timeInterval = null;
const updateTime = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    cameras.value.forEach(camera => {
        if (camera.status === 'online') {
            camera.time = timeStr;
        }
    });
};

// 模拟数据更新
const updateSensorData = () => {
    cameras.value.forEach(camera => {
        if (camera.status === 'online') {
            // 模拟温度微小变化
            camera.temperature = parseFloat((20 + Math.random() * 3).toFixed(1));
            camera.humidity = Math.floor(50 + Math.random() * 10);
        }
    });
};

// 切换声音
const toggleSound = (camera) => {
    if (camera.status === 'online') {
        camera.soundOn = !camera.soundOn;
        console.log(`${camera.name} 声音${camera.soundOn ? '开启' : '关闭'}`);
    }
};

// 切换全屏
const toggleFullscreen = (camera) => {
    console.log(`${camera.name} 切换全屏`);
    // 实际项目中这里应该实现全屏功能
    alert(`即将全屏显示 ${camera.name}，实际项目中会打开全屏视频`);
};

// 重新连接摄像头
const reconnectCamera = (camera) => {
    console.log(`尝试重新连接 ${camera.name}`);
    camera.status = 'online';
    camera.temperature = 21.2;
    camera.humidity = 56;
    camera.time = new Date().toTimeString().split(' ')[0];
};

onMounted(() => {
    // 每秒更新时间
    timeInterval = setInterval(updateTime, 1000);

    // 每5秒更新传感器数据
    setInterval(updateSensorData, 5000);
});

onUnmounted(() => {
    if (timeInterval) {
        clearInterval(timeInterval);
    }
});
</script>

<style lang="less" scoped>
.monitoring-video {
    margin-top: 15px;
    height: 220px;

    .video-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px;
        height: 100%;

        .video-item {
            background: rgba(20, 40, 80, 0.8);
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid rgba(64, 158, 255, 0.4);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            height: 180px;
            transition: all 0.3s ease;

            &:hover {
                border-color: rgba(64, 158, 255, 0.8);
                box-shadow: 0 6px 20px rgba(64, 158, 255, 0.3);
                transform: translateY(-2px);
            }

            .video-header {
                padding: 10px 15px;
                background: linear-gradient(90deg, rgba(30, 60, 120, 0.9) 0%, rgba(20, 40, 80, 0.9) 100%);
                border-bottom: 1px solid rgba(64, 158, 255, 0.3);

                .camera-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .camera-name {
                        color: #fff;
                        font-weight: 600;
                        font-size: 14px;
                        letter-spacing: 0.5px;
                    }

                    .camera-status {
                        font-size: 12px;
                        padding: 3px 10px;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        gap: 5px;

                        &.online {
                            background: rgba(103, 194, 58, 0.15);
                            color: #67c23a;
                            border: 1px solid rgba(103, 194, 58, 0.3);
                        }

                        &.offline {
                            background: rgba(245, 108, 108, 0.15);
                            color: #f56c6c;
                            border: 1px solid rgba(245, 108, 108, 0.3);
                        }

                        .status-dot {
                            width: 6px;
                            height: 6px;
                            border-radius: 50%;

                            .online & {
                                background-color: #67c23a;
                                box-shadow: 0 0 6px #67c23a;
                            }

                            .offline & {
                                background-color: #f56c6c;
                                box-shadow: 0 0 6px #f56c6c;
                            }
                        }
                    }
                }
            }

            .video-content {
                position: relative;
                flex: 1;
                min-height: 0;

                &.offline {
                    background: rgba(10, 20, 40, 0.9);
                }

                .live-video {
                    position: relative;
                    height: 100%;
                    width: 100%;

                    .video-placeholder {
                        height: 100%;
                        width: 100%;
                        background: linear-gradient(135deg, #0c1e3d 0%, #162b4d 100%);
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        // 添加网格背景
                        &::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background-image:
                                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                            background-size: 20px 20px;
                        }

                        .timestamp {
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            background: rgba(0, 0, 0, 0.8);
                            color: #fff;
                            padding: 3px 10px;
                            border-radius: 4px;
                            font-size: 11px;
                            font-family: 'Courier New', monospace;
                            letter-spacing: 1px;
                            border: 1px solid rgba(255, 255, 255, 0.1);
                        }

                        .overlay-info {
                            position: absolute;
                            bottom: 10px;
                            left: 10px;
                            display: flex;
                            gap: 10px;

                            .temp,
                            .humidity {
                                background: rgba(0, 0, 0, 0.8);
                                color: #fff;
                                padding: 4px 10px;
                                border-radius: 4px;
                                font-size: 12px;
                                font-weight: 500;
                                display: flex;
                                align-items: center;
                                gap: 4px;
                                border: 1px solid rgba(255, 255, 255, 0.1);
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                            }

                            .temp {
                                color: #ff9900;

                                &::before {
                                    content: '🌡️';
                                    font-size: 10px;
                                }
                            }

                            .humidity {
                                color: #3399ff;

                                &::before {
                                    content: '💧';
                                    font-size: 10px;
                                }
                            }
                        }

                        .video-controls {
                            position: absolute;
                            bottom: 10px;
                            right: 10px;
                            display: flex;
                            gap: 8px;

                            .control-btn {
                                background: rgba(0, 0, 0, 0.8);
                                border: 1px solid rgba(255, 255, 255, 0.2);
                                color: #fff;
                                width: 28px;
                                height: 28px;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                transition: all 0.2s ease;
                                font-size: 12px;
                                backdrop-filter: blur(4px);

                                &:hover {
                                    background: rgba(64, 158, 255, 0.9);
                                    border-color: rgba(64, 158, 255, 0.8);
                                    transform: scale(1.1);
                                    box-shadow: 0 0 10px rgba(64, 158, 255, 0.5);
                                }

                                &:active {
                                    transform: scale(0.95);
                                }
                            }
                        }

                        // 中心摄像头图标
                        &::after {
                            content: '';
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 50px;
                            height: 40px;
                            background: rgba(0, 0, 0, 0.3);
                            border-radius: 8px;
                            border: 2px solid rgba(255, 255, 255, 0.2);

                            // 摄像头镜头
                            &::before {
                                content: '';
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                width: 24px;
                                height: 24px;
                                background: radial-gradient(circle, rgba(0, 0, 0, 0.8) 30%, rgba(64, 158, 255, 0.4) 100%);
                                border-radius: 50%;
                                border: 1px solid rgba(255, 255, 255, 0.3);
                                box-shadow: 0 0 15px rgba(64, 158, 255, 0.3);
                            }
                        }
                    }
                }

                .offline-placeholder {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #999;
                    padding: 20px;

                    .offline-icon {
                        font-size: 40px;
                        margin-bottom: 12px;
                        opacity: 0.4;
                        animation: pulse 2s infinite;
                    }

                    p {
                        margin-bottom: 12px;
                        color: #ccc;
                        font-size: 13px;
                        text-align: center;
                    }

                    .reconnect-btn {
                        background: linear-gradient(135deg, rgba(64, 158, 255, 0.2), rgba(64, 158, 255, 0.4));
                        border: 1px solid rgba(64, 158, 255, 0.6);
                        color: #409eff;
                        padding: 5px 15px;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-size: 12px;
                        font-weight: 500;

                        &:hover {
                            background: linear-gradient(135deg, rgba(64, 158, 255, 0.3), rgba(64, 158, 255, 0.5));
                            transform: translateY(-1px);
                            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
                        }

                        &:active {
                            transform: translateY(0);
                        }
                    }
                }
            }
        }
    }
}

@keyframes pulse {
    0% {
        opacity: 0.4;
    }

    50% {
        opacity: 0.7;
    }

    100% {
        opacity: 0.4;
    }
}

@keyframes rotate {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

/* 响应式设计 */
@media (max-width: 1200px) {
    .monitoring-video .video-container {
        grid-template-columns: 1fr;
        grid-gap: 10px;
    }
}
</style>