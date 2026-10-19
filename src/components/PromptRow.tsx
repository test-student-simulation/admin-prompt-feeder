import type { PromptItem, Status } from '../types'

type Props = {
    no: number
    item: PromptItem
    status: Status
    isCurrent: boolean
    onCopied: () => void
    onCopyFailed: () => void
    onShow: () => void
}

const STATUS_LABEL: Record<Status, string> = {
    todo: '未着手',
    copied: 'コピー済',
}

const BUTTON = 'border border-black px-2 py-0.5'

function PromptRow({ no, item, status, isCurrent, onCopied, onCopyFailed, onShow }: Props) {
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(item.body)
            onCopied()
        } catch {
            onCopyFailed()
        }
    }

    // 現在作業中の行は太字、それ以外のコピー済の行は薄い灰色（終わった行）
    const rowStyle = isCurrent ? 'font-bold' : status === 'copied' ? 'text-gray-400' : ''

    return (
        <tr className={`border-b border-gray-300 align-top ${rowStyle}`}>
            <td className="px-2 py-1">{no}</td>
            <td className="px-2 py-1 whitespace-nowrap">{isCurrent ? '作業中' : STATUS_LABEL[status]}</td>
            <td className="px-2 py-1">{item.title}</td>
            <td className="px-2 py-1">
                <div className="flex flex-wrap items-center gap-1 font-normal text-black">
                    <button type="button" onClick={handleCopy} className={BUTTON}>
                        {status === 'todo' ? 'コピー' : '再コピー'}
                    </button>
                    <button type="button" onClick={onShow} className={BUTTON}>
                        詳細
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default PromptRow