type Props = {
    project: string
    doneCount: number
    total: number
    onClear: () => void
}

function Header({ project, doneCount, total, onClear }: Props) {
    return (
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                    <h1 className="truncate text-lg font-bold">AI先生プロンプト：{project}</h1>
                    <p className="text-sm text-gray-600">
                        完了 {doneCount} / {total}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClear}
                    className="shrink-0 rounded border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                >
                    進捗をクリア
                </button>
            </div>
            <div className="h-1 bg-gray-100">
                <div
                    className="h-1 bg-green-500 transition-all"
                    style={{ width: total ? `${(doneCount / total) * 100}%` : '0%' }}
                />
            </div>
        </header>
    )
}

export default Header
