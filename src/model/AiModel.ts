export enum DoubaoRole {
    user = 'user',
    assistant = 'assistant',
    system = 'system',
}

export enum AiState {
    loading = 'loading',
    answering = 'answering',
    done = 'done',
    error = 'error'
}

export type Question = AIMessage & {
    time: string
}

export interface Answer {
    role: 'assistant',
    mdText: string
    htmlText: string
    time: string
}

export interface ChatItem {
    question: Question
    answer: Answer
    state: AiState
}

export interface AIMessage {
    role: DoubaoRole;
    content: string;
}

export interface StreamMessage {
    content?: string;
    error?: string;
}