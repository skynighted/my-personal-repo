<template>
    <div>
        <Title :title="title"></Title>
        <div v-if="loading" style="color: white; text-align: center; margin-top: 20px; font-size: 14px;">
            加载中...
        </div>
        <div v-else-if="error" style="color: #ff6b6b; text-align: center; margin-top: 20px; font-size: 14px;">
            加载失败: {{ error }}
        </div>
        <div v-else ref="chartContainer" style="height: 180px; margin-top: 10px;"></div>
    </div>
</template>
<script setup>
import Title from './Title.vue';
import { ref, onMounted, getCurrentInstance, nextTick } from 'vue';
import { Column } from '@antv/g2plot';

const title = ref("服务事项概览");
const loading = ref(false);
const error = ref('');
const chartContainer = ref(null);
const chartInstance = ref(null); // 保存图表实例
const { proxy } = getCurrentInstance();

// 销毁图表实例
const destroyChart = () => {
    if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null;
    }
};

const loadServiceData = async () => {
    loading.value = true;
    error.value = '';
    destroyChart(); // 清除之前的图表实例

    try {
        // 调用API服务方法
        const data = await proxy.$api.getServiceOverview();
        console.log('服务事项处理数据:', data);

        if (!data || data.length === 0) {
            error.value = '暂无数据';
            loading.value = false;
            return;
        }

        // 简化工程名称以适合显示
        const simplifiedData = data.map(item => ({
            name: item.name.length > 6 ? item.name.substring(0, 6) + '...' : item.name,
            fullName: item.fullName || item.name,
            value: item.value || 0
        }));

        // 等待DOM更新
        await nextTick();

        // 检查容器是否存在
        if (!chartContainer.value) {
            console.warn('图表容器尚未准备好，延迟初始化...');
            setTimeout(() => {
                if (chartContainer.value) {
                    initChart(simplifiedData);
                } else {
                    error.value = '图表容器初始化失败';
                }
            }, 100);
            return;
        }

        initChart(simplifiedData);
    } catch (err) {
        console.error('加载服务事项数据失败:', err);
        error.value = err.message || '加载失败';

        // 使用示例数据
        const exampleData = [
            { name: '山西农大', value: 1, fullName: '山西农大主体育场工程' },
            { name: '太原理工', value: 3, fullName: '太原理工大学一号教学楼工程' },
            { name: '中北大学', value: 0, fullName: '中北大学' },
            { name: '兰州理工', value: 2, fullName: '兰州理工大学' },
            { name: '包头师范', value: 1, fullName: '包头师范学院' }
        ];

        await nextTick();
        if (chartContainer.value) {
            initChart(exampleData);
        }
    } finally {
        loading.value = false;
    }
};

// 初始化图表
const initChart = (data) => {
    try {
        // 确保容器存在
        if (!chartContainer.value) {
            console.error('图表容器不存在');
            error.value = '图表容器不存在';
            return;
        }

        // 检查容器是否已挂载到DOM
        if (!chartContainer.value.parentNode) {
            console.error('图表容器尚未挂载到DOM');
            error.value = '图表容器尚未挂载';
            return;
        }

        // 清理容器内容
        chartContainer.value.innerHTML = '';

        const column = new Column(chartContainer.value, {
            data: data,
            xField: 'name',
            yField: 'value',
            label: {
                style: {
                    fill: 'white'
                }
            },
            xAxis: {
                label: {
                    style: {
                        fill: 'white',
                        fontSize: 8,
                    },
                    autoRotate: false
                }
            },
            yAxis: {
                label: {
                    style: {
                        fill: 'white',
                        fontSize: 10,
                    }
                }
            },
            color: ({ name }) => {
                const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];
                const index = data.findIndex(item => item.name === name);
                return colors[index % colors.length];
            },
            tooltip: {
                customContent: (title, items) => {
                    const item = items[0];
                    if (item) {
                        const fullName = data.find(d => d.name === item.name)?.fullName || item.name;
                        return `<div style="padding: 8px; background: #1f1f1f; border: 1px solid #333;">
                            <div style="color: white; font-weight: bold;">${fullName}</div>
                            <div style="color: #ccc;">设备数量: ${item.value}</div>
                        </div>`;
                    }
                    return '';
                }
            }
        });

        column.render();
        chartInstance.value = column; // 保存图表实例
        console.log('图表初始化成功');
    } catch (err) {
        console.error('初始化图表失败:', err);
        error.value = `图表初始化失败: ${err.message}`;
    }
};

onMounted(() => {
    // 延迟加载数据，确保DOM完全渲染
    setTimeout(() => {
        loadServiceData();
    }, 100);
});

// 组件卸载时清理
import { onUnmounted } from 'vue';
onUnmounted(() => {
    destroyChart();
});
</script>
<style lang="less" scoped></style>