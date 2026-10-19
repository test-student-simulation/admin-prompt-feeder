export type Params = {
    prompt: string // 読み込むプロンプトのファイル名（.md は付けない）
    project: string // 学生が作るプロジェクト名
}

export type ParamsResult =
    | { ok: true; params: Params }
    | { ok: false; error: string }

// 英数字・ハイフン・アンダースコアだけを許可する（../ などでほかの場所を読ませないため）
const NAME_PATTERN = /^[A-Za-z0-9_-]+$/

export function getParams(): ParamsResult {
    const search = new URLSearchParams(window.location.search)
    const prompt = search.get('prompt') ?? ''
    const project = search.get('project') ?? ''

    if (!prompt || !project) {
        return {
            ok: false,
            error:
                'URLに prompt と project を指定してください。例：?prompt=peerjs-practice&project=peerjs-practice',
        }
    }
    if (!NAME_PATTERN.test(prompt) || !NAME_PATTERN.test(project)) {
        return {
            ok: false,
            error: 'prompt と project には、英数字・ハイフン（-）・アンダースコア（_）だけが使えます。',
        }
    }
    return { ok: true, params: { prompt, project } }
}