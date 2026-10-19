import { useEffect, useState } from 'react'
import type { Progress, Status } from '../types'
import { clearProgress, loadProgress, saveProgress } from '../lib/storage'

export function useProgress(storageKey: string) {
    const [progress, setProgress] = useState<Progress>(() => loadProgress(storageKey))

    // 状態が変わるたびに保存する
    useEffect(() => {
        saveProgress(storageKey, progress)
    }, [storageKey, progress])

    function getStatus(id: string): Status {
        return progress[id] ?? 'todo'
    }

    function setStatus(id: string, status: Status) {
        setProgress((prev) => ({ ...prev, [id]: status }))
    }

    function clear() {
        clearProgress(storageKey)
        setProgress({})
    }

    return { getStatus, setStatus, clear }
}
