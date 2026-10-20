import { useEffect, useRef, useState } from 'react'
import type { PromptItem } from './types'
import { getParams, type Params } from './lib/params'
import { loadPrompts } from './lib/loadPrompts'
import { makeStorageKey } from './lib/storage'
import { useProgress } from './hooks/useProgress'
import Header from './components/Header'
import GroupSection from './components/GroupSection'
import PromptRow from './components/PromptRow'
import PromptDialog from './components/PromptDialog'
import Toast from './components/Toast'

function App() {
  const result = getParams()

  if (!result.ok) {
    return <Message text={result.error} />
  }
  return <Feeder params={result.params} />
}

function Feeder({ params }: { params: Params }) {
  const [items, setItems] = useState<PromptItem[] | null>(null)
  const [error, setError] = useState('')
  const [shown, setShown] = useState<PromptItem | null>(null)
  const [toast, setToast] = useState('')
  const toastTimer = useRef<number | undefined>(undefined)
  const { getStatus, currentId, markCopied, clear } = useProgress(
    makeStorageKey(params.prompt, params.project),
  )

  useEffect(() => {
    let active = true
    loadPrompts(params.prompt, params.project)
      .then((loaded) => {
        if (active) setItems(loaded)
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      active = false
    }
  }, [params.prompt, params.project])

  // 画面下にメッセージを2.5秒だけ表示する（続けて押したら時間を延長する）
  function showToast(message: string) {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2500)
  }

  if (error) return <Message text={error} />
  if (!items) return <Message text="読み込み中..." />

  const countCopied = (list: PromptItem[]) =>
    list.filter((item) => getStatus(item.id) === 'copied').length

  function handleClear() {
    if (window.confirm('この演習の進捗をすべて消して、最初からにしますか？')) {
      clear()
    }
  }

  // start：そのグループの最初の行の番号（グループ2は「はじめに」を0番にする）
  function renderRow(start: number) {
    return (item: PromptItem, index: number) => (
      <PromptRow
        key={item.id}
        no={start + index}
        item={item}
        status={getStatus(item.id)}
        isCurrent={item.id === currentId}
        onCopied={() => {
          markCopied(item.id)
          showToast(`コピーしました (${item.title.split('：')[1] ?? item.title})`)
        }}
        onCopyFailed={() => showToast('コピーできませんでした。「詳細」から選択してコピーしてください')}
        onShow={() => setShown(item)}
      />
    )
  }

  const group1 = items.filter((item) => item.group === 1)
  const group2 = items.filter((item) => item.group === 2)
  const hasCurrent = (list: PromptItem[]) => list.some((item) => item.id === currentId)

  return (
    <div className="min-h-dvh bg-white text-black">
      <Header
        project={params.project}
        copiedCount={countCopied(items)}
        total={items.length}
        onClear={handleClear}
      />

      <main className="mx-auto max-w-4xl px-4 py-4">
        <GroupSection
          title="グループ1：Viteアプリを作る"
          notice="ChatGPTで新しいチャットを開き、このプロンプトをコピーして貼り付け、送信してください。AI先生の指示に従って最後まで進めます。"
          copiedCount={countCopied(group1)}
          total={group1.length}
          hasCurrent={hasCurrent(group1)}
        >
          {group1.map(renderRow(1))}
        </GroupSection>

        <GroupSection
          title="グループ2：アプリを作る演習"
          notice="グループ1が終わったら、ChatGPTで新しいチャットを開いてください。上から順に1つずつコピーして貼り付けます。AI先生に「次のステップを貼ってください」と言われたら、次の行をコピーします。"
          copiedCount={countCopied(group2)}
          total={group2.length}
          hasCurrent={hasCurrent(group2)}
        >
          {group2.map(renderRow(0))}
        </GroupSection>
      </main>

      <PromptDialog item={shown} onClose={() => setShown(null)} />
      <Toast message={toast} />
    </div>
  )
}

function Message({ text }: { text: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-white p-4">
      <p className="max-w-xl border border-black p-4">
        {text}
      </p>
    </div>
  )
}

export default App