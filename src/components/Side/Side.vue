<template>
    <div class="side">
        <div class="side-head">
            <a href="https://github.com/shenjipo" target="_blank">
                <img src="/imgs/github.svg" alt="">
            </a>

        </div>
        <div class="side-content">
            <div class="menu-item" v-for="item in menuList" :key="item.name">
                {{ item.name }}
                <a :href="item.url" target="_blank">
                    <el-icon style="margin-left: 8px;">
                        <Link />
                    </el-icon>
                </a>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { MenuItem } from './interface';
import { Link } from '@element-plus/icons-vue'


const menuList = ref<Array<MenuItem>>([
    { name: 'AiChat demo仓库', url: 'https://github.com/shenjipo/AiChatDemo' },
    { name: 'mention-input仓库', url: 'https://github.com/shenjipo/MentionEditor' }
])
</script>

<style scoped>
.side {
    width: 260px;
    background-color: var(--gray-2);
    height: 100%;
    border-right: 1px solid var(--gray-3);
    font-size: 14px;

    .side-head {
        padding: 8px 16px;
        border-bottom: 1px solid var(--gray-3);
    }

    .side-content {
        padding: 8px;

        .menu-item {
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-top: 8px;
            padding: 8px;
            border-radius: 8px;

            &:hover {
                background-color: var(--gray-3);
            }

            &.selected {
                background-color: var(--gray-4);
            }
        }
    }
}
</style>
