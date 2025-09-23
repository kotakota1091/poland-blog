# ポーランド留学

白と赤のテーマで作った、静的ブログのひな型です。限定公開ページは **クライアントサイドの簡易認証**（SHA-256ハッシュ照合）で保護します。厳密な秘匿にはサーバー側の認証を使ってください。

## ファイル構成
- `index.html` — トップ／記事一覧
- `article-hello.html` — サンプル記事
- `protected.html` — 限定公開（パスワード: 20040605）
- `style.css` — 見た目
- `script.js` — ナビの強調と限定公開の処理

## 動かし方（GitHub Pages）
1. GitHub で新規リポジトリを作成（例: `poland-blog`）。
2. 上記ファイルをアップロード（`index.html` がトップになります）。
3. Repository の Settings → Pages → Branch を `main` / `/root` にして保存。
4. 数十秒～数分後、表示用URLが有効になります。

## 記事の追加
1. `article-YYYYMMDD-title.html` のような名前でファイルを複製して本文を書く。
2. `index.html` の記事一覧にリンクを1行追加。

## パスワード変更
- `protected.html` の `data-hash` 属性を書き換えます。
  - 新しいパスワードの SHA-256 を生成して置き換えてください。
  - 例: ブラウザの DevTools で `crypto.subtle` を使うか、オンラインのハッシュツールを使う。

> 注意：この方式は**ソースを読める人には推測可能**です。機密データの保護には使わないでください。
