import { useState, type ReactNode } from 'react'

type Props = {
    title: string
    notice: string
    copiedCount: number
    total: number
    hasCurrent: boolean
    children: ReactNode
}

function GroupSection({ title, notice, copiedCount, total, hasCurrent, children }: Props) {
    // 最初の表示のときだけ決める：未着手が残っているか、作業中の行があれば開く
    const [open, setOpen] = useState(copiedCount < total || hasCurrent)

    return (
        <section className="mb-6">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex w-full items-center gap-2 border-b border-black py-2 text-left font-bold"
            >
                <span className="w-4">{open ? '▼' : '▶'}</span>
                <span>{title}</span>
                <span className="ml-auto text-sm font-normal">
                    コピー済 {copiedCount} / {total}
                </span>
            </button>

            {open && (
                <>
                    <p className="my-2 text-sm">{notice}</p>
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-black text-left">
                                <th className="w-12 px-2 py-1">#</th>
                                <th className="w-24 px-2 py-1">状態</th>
                                <th className="px-2 py-1">プロンプト</th>
                                <th className="px-2 py-1">操作</th>
                            </tr>
                        </thead>
                        <tbody>{children}</tbody>
                    </table>
                </>
            )}
        </section>
    )
}

export default GroupSection