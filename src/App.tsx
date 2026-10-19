import { useEffect, useState } from 'react'
import type { PromptItem } from './types'
import { getParams, type Params } from './lib/params'
import { loadPrompts } from './lib/loadPrompts'
import { makeStorageKey } from './lib/storage'
import { useProgress } from './hooks/useProgress'
import Header from './components/Header'
import GroupSection from './components/GroupSection'
import PromptRow from './components/PromptRow'
import PromptDialog from './components/PromptDialog'

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
  const { getStatus, setStatus, clear } = useProgress(
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

  if (error) return <Message text={error} />
  if (!items) return <Message text="読み込み中..." />

  const doneCount = items.filter((item) => getStatus(item.id) === 'done').length
  const nextId = items.find((item) => getStatus(item.id) !== 'done')?.id

  function handleClear() {
    if (window.confirm('この演習の進捗をすべて消して、最初からにしますか？')) {
      clear()
    }
  }

  function renderRow(item: PromptItem, index: number) {
    const status = getStatus(item.id)
    return (
      <PromptRow
        key={item.id}
        no={index + 1}
        item={item}
        status={status}
        isNext={item.id === nextId}
        onCopied={() => {
          if (status === 'todo') setStatus(item.id, 'copied')
        }}
        onDone={() => setStatus(item.id, 'done')}
        onUndo={() => setStatus(item.id, 'copied')}
        onShow={() => setShown(item)}
      />
    )
  }

  const group1 = items.filter((item) => item.group === 1)
  const group2 = items.filter((item) => item.group === 2)
  const countDone = (list: PromptItem[]) =>
    list.filter((item) => getStatus(item.id) === 'done').length

  return (
    <div className="min-h-dvh bg-white text-black">
      <Header
        project={params.project}
        doneCount={doneCount}
        total={items.length}
        onClear={handleClear}
      />

      <main className="mx-auto max-w-4xl px-4 py-4">
        <GroupSection
          title="グループ1：Viteアプリを作る"
          notice="ChatGPTで新しいチャットを開き、このプロンプトをコピーして貼り付け、送信してください。AI先生の指示に従って最後まで進めたら「完了にする」を押します。"
          doneCount={countDone(group1)}
          total={group1.length}
        >
          {group1.map(renderRow)}
        </GroupSection>

        <GroupSection
          title="グループ2：アプリを作る演習"
          notice="グループ1が終わったら、ChatGPTで新しいチャットを開いてください。上から順に1つずつコピーして貼り付けます。AI先生に「次のステップを貼ってください」と言われたら、今の行を「完了にする」にして、次の行をコピーします。"
          doneCount={countDone(group2)}
          total={group2.length}
        >
          {group2.map(renderRow)}
        </GroupSection>
      </main>

      <PromptDialog item={shown} onClose={() => setShown(null)} />
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
