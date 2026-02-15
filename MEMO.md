# Tips Viewer - 開発メモ

## ☁️ Cloudflare Pages 運用メモ（忘れ防止）

- 公開URL: https://astro-tips-viewer.pages.dev/
- GitHubリポジトリ: https://github.com/marooooon/astro-tips-viewer
- Production branch: `main`
- Cloudflare Pages の Build command: `npm run build`
- Build output directory: `dist`

### 手動デプロイ（CLI）

```bash
# 初回のみ（ブラウザ認証）
npm run cf:login

# 本番デプロイ（build + pages deploy）
npm run cf:deploy
```

### 注意点

- Cloudflare で `Retry deployment` すると古いコミットを再実行することがある。
- 最新を反映したいときは、最新コミットで `Create deployment` を実行する。
- デプロイログ先頭の `HEAD is now at ...` が最新SHAか必ず確認する。

## ✅ プロジェクト完成状況

- 全ファイル作成済み
- `npm install` 完了済み
- ビルド準備完了

## 🚨 重要な注意事項

### Node.jsバージョン要件
- **必須**: Node.js 18以上
- Astro 4 と React 18 を動かすために必要
- v11.15.0では動作しません → アップグレード必須

### TypeScript設定（重要）
`tsconfig.json` には以下の設定が必須:
```json
{
  "allowSyntheticDefaultImports": true,
  "esModuleInterop": true,
  "lib": ["ES2022", "DOM", "DOM.Iterable"],
  "resolveJsonModule": true
}
```
これがないとJSONのimportとReactの型でエラーが出ます。

## 📝 プロジェクト構成のポイント

### 型安全性の実装
- `src/types/post.ts` でPost型を定義
- JSONデータ読み込み時に型を適用: `const posts: Post[] = postsData;`
- props、検索ロジック、全てに型を適用済み

### Astro Islands（重要）
- **Filter.tsx** だけがクライアントJavaScript（React）
- `client:load` ディレクティブで初回ロード時にハイドレーション
- カスタムイベント `postsFiltered` でフィルタ結果を通知
- `index.astro` のスクリプトでイベントを受信してDOM更新

### SSG（静的サイト生成）
- `posts/[id].astro` で `getStaticPaths()` 実装済み
- 全記事ページをビルド時に事前生成
- サーバー不要、完全静的ホスティング可能

## 🔧 コマンド

```bash
# 開発サーバー起動
npm run dev
# → http://localhost:4321

# ビルド（型チェック含む）
npm run build
# → dist/ に静的ファイル生成

# ビルド結果をプレビュー
npm run preview
```

## ☁️ Cloudflare Pages デプロイ設定

```
ビルドコマンド: npm run build
出力ディレクトリ: dist
Node.jsバージョン: 18 以上
```

## 🐛 トラブルシューティング

### ビルドエラーが出る場合

1. **JSONインポートエラー**
   - `tsconfig.json` に `resolveJsonModule: true` があるか確認

2. **React型エラー**
   - `npm install` が完了しているか確認
   - `node_modules/` を削除して `npm install` し直す

3. **includes/flatMapエラー**
   - `tsconfig.json` の `lib: ["ES2022", ...]` を確認

### 検索・フィルターが動かない

- ブラウザのコンソールを確認
- `postsFiltered` カスタムイベントが発火しているか確認
- Filter.tsxが `client:load` で読み込まれているか確認

## 📦 データの追加方法

`src/data/posts.json` に以下の形式で追加:

```json
{
  "id": "011",
  "title": "タイトル",
  "description": "概要（一覧ページに表示）",
  "tags": ["タグ1", "タグ2"],
  "date": "2026-02-16",
  "body": "本文（詳細ページに表示）"
}
```

**注意**: idは英数字3桁（001, 002...）で統一

## 🎨 スタイルのカスタマイズ

- グローバル: `src/styles/global.css`
- PostCard: `src/components/PostCard.astro` の `<style>`
- 詳細ページ: `src/pages/posts/[id].astro` の `<style>`
- Filter: `src/styles/global.css` の `.filter-container` 系

## 📂 ファイル一覧と役割

```
src/
├── types/post.ts              # Post型定義（全体で使用）
├── data/posts.json            # 10件のTipsデータ
├── components/
│   ├── PostCard.astro         # 記事カードUI（一覧用）
│   └── Filter.tsx             # 検索・フィルター（React Island）
├── pages/
│   ├── index.astro            # 一覧ページ
│   └── posts/[id].astro       # 詳細ページ（動的ルート）
└── styles/global.css          # グローバルスタイル
```

## 🔍 デバッグTips

### Astro Dev Toolsを使う
開発サーバー起動時、ブラウザ右下にAstroアイコンが表示されます。
- Islands（クライアントコンポーネント）の確認
- 送信されたpropsの確認

### 型エラーを事前チェック
```bash
npx astro check
```

### ビルドサイズ確認
```bash
npm run build
# dist/ のサイズを確認
```

## 💡 今後の拡張案

- [ ] ページネーション追加
- [ ] ダークモード対応（CSS変数 + LocalStorage）
- [ ] カテゴリ機能追加
- [ ] 関連記事表示
- [ ] OGP画像自動生成
- [ ] 全文検索の精度向上（部分一致 → あいまい検索）

## 📌 よくある質問

**Q: adapter入れなくていいの？**
A: 静的ビルド（SSG）なので不要。`output: 'static'` のみで動作します。

**Q: 検索はサーバーサイドじゃないの？**
A: クライアントサイドJavaScript（React Island）で実装。データは静的JSONなので問題なし。

**Q: SEOは大丈夫？**
A: 全ページSSGなので完璧。HTMLが事前生成されるため、クローラーも問題なく読めます。

---

**作成日**: 2026年2月15日  
**最終更新**: 2026年2月15日
