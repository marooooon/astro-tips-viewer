# Tips Viewer

**Astro (SSG) + TypeScript (strict)** で構築した、技術Tipsを閲覧・検索できる静的Webサイトです。

## 特徴

### 🚀 技術スタック
- **Astro 4.0** - 高速な静的サイトジェネレーター（SSG）
- **TypeScript (strict)** - 厳格な型チェックによる型安全性
- **React 18** - インタラクティブな検索・フィルター機能（Astro Islands）
- **Cloudflare Pages対応** - 静的ホスティング用にビルド設定済み

### ✨ 主な機能
- **全文検索** - タイトル・説明・本文を対象にリアルタイム検索
- **タグフィルター** - 複数タグでのOR絞り込み
- **SSG** - 全ページを静的生成し、超高速表示
- **Astro Islands** - 必要最小限のクライアントJavaScriptのみロード
- **型安全** - データ読み込みからprops、検索ロジックまで完全型付け
- **レスポンシブデザイン** - モバイル/タブレット/デスクトップ対応

## プロジェクト構成

```
tips-viewer/
├── src/
│   ├── types/
│   │   └── post.ts              # Post型定義
│   ├── data/
│   │   └── posts.json           # 静的データ（10件のTips）
│   ├── components/
│   │   ├── PostCard.astro       # 記事カードコンポーネント
│   │   └── Filter.tsx           # 検索・フィルターコンポーネント（React）
│   ├── pages/
│   │   ├── index.astro          # 一覧ページ
│   │   └── posts/
│   │       └── [id].astro       # 詳細ページ（動的ルート）
│   └── styles/
│       └── global.css           # グローバルスタイル
├── public/                      # 静的アセット
├── package.json
├── tsconfig.json                # TypeScript strict設定
└── astro.config.mjs             # Astro設定（React統合）
```

## 技術的なポイント

### Astro Islands アーキテクチャ
- Filter.tsxのみがクライアントJavaScript（React）として動作
- `client:load`ディレクティブで初回ロード時にハイドレーション
- その他のページは完全な静的HTMLで超高速表示

### 型安全性
```typescript
// src/types/post.ts で型定義
export interface Post {
  id: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  body: string;
}

// JSONデータに型を適用
import postsData from '../data/posts.json';
const posts: Post[] = postsData;
```

### 静的サイト生成（SSG）
- `getStaticPaths()`で全記事ページを事前生成
- ビルド時に全HTMLを生成するため、サーバー不要
- Cloudflare Pagesで即座にデプロイ可能

## セットアップ

### 必要環境
- Node.js 18以上
- npm または yarn

### インストール

```bash
cd tips-viewer
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:4321` にアクセス

### ビルド（本番用）

```bash
npm run build
```

`dist/` ディレクトリに静的ファイルが生成されます。

### プレビュー（ビルド後の確認）

```bash
npm run preview
```

## Cloudflare Pages へのデプロイ

1. GitHubリポジトリにプッシュ
2. Cloudflare Pagesで新規プロジェクト作成
3. ビルド設定:
   - **ビルドコマンド**: `npm run build`
   - **ビルド出力ディレクトリ**: `dist`
   - **Node.jsバージョン**: 18以上

自動デプロイが完了し、グローバルCDNで配信されます。

## データの追加・編集

`src/data/posts.json` を編集することで、Tipsを追加・変更できます。

```json
{
  "id": "011",
  "title": "新しいTips",
  "description": "概要",
  "tags": ["タグ1", "タグ2"],
  "date": "2026-02-16",
  "body": "本文..."
}
```

## カスタマイズ

### スタイル変更
- `src/styles/global.css` - グローバルスタイル
- 各`.astro`ファイルの`<style>`セクション - コンポーネント固有スタイル

### 検索・フィルター機能拡張
- `src/components/Filter.tsx` を編集

## ライセンス

MIT

## 作成者

Built with ❤️ using Astro & TypeScript
