# MyBottle by YokaUnit - Starter

Next.js App Router で `MyBottle` の MVP を作るための初期環境です。

## セットアップ

1. 依存関係をインストール

```bash
npm install
```

2. 環境変数を作成

`.env.example` をコピーして `.env.local` を作り、値を設定してください。

```bash
copy .env.example .env.local
```

3. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 実装済みMVP（決済連携なし）

- `app/products/page.tsx`: 商品一覧とまとめ買い
- `app/stock/page.tsx`: マイボトル表示と1杯ギフト
- `app/consume/page.tsx`: 提示画面生成と消費確定
- `components/mybottle/stock-provider.tsx`: 在庫状態管理（localStorage 永続化）
- `lib/mybottle/catalog.ts`: 商品カタログ（仮想ボトル/実物ボトル）

## 次の実装ステップ（推奨）

1. Supabase 連携で在庫を端末ローカルからクラウド保存へ移行
2. Stripe 連携で購入処理を本番フロー化
3. 店舗向け確認画面に時限署名トークンを追加
4. LINEログイン・ギフト送信導線を追加
