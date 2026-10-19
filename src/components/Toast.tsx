type Props = {
    message: string
}

// 画面の下に浮かべて表示する。表の中に文字を増やさないので、レイアウトが動かない
function Toast({ message }: Props) {
    if (!message) return null
    return (
        <div
            role="status"
            className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 rounded bg-black px-4 py-2 text-sm text-white"
        >
            {message}
        </div>
    )
}

export default Toast