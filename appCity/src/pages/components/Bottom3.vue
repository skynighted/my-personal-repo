<template>
    <div>
        <Title :title="title"></Title>
        <div class="monitoring-points">
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="error" class="error">加载失败: {{ error }}</div>
            <div v-else class="points-content">
                <div class="points-list">
                    <div class="point-item" v-for="point in points" :key="point.id">
                        <div class="point-header">
                            <div class="point-name">{{ point.name }}</div>
                            <div class="point-status" :class="point.statusClass">{{ point.status }}</div>
                        </div>
                        <div class="point-details">
                            <div class="point-engineer">所属工程: {{ point.engineer }}</div>
                            <div class="point-position">位置: {{ point.position }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Title from './Title.vue';
import { ref, onMounted, getCurrentInstance } from 'vue';

const title = ref("监测点信息");
const loading = ref(true);
const error = ref('');
const { proxy } = getCurrentInstance();

const points = ref([]);

onMounted(async () => {
    loading.value = true;
    try {
        // 从API获取监测点信息
        const apiPoints = await proxy.$api.getMonitoringPoints();
        console.log('API返回监测点:', apiPoints);

        if (apiPoints && apiPoints.length > 0) {
            points.value = apiPoints.map((point, index) => ({
                id: point.id || index + 1,
                name: point.name,
                engineer: point.engineer,
                status: point.status,
                statusClass: point.statusClass || (point.status === '在线' ? 'online' : 'offline'),
                position: point.position
            }));
        } else {
            // 使用默认数据
            points.value = [
                { id: 1, name: '一号设备', engineer: '太原理工大学一号教学楼工程', status: '在线', statusClass: 'online', position: '经度: 112.5225, 纬度: 37.8614' },
                { id: 2, name: '二号设备', engineer: '太原理工大学一号教学楼工程', status: '在线', statusClass: 'online', position: '经度: 112.5218, 纬度: 37.8618' },
                { id: 3, name: '三号设备', engineer: '山西农大主体育场工程', status: '离线', statusClass: 'offline', position: '经度: 112.5838, 纬度: 37.4239' },
                { id: 4, name: '四号设备', engineer: '兰州理工大学', status: '在线', statusClass: 'online', position: '经度: 103.7765, 纬度: 36.0552' }
            ];
        }
    } catch (err) {
        console.error('获取监测点信息失败:', err);
        error.value = err.message || '加载失败';
        // 使用默认数据
        points.value = [
            { id: 1, name: '一号设备', engineer: '太原理工大学一号教学楼工程', status: '在线', statusClass: 'online', position: '经度: 112.5225, 纬度: 37.8614' },
            { id: 2, name: '二号设备', engineer: '太原理工大学一号教学楼工程', status: '在线', statusClass: 'online', position: '经度: 112.5218, 纬度: 37.8618' },
            { id: 3, name: '三号设备', engineer: '山西农大主体育场工程', status: '离线', statusClass: 'offline', position: '经度: 112.5838, 纬度: 37.4239' },
            { id: 4, name: '四号设备', engineer: '兰州理工大学', status: '在线', statusClass: 'online', position: '经度: 103.7765, 纬度: 36.0552' }
        ];
    } finally {
        loading.value = false;
    }
});
</script>

<style lang="less" scoped>
.monitoring-points {
    padding: 10px;
    color: white;
    height: 180px;
    overflow-y: auto;

    .loading {
        text-align: center;
        margin-top: 20px;
    }

    .error {
        color: #ff6b6b;
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
    }

    .points-list {
        .point-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            padding: 10px;
            margin-bottom: 10px;
            border-left: 3px solid #1890ff;

            .point-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;

                .point-name {
                    font-size: 14px;
                    font-weight: bold;
                    color: #fff;
                }

                .point-status {
                    font-size: 12px;
                    padding: 2px 8px;
                    border-radius: 10px;

                    &.online {
                        background: rgba(82, 196, 26, 0.2);
                        color: #52c41a;
                    }

                    &.offline {
                        background: rgba(255, 77, 79, 0.2);
                        color: #ff4d4f;
                    }
                }
            }

            .point-details {
                font-size: 12px;
                color: #ccc;

                .point-engineer {
                    margin-bottom: 4px;
                }

                .point-position {
                    color: #aaa;
                }
            }
        }
    }
}
</style>