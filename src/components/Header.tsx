type Props = {
    project: string
    copiedCount: number
    total: number
    onClear: () => void
}

function Header({ project, copiedCount, total, onClear }: Props) {
    return (
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                    <h1 className="truncate text-lg font-bold">AI先生プロンプト：{project}</h1>
                </div>
                <div className="flex shrink-0 flex-row items-center gap-4">
                    <p className="text-sm text-gray-600">
                        コピー済 {copiedCount} / {total}
                    </p>
                    <button
                        type="button"
                        onClick={onClear}
                        className="shrink-0 rounded border border-gray-700 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-300"
                    >
                        進捗をクリア
                    </button>
                </div>
            </div>
            <div className="h-1 bg-gray-200">
                <div
                    className="h-1 bg-black"
                    style={{ width: total ? `${(copiedCount / total) * 100}%` : '0%' }}
                />
            </div>
        </header>
    )
}

export default Header