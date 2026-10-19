import type { PromptItem } from '../types'
import { getTitle, splitPrompt } from './splitPrompt'

const VITE_SETUP_FILE = 'vite-setup'
const PROJECT_NAME_MARK = '{{PROJECT_NAME}}'

async function fetchPromptFile(name: string): Promise<string> {
    const url = `${import.meta.env.BASE_URL}prompts/${name}.md`
    const res = await fetch(url, { cache: 'no-cache' })
    const contentType = res.headers.get('content-type') ?? ''

    // 開発サーバーでは、存在しないファイルでも index.html が返ることがあるので HTML も失敗扱いにする
    if (!res.ok || contentType.includes('text/html')) {
        throw new Error(`prompts/${name}.md を読み込めませんでした（${res.status}）`)
    }
    return res.text()
}

export async function loadPrompts(prompt: string, project: string): Promise<PromptItem[]> {
    const [viteText, mainText] = await Promise.all([
        fetchPromptFile(VITE_SETUP_FILE),
        fetchPromptFile(prompt),
    ])

    const withName = (text: string) => text.replaceAll(PROJECT_NAME_MARK, project)

    const group1: PromptItem = {
        id: 'g1-0',
        group: 1,
        title: `Viteアプリの作成（${project}）`,
        body: withName(viteText).trim(),
    }

    const group2: PromptItem[] = splitPrompt(withName(mainText)).map((body, i) => ({
        id: `g2-${i}`,
        group: 2,
        title: getTitle(body, `プロンプト ${i + 1}`),
        body,
    }))

    return [group1, ...group2]
}
