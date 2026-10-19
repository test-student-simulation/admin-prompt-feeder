// 1つのプロンプト（表の1行）
export type PromptItem = {
    id: string // 進捗の保存に使う識別子（例：g1-0, g2-3）
    group: 1 | 2 // 1: Viteアプリ作成 / 2: 分割した演習プロンプト
    title: string // 表に表示する名前
    body: string // コピーされる全文
}

// 行の状態：未着手 / コピー済
export type Status = 'todo' | 'copied'

// 保存する進捗
export type Progress = {
    copied: string[] // コピー済の行のid
    current: string | null // 最後にコピーした行（現在作業中）のid
}