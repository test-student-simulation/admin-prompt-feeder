import { useState } from 'react'
import type { PromptItem, Status } from '../types'

type Props = {
    item: PromptItem
    status: Status
    isNext: boolean
    onCopied: () => void
    onDone: () => void
    onUndo: () => void
    onShow: () => void
}

const STATUS_STYLE: Record<Status, { card: string; badge: string; label: string }> = {
    todo: { card: 'border-gray-200 bg-white', badge: 'bg-gray-100 text-gray-600', label: '未着手' },
    copied: { card: 'border-blue-300 bg-blue-50', badge: 'bg-blue-600 text-white', label: 'コピー済' },
    done: { card: 'border-green-300 bg-green-50', badge: 'bg-green-600 text-white', label: '✓ 完了' },
}

function PromptCard({ item, status, isNext, onCopied, onDone, onUndo, onShow }: Props) {
    const [message, setMessage] = useState('')
    const style = STATUS_STYLE[status]

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(item.body)
            setMessage('コピーしました')
            onCopied()
        } catch {
            setMessage('コピーできませんでした。「詳細」から全文を選択してコピーしてください')
        }
        window.setTimeout(() => setMessage(''), 2500)
    }

    return (
        <li
            className={`rounded-lg border-2 p-4 ${style.card} ${isNext ? 'ring-4 ring-amber-300' : ''}`}
        >
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-xs font-bold ${style.badge}`}>
                    {style.label}
                </span>
                {isNext && (
                    <span className="rounded bg-amber-400 px-2 py-0.5 text-xs font-bold text-amber-950">
                        次はこれ
                    </span>
                )}
            </div>

            <h3 className={`mb-3 font-bold ${status === 'done' ? 'text-gray-500' : ''}`}>
                {item.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                    {status === 'todo' ? 'コピー' : 'もう一度コピー'}
                </button>

                {status === 'copied' && (
                    <button
                        type="button"
                        onClick={onDone}
                        className="rounded bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
                    >
                        完了にする
                    </button>
                )}

                <button
                    type="button"
                    onClick={onShow}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                >
                    詳細
                </button>

                {status === 'done' && (
                    <button
                        type="button"
                        onClick={onUndo}
                        className="text-sm text-gray-500 underline hover:text-gray-700"
                    >
                        未完了に戻す
                    </button>
                )}

                {message && <span className="text-sm font-bold text-blue-700">{message}</span>}
            </div>
        </li>
    )
}

export default PromptCard
