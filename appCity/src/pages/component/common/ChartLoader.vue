<template>
    <div class="chart-loader">
        <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <div class="loading-text">数据加载中...</div>
        </div>
        <div v-else-if="error" class="error-state">
            <span class="error-icon">⚠️</span>
            <div class="error-text">{{ error }}</div>
            <slot name="retry">
                <button class="retry-btn" @click="$emit('retry')">重试</button>
            </slot>
        </div>
        <slot v-else></slot>
    </div>
</template>

<script setup>
defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: ''
    }
})

defineEmits(['retry'])
</script>

<style lang="less" scoped>
.chart-loader {
    height: 100%;

    .loading-state {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--text-tertiary);

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 12px;
        }

        .loading-text {
            font-size: 14px;
        }
    }

    .error-state {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: var(--error-color);

        .error-icon {
            font-size: 32px;
            margin-bottom: 12px;
        }

        .error-text {
            font-size: 14px;
            margin-bottom: 16px;
            max-width: 80%;
        }

        .retry-btn {
            padding: 8px 16px;
            background: rgba(245, 34, 45, 0.1);
            border: 1px solid rgba(245, 34, 45, 0.3);
            color: var(--error-color);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                background: rgba(245, 34, 45, 0.2);
                transform: translateY(-1px);
            }
        }
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>