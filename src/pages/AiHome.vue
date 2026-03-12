<template>
    <div class="ai-home">
        <Side />
        <Chat />
    </div>
</template>

<script setup lang="ts">
import Side from '@/components/Side/Side.vue';
import Chat from '@/components/Chat/Chat.vue';
</script>

<style lang="scss" scoped>
.ai-home {
    display: flex;
    height: 100%;
}
</style>
