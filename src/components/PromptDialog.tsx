import { useEffect, useRef } from 'react'
import type { PromptItem } from '../types'

type Props = {
    item: PromptItem | null
    onClose: () => void
}

function PromptDialog({ item, onClose }: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    // item が渡されたら開き、null になったら閉じる
    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (item && !dialog.open) dialog.showModal()
        if (!item && dialog.open) dialog.close()
    }, [item])

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={(e) => {
                // 枠の外（背景）をクリックしたら閉じる
                if (e.target === e.currentTarget) onClose()
            }}
            className="m-auto w-[min(56rem,calc(100%-2rem))] rounded-lg p-0 shadow-xl backdrop:bg-black/50"
        >
            {item && (
                <div className="flex max-h-[85dvh] flex-col">
                    <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3">
                        <h2 className="font-bold">{item.title}</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="shrink-0 rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                        >
                            閉じる
                        </button>
                    </div>
                    <pre className="overflow-auto p-4 text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {item.body}
                    </pre>
                </div>
            )}
        </dialog>
    )
}

export default PromptDialog
