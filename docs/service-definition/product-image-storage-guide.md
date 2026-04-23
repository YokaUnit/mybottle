# 商品画像 Storage 運用ガイド（mybottle）

最終更新日: 2026-04-23

---

## 1. 方針

- 商品画像は `public/` ではなく **Supabase Storage** の `product-images` バケットで管理
- DBの `products.image_path` に相対パスを保存
- 表示時は Supabase `render` エンドポイントで **縮小配信（webp）** し、egressを抑える

---

## 2. 保存ルール

- バケット: `product-images`
- 推奨パス: `products/{product_id}.webp`
- 例:
  - `products/whisky-1.webp`
  - `products/highball-10.webp`

`products.image_path` には、上記の相対パスのみを保存する（フルURLは保存しない）。

---

## 3. 画像仕様（推奨）

- 形式: `webp`
- サイズ: 正方形推奨（1200x1200）
- 品質: 75〜82
- 1ファイル: 5MB以下

---

## 4. 反映手順

1. Storage の `product-images` に画像をアップロード
2. `/admin` の「商品管理」で対象商品の `画像パス` を設定
3. 保存後、商品カードの画像表示が自動で反映

---

## 5. セキュリティ

- バケット読み取り: public（表示用）
- 書き込み/更新/削除: `admin` のみ（Storage policyで制御）
- DB側は `products.image_path` を `admin` 更新に限定

---

## 6. egress最適化

- 表示は `render/image` で `width` 指定（現在 320px）
- `quality=78` + `format=webp`
- クライアントでは `loading=\"lazy\"` を利用
- 画像未設定時はローカルfallback画像に切替

