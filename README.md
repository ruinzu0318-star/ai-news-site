# AI NEWS

TechCrunch・VentureBeat・MIT Technology ReviewのAI関連ニュースを毎朝9時に日本語要約して公開するサイトです。

## 概要

- **フロントエンド**: Next.js + TypeScript + Tailwind CSS
- **データ**: `data/news.json`（JSONファイル）
- **ホスティング**: Vercel（無料プラン）
- **ニュース収集**: RSSフィード（TechCrunch / VentureBeat / MIT Technology Review）
- **AI要約**: Claude API（claude-haiku）
- **自動更新**: GitHub Actions（毎朝9時 JST）

---

## セットアップ手順

### 1. Node.js のインストール

[Node.js公式サイト](https://nodejs.org/) から LTS版をダウンロードしてインストールしてください（v18以上推奨）。

インストール確認：
```bash
node --version
npm --version
```

### 2. リポジトリのクローン

```bash
git clone https://github.com/あなたのユーザー名/ai-news-site.git
cd ai-news-site
```

### 3. 依存パッケージのインストール

```bash
npm install
```

### 4. APIキーの設定

`.env.example` をコピーして `.env.local` を作成します：

```bash
cp .env.example .env.local
```

`.env.local` を開いて、Anthropic APIキーを入力します：

```
ANTHROPIC_API_KEY=sk-ant-あなたのAPIキー
```

### 5. ローカル起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと確認できます。

---

## APIキーの取得方法

1. [Anthropic Console](https://console.anthropic.com/) にアクセスしてアカウントを作成
2. 「API Keys」メニューから新しいキーを作成
3. `sk-ant-` で始まるキーをコピーして `.env.local` に貼り付け

---

## ニュース取得スクリプトの実行

```bash
npx tsx scripts/fetch-news.ts
```

実行すると `data/news.json` が更新され、サイトに表示されます。

---

## GitHub Actions の設定

自動更新には以下のGitHub Secretsが必要です：

### 設定手順

1. GitHubリポジトリの **Settings** → **Secrets and variables** → **Actions** を開く
2. **New repository secret** をクリックして以下を追加：

| シークレット名 | 値 |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropicで取得したAPIキー |
| `GH_TOKEN` | GitHubのPersonal Access Token（`repo`権限が必要） |

### GitHub Personal Access Token の取得

1. GitHub右上アイコン → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. **Generate new token** をクリック
3. Repository access: 対象リポジトリを選択
4. Permissions: **Contents** を **Read and write** に設定
5. トークンをコピーして `GH_TOKEN` シークレットに貼り付け

設定後、毎朝UTC 0:00（日本時間9:00）に自動実行されます。  
手動実行は **Actions** タブ → **Update AI News** → **Run workflow** から可能です。

---

## Vercel へのデプロイ

### 初回デプロイ

1. [Vercel](https://vercel.com/) にGitHubアカウントでログイン
2. **Add New** → **Project** をクリック
3. このリポジトリをインポート
4. **Deploy** をクリック

デプロイ後、`https://ai-news-site.vercel.app`（またはVercelが割り当てたURL）でアクセスできます。

### 自動デプロイ

VercelとGitHubリポジトリを連携すると、`git push` のたびに自動でデプロイされます。  
GitHub Actionsが `data/news.json` を更新してプッシュすると、Vercelが自動でリビルドします。
