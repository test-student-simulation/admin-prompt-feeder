export type Params = {
    setup: string // グループ1で使うセットアップ用プロンプトのファイル名（.md は付けない）
    prompt: string // グループ2で使うプロンプトのファイル名（.md は付けない）
    project: string // 学生が作るプロジェクト名
}

export type ParamsResult =
    | { ok: true; params: Params }
    | { ok: false; error: string }

// 英数字・ハイフン・アンダースコアだけを許可する（../ などでほかの場所を読ませないため）
const NAME_PATTERN = /^[A-Za-z0-9_-]+$/

export function getParams(): ParamsResult {
    const search = new URLSearchParams(window.location.search)
    const setup = search.get('setup') ?? ''
    const prompt = search.get('prompt') ?? ''
    const project = search.get('project') ?? ''

    if (!setup || !prompt || !project) {
        return {
            ok: false,
            error:
                'URLに setup・prompt・project をすべて指定してください。例：?setup=next-setup&prompt=gemini-practice&project=gemini-practice',
        }
    }
    if (!NAME_PATTERN.test(setup) || !NAME_PATTERN.test(prompt) || !NAME_PATTERN.test(project)) {
        return {
            ok: false,
            error: 'setup・prompt・project には、英数字・ハイフン（-）・アンダースコア（_）だけが使えます。',
        }
    }
    return { ok: true, params: { setup, prompt, project } }
}