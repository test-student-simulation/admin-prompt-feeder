// 前後が空行で、単独の「---」だけの行を区切りとみなして分割する。
// ``` で囲まれたコードブロックの中の「---」は区切りとみなさない。
export function splitPrompt(text: string): string[] {
    const lines = text.replace(/\r\n?/g, '\n').split('\n')
    const chunks: string[][] = [[]]
    let inFence = false

    lines.forEach((line, i) => {
        if (line.trimStart().startsWith('```')) {
            inFence = !inFence
        }
        const isSeparator =
            !inFence &&
            line.trim() === '---' &&
            (lines[i - 1] ?? '').trim() === '' &&
            (lines[i + 1] ?? '').trim() === ''

        if (isSeparator) {
            chunks.push([])
        } else {
            chunks[chunks.length - 1].push(line)
        }
    })

    return chunks.map((chunk) => chunk.join('\n').trim()).filter((chunk) => chunk !== '')
}

// 最初の見出し行（# で始まる行）をタイトルにする。なければ fallback を使う。
export function getTitle(body: string, fallback: string): string {
    const heading = body.split('\n').find((line) => /^#{1,6}\s/.test(line))
    return heading ? heading.replace(/^#{1,6}\s+/, '').trim() : fallback
}