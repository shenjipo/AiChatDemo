import type { AIMessage, StreamMessage } from "@/model/AiModel"

export class AiApi {
    static async Chat(val: {
        messages: AIMessage[],
        onMessage: (content: string) => void,
        onComplete?: () => void,
        onError?: (error: string) => void
    }) {
        return fetch('http://localhost:3000/api/chat/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: val.messages }),
        }).then(async (response) => {
            if (!response.ok) {
                throw new Error(`请求失败: ${response.statusText}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('无法获取流式响应');
            }

            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // 解码并处理数据
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n\n');
                buffer = lines.pop() || ''; // 保留未完成的行

                // 解析每一行 SSE 数据
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6); // 去掉 "data: " 前缀

                        // 流结束标记
                        if (dataStr === '[DONE]') {
                            val.onComplete && val.onComplete()
                            return;
                        }

                        // 解析消息
                        try {
                            const data: StreamMessage = JSON.parse(dataStr);
                            if (data.error) {
                                val.onError && val.onError(data.error)
                                return;
                            }
                            if (data.content) {
                                val.onMessage(data.content); // 逐字回调
                            }
                        } catch (e) {
                            console.error('解析流式数据失败:', e);
                        }
                    }
                }
            }
        })
    }
}