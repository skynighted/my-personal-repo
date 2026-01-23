<template>
    <div>
        <Title :title="title"></Title>
        <div class="monthly-report">
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="error" class="error">加载失败: {{ error }}</div>
            <div v-else class="report-content">
                <div class="summary">
                    <div class="summary-item">
                        <div class="label">监测天数</div>
                        <div class="value">{{ stats.days }}天</div>
                    </div>
                    <div class="summary-item">
                        <div class="label">异常次数</div>
                        <div class="value">{{ stats.anomalies }}次</div>
                    </div>
                    <div class="summary-item">
                        <div class="label">平均温度</div>
                        <div class="value">{{ stats.avgTemperature }}℃</div>
                    </div>
                    <div class="summary-item">
                        <div class="label">平均湿度</div>
                        <div class="value">{{ stats.avgHumidity }}%</div>
                    </div>
                </div>
                <div class="report-list">
                    <div class="report-item" v-for="item in reports" :key="item.date">
                        <div class="date">{{ item.date }}</div>
                        <div class="status" :class="item.status">{{ item.statusText }}</div>
                        <div class="description">{{ item.description }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Title from './Title.vue';
import { ref, onMounted, getCurrentInstance, computed } from 'vue';
import { getConsistentTemperatureData } from './temperatureData';

const title = ref("监测月报");
const loading = ref(true);
const error = ref('');
const stats = ref({
    days: 0,
    avgTemperature: '0.0',
    avgHumidity: '0.0',
    anomalies: 0
});
const reports = ref([]);
const { proxy } = getCurrentInstance();


const generateMockHumidityData = () => {
    const data = [];
    const today = new Date();

    for (let i = 7; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        // 模拟湿度在 45-55% 之间波动
        const baseHumidity = 50.0;
        const randomOffset = (Math.random() - 0.5) * 2; // -1 到 +1
        const value = baseHumidity + randomOffset;

        data.push({
            date: dateStr,
            value: parseFloat(value.toFixed(1))
        });
    }

    return data;
};

// 生成模拟颗粒物数据（与Right2.vue保持一致）
const generateMockParticulateData = () => {
    const data = [];
    const today = new Date();

    for (let i = 7; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        // 模拟PM2.5数据 (50-60之间)
        const pm25Base = 55.0;
        const pm25Offset = (Math.random() - 0.5) * 2; // -1 到 +1
        const pm25Value = pm25Base + pm25Offset;

        // 模拟PM10数据 (90-100之间)
        const pm10Base = 95.0;
        const pm10Offset = (Math.random() - 0.5) * 2; // -1 到 +1
        const pm10Value = pm10Base + pm10Offset;

        data.push({
            date: dateStr,
            value: parseFloat(pm25Value.toFixed(1)),
            type: 'PM2.5'
        });

        data.push({
            date: dateStr,
            value: parseFloat(pm10Value.toFixed(1)),
            type: 'PM10'
        });
    }

    return data;
};

// 计算统计信息
const calculateStats = (temperatureData, humidityData, particulateData) => {
    // 监测天数：使用温度数据的长度（因为所有数据都是8天）
    const days = temperatureData.length;

    // 计算平均温度
    const avgTemperature = temperatureData.length > 0
        ? (temperatureData.reduce((sum, item) => sum + item.value, 0) / temperatureData.length).toFixed(1)
        : '0.0';

    // 计算平均湿度
    const avgHumidity = humidityData.length > 0
        ? (humidityData.reduce((sum, item) => sum + item.value, 0) / humidityData.length).toFixed(1)
        : '0.0';

    // 计算异常次数（根据颗粒物数据）
    let anomalies = 0;

    // 按日期分组颗粒物数据
    const particulateByDate = {};
    particulateData.forEach(item => {
        if (!particulateByDate[item.date]) {
            particulateByDate[item.date] = [];
        }
        particulateByDate[item.date].push(item);
    });

    // 检查每天是否有异常（PM2.5 > 75 或 PM10 > 150）
    Object.values(particulateByDate).forEach(dateData => {
        const hasPM25Anomaly = dateData.some(item => item.type === 'PM2.5' && item.value > 75);
        const hasPM10Anomaly = dateData.some(item => item.type === 'PM10' && item.value > 150);

        if (hasPM25Anomaly || hasPM10Anomaly) {
            anomalies++;
        }
    });

    return {
        days,
        avgTemperature,
        avgHumidity,
        anomalies
    };
};

// 生成报告
const generateReports = (temperatureData, humidityData, particulateData) => {
    const reports = [];

    // 按日期分组颗粒物数据
    const particulateByDate = {};
    particulateData.forEach(item => {
        if (!particulateByDate[item.date]) {
            particulateByDate[item.date] = [];
        }
        particulateByDate[item.date].push(item);
    });

    // 生成最近4天的报告
    const recentDates = temperatureData.slice(-4).map(item => item.date);

    recentDates.forEach((date, index) => {
        const dateParticulate = particulateByDate[date] || [];
        const hasPM25Anomaly = dateParticulate.some(item => item.type === 'PM2.5' && item.value > 75);
        const hasPM10Anomaly = dateParticulate.some(item => item.type === 'PM10' && item.value > 150);

        let status = 'normal';
        let statusText = '正常';
        let description = '各项指标正常';

        if (hasPM25Anomaly && hasPM10Anomaly) {
            status = 'warning';
            statusText = '预警';
            description = 'PM2.5和PM10值超标';
        } else if (hasPM25Anomaly) {
            status = 'warning';
            statusText = '预警';
            description = 'PM2.5值超标';
        } else if (hasPM10Anomaly) {
            status = 'warning';
            statusText = '预警';
            description = 'PM10值超标';
        } else {
            // 检查温度和湿度是否在合理范围内
            const tempData = temperatureData.find(item => item.date === date);
            const humidData = humidityData.find(item => item.date === date);

            if (tempData && tempData.value > 25) {
                status = 'warning';
                statusText = '预警';
                description = '温度偏高';
            } else if (tempData && tempData.value < 15) {
                status = 'warning';
                statusText = '预警';
                description = '温度偏低';
            } else if (humidData && humidData.value > 70) {
                status = 'warning';
                statusText = '预警';
                description = '湿度过高';
            } else if (humidData && humidData.value < 30) {
                status = 'warning';
                statusText = '预警';
                description = '湿度过低';
            }
        }

        reports.push({
            date: date,
            status,
            statusText,
            description
        });
    });

    return reports.reverse(); // 按日期从新到旧排序
};

onMounted(async () => {
    try {
        loading.value = true;
        error.value = '';

        // 获取温度数据（使用共享的硬编码数据）
        const temperatureData = getConsistentTemperatureData();

        // 获取湿度数据
        let humidityData = [];
        if (proxy && proxy.$api && proxy.$api.getHumidityData) {
            humidityData = await proxy.$api.getHumidityData(1, 1);
        }
        if (!humidityData || humidityData.length === 0) {
            humidityData = generateMockHumidityData();
        }

        // 获取颗粒物数据
        let particulateData = [];
        if (proxy && proxy.$api && proxy.$api.getParticulateData) {
            particulateData = await proxy.$api.getParticulateData(1, 1);
        }
        if (!particulateData || particulateData.length === 0) {
            particulateData = generateMockParticulateData();
        }

        console.log('月报计算使用的数据:', {
            temperatureData,
            humidityData,
            particulateData
        });

        // 计算统计信息
        stats.value = calculateStats(temperatureData, humidityData, particulateData);

        // 生成报告
        reports.value = generateReports(temperatureData, humidityData, particulateData);

    } catch (err) {
        console.error('加载月报数据失败:', err);
        error.value = err.message || '加载失败';

        // 使用后备数据计算
        const temperatureData = getHardcodedTemperatureData();
        const humidityData = generateMockHumidityData();
        const particulateData = generateMockParticulateData();

        stats.value = calculateStats(temperatureData, humidityData, particulateData);
        reports.value = generateReports(temperatureData, humidityData, particulateData);
    } finally {
        loading.value = false;
    }
});
</script>

<style lang="less" scoped>
.monthly-report {
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

    .summary {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-bottom: 15px;

        .summary-item {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            padding: 8px;
            text-align: center;

            .label {
                font-size: 12px;
                color: #ccc;
                margin-bottom: 4px;
            }

            .value {
                font-size: 14px;
                font-weight: bold;
                color: #fff;
            }
        }
    }

    .report-list {
        .report-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .date {
                font-size: 12px;
                color: #ccc;
                width: 50px;
            }

            .status {
                font-size: 12px;
                padding: 2px 8px;
                border-radius: 10px;
                width: 50px;
                text-align: center;

                &.normal {
                    background: rgba(82, 196, 26, 0.2);
                    color: #52c41a;
                }

                &.warning {
                    background: rgba(250, 173, 20, 0.2);
                    color: #faad14;
                }
            }

            .description {
                font-size: 12px;
                color: #fff;
                flex: 1;
                margin-left: 10px;
            }
        }
    }
}
</style>