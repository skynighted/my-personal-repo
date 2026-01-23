<template>
    <div class="data-card" :class="{ 'with-hover': hoverable }">
        <div class="card-header" v-if="$slots.header">
            <slot name="header"></slot>
        </div>
        <div class="card-content">
            <slot></slot>
        </div>
        <div class="card-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup>
defineProps({
    hoverable: {
        type: Boolean,
        default: true
    }
})
</script>

<style lang="less" scoped>
.data-card {
    background: var(--background-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &.with-hover:hover {
        border-color: rgba(64, 158, 255, 0.6);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
    }

    .card-header {
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .card-content {
        padding: 16px;
    }

    .card-footer {
        padding: 16px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
}
</style>