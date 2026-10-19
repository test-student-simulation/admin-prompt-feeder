// 1つのプロンプト（画面の1枚のカード）
export type PromptItem = {
    id: string // 進捗の保存に使う識別子（例：g1-0, g2-3）
    group: 1 | 2 // 1: Viteアプリ作成 / 2: 分割した演習プロンプト
    title: string // カードに表示する名前
    body: string // コピーされる全文
}

// カードの状態：未着手 / コピー済 / 完了
export type Status = 'todo' | 'copied' | 'done'

// カードごとの状態（idをキーにする）
export type Progress = Record<string, Status>
