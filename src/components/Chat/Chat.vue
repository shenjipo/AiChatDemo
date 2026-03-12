<template>
    <div class="chat">
        <el-select class="select-model" v-model="currentModel">
            <el-option label="Doubao-Seed-1.6-flash" value="Doubao-Seed-1.6-flash"></el-option>
        </el-select>
        <MentionInput @submit="handleSubmit" :isAiLoading="isAiLoading" />

        <div class="chat-list" ref="chatListRef">
            <div class="chat-item" v-for="item in chatList" :key="item.question.time">
                <div class="chat-question">
                    <div class="question-info">
                        {{ item.question.time }}
                    </div>
                    <div class="question-content">
                        {{ item.question.content }}
                    </div>

                </div>
                <div class="chat-loading" v-if="item.state === AiState.loading" v-ai-loading="true">
                    加载中...
                </div>
                <div class="chat-answer markdown" v-html="item.answer.htmlText"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AiApi } from '@/api/AiApi';
import { computed, nextTick, onMounted, ref } from 'vue';
import MentionInput from './MentionInput.vue';
import type { AIMessage, ChatItem, } from '@/model/AiModel';
import { AiState, DoubaoRole } from '@/model/AiModel';
import { MarkdownUtils } from '@/utils/MarkdownUtils';
import { DateUtils } from '@/utils/DateUtils';


const currentModel = ref('Doubao-Seed-1.6-flash')
const chatList = ref<Array<ChatItem>>([])
const chatListRef = ref<HTMLElement>()

const isAiLoading = computed(() => {
    if (!chatList.value.length) {
        return false
    }
    return [AiState.loading, AiState.answering].includes(chatList.value[chatList.value.length - 1].state)
})

onMounted(() => {

})

const handleSubmit = (question: string) => {
    chatList.value.push({
        question: {
            role: DoubaoRole.user,
            content: question,
            time: DateUtils.FormatDate(),
        },
        answer: {
            role: DoubaoRole.assistant,
            mdText: '',
            htmlText: '',
            time: '',
        },
        state: AiState.loading,
    })
    const len = chatList.value.length - 1
    const messages: Array<AIMessage> = [
        {
            content: '请以 Markdown 格式返回结果',
            role: DoubaoRole.system
        }
    ]
    chatList.value.forEach((item, index) => {
        if (index === len) {
            messages.push({
                content: item.question.content,
                role: DoubaoRole.user
            })
        } else {
            messages.push({
                content: item.question.content,
                role: DoubaoRole.user
            })
            messages.push({
                content: item.answer.mdText,
                role: DoubaoRole.assistant
            })
        }
    })

    nextTick(() => {
        scrollToEnd()
    })
    AiApi.Chat({
        messages: messages,
        onMessage: async (message) => {
            const chat = chatList.value[len]
            chat.state = AiState.answering
            chat.answer.mdText += message
            chat.answer.htmlText = await MarkdownUtils.md2Html(chat.answer.mdText)

            nextTick(() => {
                scrollToEnd()
            })
        },
        onComplete: () => {
            const chat = chatList.value[len]
            chat.state = AiState.done
        },
        onError: (error) => {
            const chat = chatList.value[len]
            chat.state = AiState.error
            chat.answer.mdText = ''
            chat.answer.htmlText = error
        }
    })
}

const scrollToEnd = () => {
    const dom = chatListRef.value
    if (!dom) {
        return
    }
    dom.scrollTo({
        top: dom.scrollHeight,
        behavior: 'smooth',
    })
}
</script>

<style lang="scss" scoped>
.chat {
    position: relative;
    width: calc(100% - 260px - 1px);
    height: 100%;


    .select-model {
        width: 200px;
        position: absolute;
        left: 24px;
        top: 24px;
    }

    .chat-list {
        width: calc(100% - 500px);
        padding: 0 250px;
        height: calc(100% - 200px);
        overflow-y: auto;

        .chat-item {
            margin-top: 16px;

            .chat-question {
                display: flex;
                flex-direction: column;
                align-items: flex-end;

                .question-info {
                    font-size: 13px;
                    color: var(--gray-6);
                }

                .question-content {
                    margin-top: 8px;
                    background-color: var(--gray-2);
                    padding: 8px 16px;
                    border-radius: 8px;
                }
            }

            .chat-loading {
                font-size: 14px;
                color: var(--gray-6);
            }

            .chat-answer {}
        }
    }
}
</style>
