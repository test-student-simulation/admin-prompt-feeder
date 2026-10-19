import { useEffect, useState } from 'react'
import type { Progress, Status } from '../types'
import { EMPTY_PROGRESS, clearProgress, loadProgress, saveProgress } from '../lib/storage'

export function useProgress(storageKey: string) {
    const [progress, setProgress] = useState<Progress>(() => loadProgress(storageKey))

    // 状態が変わるたびに保存する
    useEffect(() => {
        saveProgress(storageKey, progress)
    }, [storageKey, progress])

    function getStatus(id: string): Status {
        return progress.copied.includes(id) ? 'copied' : 'todo'
    }

    // コピーした行をコピー済にし、現在作業中の行にする
    function markCopied(id: string) {
        setProgress((prev) => ({
            copied: prev.copied.includes(id) ? prev.copied : [...prev.copied, id],
            current: id,
        }))
    }

    function clear() {
        clearProgress(storageKey)
        setProgress(EMPTY_PROGRESS)
    }

    return { getStatus, currentId: progress.current, markCopied, clear }
}