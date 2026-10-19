import type { Progress } from '../types'

const PREFIX = 'admin-prompt-feeder:'

// 演習（プロンプト名とプロジェクト名の組み合わせ）ごとに保存場所を分ける
export function makeStorageKey(prompt: string, project: string): string {
    return `${PREFIX}${prompt}:${project}`
}

// localStorage はブラウザの設定によって使えないことがあるので、すべて try/catch で守る
export function loadProgress(key: string): Progress {
    try {
        const raw = localStorage.getItem(key)
        if (!raw) return {}
        const data: unknown = JSON.parse(raw)
        return data && typeof data === 'object' ? (data as Progress) : {}
    } catch {
        return {}
    }
}

export function saveProgress(key: string, progress: Progress): void {
    try {
        if (Object.keys(progress).length === 0) {
            localStorage.removeItem(key)
        } else {
            localStorage.setItem(key, JSON.stringify(progress))
        }
    } catch {
        // 保存できなくても画面は動かし続ける
    }
}

export function clearProgress(key: string): void {
    try {
        localStorage.removeItem(key)
    } catch {
        // 何もしない
    }
}
