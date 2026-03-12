<template>
    <MEditorVue3 ref="mEditorVue3Ref" v-model="inputValue" @file-input="handleFileChange" @enter="handleEnter"
        :options="{ lineBreak: 'shift+enter', placeholder: placeholder }">


        <SuggestionMenuController trigger-character="/">
            <template v-slot="menu">
                <SuggestionList v-bind="menu" />
            </template>
        </SuggestionMenuController>

        <SuggestionMenuController trigger-character="@">
            <template v-slot="menu">
                <SuggestionList v-bind="menu" />
            </template>
        </SuggestionMenuController>

        <template #header>
            <div class="mention-header">
                <el-image v-for="image in files" :src="image.url" fit="cover" :preview-src-list="[image.url]">
                </el-image>
            </div>
        </template>

        <template #footer>
            <div class="mention-footer">
                <div class="footer-left">
                    <el-button @click="handleClick">打印内容</el-button>
                    <el-button @click="handleInsert">插入mention</el-button>
                    <el-button @click="handleDelete">清空内容</el-button>
                </div>
                <div class="footer-right">
                    <el-button type="primary" :icon="Position" circle @click="handleEnter"
                        :loading="props.isAiLoading" />
                </div>
            </div>
        </template>

    </MEditorVue3>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MEditorVue3 from '@shenjipo/mention-vue3';
import "@shenjipo/mention-vue3/dist/index.css"
import SuggestionList from './SuggestionList.vue';
import { SuggestionMenuController } from '@shenjipo/mention-vue3';
import { Position } from '@element-plus/icons-vue'
import { FileUtils } from '@/utils/FileUtils';

const inputValue = ref('你好，输出一段markdown文本')
const placeholder = ref('请输入问题，enter提问，shift+enter换行，可粘贴图片，按下@或者/查询快捷指令')
const mEditorVue3Ref = ref<Nullable<InstanceType<typeof MEditorVue3>>>(null)


const props = defineProps<{
    isAiLoading: boolean
}>()

const files = ref<Array<{
    file: File,
    url: string
}>>([])

const handleClick = () => {
    console.log(inputValue.value)
}

const handleInsert = () => {
    mEditorVue3Ref.value!.editor.inserMentionBlock({
        id: '123',
        label: '你好'
    })
}

const handleDelete = () => {
    mEditorVue3Ref.value?.clear()
}

const handleFileChange = async (file: File) => {
    const base64File = await FileUtils.FileToBase64(file)
    files.value.push({
        url: base64File,
        file: file,
    })
}

const emit = defineEmits<{
    (e: 'submit', payload: string): void
}>()

const handleEnter = () => {

    const mentions = mEditorVue3Ref.value?.editor.getAllMentionBlocks()
    // isAnswering.value = true
    emit('submit', inputValue.value)
    handleDelete()
}
</script>

<style lang="scss" scoped>
.mention-editor-wrapper {
    position: absolute;
    bottom: 50px;
    left: 250px;
    width: calc(100% - 500px);
    font-size: 14px;

    .mention-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .el-image {
            width: 52px;
            height: 52px;
        }

        .el-image:not(:first-child) {
            margin-left: 16px;
        }
    }

    .mention-footer {
        display: flex;
        justify-content: space-between;

        .footer-left {
            display: flex;
        }

        .footer-right {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
