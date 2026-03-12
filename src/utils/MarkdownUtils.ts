import { marked } from "marked";
import 'highlight.js/styles/github.css' // 代码高亮样式
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

marked.use(
    markedHighlight({
        highlight(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value
            }
            return hljs.highlightAuto(code).value
        }
    })
)

export class MarkdownUtils {
    static md2Html(mdText: string) {
        return Promise.resolve(marked.parse(mdText,
            {
                breaks: true,        // 换行符转换为<br>
                gfm: true,           // 启用GitHub风格的Markdown

            }
        ))
    }
}