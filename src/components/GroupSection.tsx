import { useState, type ReactNode } from 'react'

type Props = {
    title: string
    notice: string
    doneCount: number
    total: number
    children: ReactNode
}

function GroupSection({ title, notice, doneCount, total, children }: Props) {
    // 最初の表示のときだけ決める：未完了が残っていれば開く、全部完了なら閉じる
    const [open, setOpen] = useState(doneCount < total)

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
                    完了 {doneCount} / {total}
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
