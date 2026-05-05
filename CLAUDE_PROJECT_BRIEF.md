# 🤖 AIニュース自動収集サイト - Claude Code プロジェクト指示書

## このファイルについて
このファイルはClaude Codeとのやり取りを始めるための指示書です。
プロジェクトのゴール・技術構成・作業手順がすべて書かれています。
**まずこのファイルを読み込んだうえで、以下の指示に従って作業を進めてください。**

---

## プロジェクト概要

AIに関するニュースを自動で収集・要約し、ホームページとして公開するサイトを作成する。
毎朝自動でニュースが更新され、誰でもインターネットから閲覧できる状態にする。

---

## 完成イメージ

- URL例：`ai-news-site.vercel.app`（Vercelの無料ホスティングを使用）
- 毎朝9時に自動でAI関連ニュースを収集・日本語要約・サイト更新
- スマホ・PCどちらでも見やすいデザイン

---

## 技術スタック

| 役割 | 技術 |
|------|------|
| フロントエンド | Next.js 14 + TypeScript + Tailwind CSS |
| データ保存 | `data/news.json`（JSONファイル）|
| ホスティング | Vercel（無料プラン）|
| ニュース収集 | RSSフィード取得スクリプト |
| AI要約 | Claude API（Anthropic）|
| 自動実行 | GitHub Actions（毎朝9時）|

---

## ディレクトリ構成（作成してほしい構成）

```
ai-news-site/
├── .github/
│   └── workflows/
│       └── update-news.yml       # 毎朝9時に自動実行するGitHub Actions
├── data/
│   └── news.json                 # 収集したニュースデータ
├── scripts/
│   └── fetch-news.ts             # RSSからニュースを取得・要約するスクリプト
├── src/
│   └── app/
│       ├── page.tsx              # トップページ（ニュース一覧）
│       ├── news/[id]/page.tsx    # 記事詳細ページ
│       └── layout.tsx            # 共通レイアウト
├── .env.local                    # APIキー設定（gitignore対象）
├── .env.example                  # APIキーのテンプレート
├── .gitignore
├── package.json
├── README.md                     # セットアップ手順
└── vercel.json                   # Vercel設定
```

---

## 各ファイルの詳細仕様

### `scripts/fetch-news.ts`
- 以下のRSSフィードからAI関連ニュースを取得する
  - TechCrunch AI: `https://techcrunch.com/category/artificial-intelligence/feed/`
  - VentureBeat AI: `https://venturebeat.com/category/ai/feed/`
  - MIT Technology Review: `https://www.technologyreview.com/feed/`
- 取得した各記事をClaude APIで**日本語200字以内に要約**する
- 結果を `data/news.json` に保存する（既存データに追記・重複除去）
- 1回の実行で最大30件まで取得

### `data/news.json` のデータ形式
```json
[
  {
    "id": "一意のID（URLをハッシュ化）",
    "title": "記事タイトル（原文）",
    "titleJa": "記事タイトル（日本語訳）",
    "summary": "日本語要約（200字以内）",
    "url": "原文URL",
    "source": "ソース名（例：TechCrunch）",
    "publishedAt": "2024-01-01T09:00:00Z",
    "tags": ["AI", "LLM", "画像生成"]
  }
]
```

### `src/app/page.tsx`（トップページ）
- 最新ニュース12件をカード形式で表示
- 各カードに：タイトル（日本語）・要約・ソース名・公開日・タグを表示
- タグでフィルタリングできるUI
- レスポンシブデザイン（スマホ対応）

### `src/app/news/[id]/page.tsx`（記事詳細ページ）
- 日本語タイトル・要約・タグ・公開日を表示
- 「原文を読む」ボタンで元記事へリンク

### `.github/workflows/update-news.yml`
```yaml
# 毎朝日本時間9時（UTC 0時）に自動実行
# 1. fetch-news.ts を実行
# 2. data/news.json が更新されたらGitにコミット
# 3. Vercelへ自動デプロイ（git pushでトリガー）
```
必要なGitHub Secrets：
- `ANTHROPIC_API_KEY`
- `GH_TOKEN`（GitHub Personal Access Token）

### `.env.example`
```
ANTHROPIC_API_KEY=sk-ant-ここにAnthropicのAPIキーを入力
```

### `README.md` に含めてほしい内容
1. プロジェクト概要
2. セットアップ手順（Node.jsインストール〜ローカル起動まで）
3. APIキーの取得方法と設定方法
4. GitHub Actionsの設定方法
5. Vercelへのデプロイ手順

---

## デザイン要件

- **テーマ**：テック系・モダン・ダークモード基調
- **カラー**：ダーク背景 + ネオングリーンまたはブルーのアクセント
- **フォント**：日本語対応フォント（Noto Sans JP等）
- **アニメーション**：カードのホバーエフェクト、フェードイン
- **必須要素**：
  - サイトロゴ・タイトル（「AI NEWS」など）
  - ナビゲーションバー
  - ニュースカード一覧
  - フッター（更新日時表示）

---

## 現在の進捗状況

- [x] GitHubリポジトリ作成済み
- [x] Node.js・Git・Claude Codeインストール済み
- [ ] Next.jsプロジェクト生成
- [ ] RSSフェッチスクリプト作成
- [ ] フロントエンド実装
- [ ] GitHub Actions設定
- [ ] Vercelデプロイ

---

## 作業開始の指示

**以下の順番で作業を進めてください：**

1. `npx create-next-app@latest . --typescript --tailwind --app --src-dir` でNext.jsプロジェクトを初期化
2. 必要なパッケージをインストール（rss-parser, @anthropic-ai/sdk 等）
3. `scripts/fetch-news.ts` を作成・動作確認
4. フロントエンド（page.tsx, layout.tsx等）を実装
5. `.github/workflows/update-news.yml` を作成
6. `.env.example` と `.gitignore` を作成
7. `README.md` を作成
8. 動作確認：`npm run dev` でローカル起動

**不明点があれば質問してください。指示書に書いていないことはベストプラクティスに従って判断してOKです。**

---

## よくある質問（Claude Codeへ）

**Q: APIキーはどこに置く？**
A: `.env.local` に置く。このファイルは `.gitignore` に含めてGitHubにはアップしない。

**Q: ニュースが取得できない場合は？**
A: エラーログを出力し、スクリプトを終了する。次回実行時に再試行。

**Q: 重複記事はどう処理する？**
A: URLのハッシュをIDとして使い、同じIDが既に `news.json` に存在する場合はスキップ。

**Q: Vercelへのデプロイはどうする？**
A: `git push` するだけで自動デプロイされる設定にする（Vercelとリポジトリを連携後）。

---

*このファイルはAIニュース自動収集サイトのプロジェクト指示書です。Claude Codeはこの指示書に従って作業を進めてください。*
