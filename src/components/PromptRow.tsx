import { useState } from 'react'
import type { PromptItem, Status } from '../types'

type Props = {
    no: number
    item: PromptItem
    status: Status
    isNext: boolean
    onCopied: () => void
    onDone: () => void
    onUndo: () => void
    onShow: () => void
}

const STATUS_LABEL: Record<Status, string> = {
    todo: '未着手',
    copied: 'コピー済',
    done: '✓ 完了',
}

const BUTTON = 'border border-black px-2 py-0.5'

function PromptRow({ no, item, status, isNext, onCopied, onDone, onUndo, onShow }: Props) {
    const [message, setMessage] = useState('')

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(item.body)
            setMessage('コピーしました')
            onCopied()
        } catch {
            setMessage('コピーできませんでした。「詳細」から選択してコピーしてください')
        }
        window.setTimeout(() => setMessage(''), 2500)
    }

    return (
        <tr
            className={`border-b border-gray-300 align-top ${isNext ? 'font-bold' : ''} ${status === 'done' ? 'text-gray-500' : ''
                }`}
        >
            <td className="px-2 py-1">{isNext ? `▶ ${no}` : no}</td>
            <td className="px-2 py-1 whitespace-nowrap">{STATUS_LABEL[status]}</td>
            <td className="px-2 py-1">{item.title}</td>
            <td className="px-2 py-1">
                <div className="flex flex-wrap items-center gap-1 font-normal text-black">
                    <button type="button" onClick={handleCopy} className={BUTTON}>
                        {status === 'todo' ? 'コピー' : '再コピー'}
                    </button>
                    {status === 'copied' && (
                        <button type="button" onClick={onDone} className={BUTTON}>
                            完了にする
                        </button>
                    )}
                    <button type="button" onClick={onShow} className={BUTTON}>
                        詳細
                    </button>
                    {status === 'done' && (
                        <button type="button" onClick={onUndo} className="px-1 underline">
                            戻す
                        </button>
                    )}
                    {message && <span>{message}</span>}
                </div>
            </td>
        </tr>
    )
}

export default PromptRow
