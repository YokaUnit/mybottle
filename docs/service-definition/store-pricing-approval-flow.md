# 店舗別価格 申請・承認フロー仕様（mybottle）

最終更新日: 2026-04-23  
対象: `staff` / `admin` ロール運用

---

## 1. 目的

商品価格は店舗ごとに異なるため、以下を実現する。

- 店舗ごとに価格を保持する
- `staff` は価格変更を「申請」できる
- `admin` 承認後にのみ価格を反映する
- 変更履歴を保持する

---

## 2. 追加テーブル

### `public.staff_store_memberships`

`staff` ユーザーと担当店舗の紐付け。

- `user_id` (auth.users.id)
- `store_id` (stores.id)
- `is_active`
- `unique (user_id, store_id)`

### `public.store_products`

店舗×商品の現在価格を保持。

- `store_id` (stores.id)
- `product_id` (products.id)
- `current_price_jpy`
- `is_active`
- `unique (store_id, product_id)`
- 価格チェック: `100 <= current_price_jpy <= 1000000`

### `public.store_product_price_change_requests`

価格変更申請を管理。

- `store_id`
- `product_id`
- `requested_price_jpy`
- `reason`
- `status` (`pending` / `approved` / `rejected` / `cancelled`)
- `requested_by`
- `reviewed_by`
- `review_note`
- `created_at`, `reviewed_at`
- pending重複防止: `(store_id, product_id)` の部分ユニーク（`status='pending'`）
- 価格チェック: `100 <= requested_price_jpy <= 1000000`

### `public.store_product_price_history`

承認反映時の履歴。

- `store_id`
- `product_id`
- `old_price_jpy`
- `new_price_jpy`
- `request_id`
- `changed_by`
- `changed_at`

---

## 3. 承認フロー関数（DB）

### `approve_store_product_price_request(request_id, reviewer_id, note)`

- `admin` 権限のみ実行可
- `pending` 申請をロックして取得
- `store_products.current_price_jpy` を更新
- 申請ステータスを `approved` へ更新
- `store_product_price_history` に履歴挿入

### `reject_store_product_price_request(request_id, reviewer_id, note)`

- `admin` 権限のみ実行可
- `pending` 申請を `rejected` に更新

---

## 4. RLSポリシー（要点）

### `staff_store_memberships`

- `admin` のみ select/write 可

### `store_products`

- select: 公開商品のみ（`is_active = true`）
- write: `admin` のみ

### `store_product_price_change_requests`

- select: `admin` または担当店舗staff
- insert: `admin` または担当店舗staff（`status='pending'` かつ `requested_by=auth.uid()`）
- update: `admin` のみ

### `store_product_price_history`

- select: `admin` または担当店舗staff

---

## 5. 画面仕様

## `staff` 側

- 画面: `/dashboard/pricing`
- 機能:
  - 担当店舗の商品に対して価格変更申請
  - 申請理由入力（必須）
  - 申請履歴確認
  - pending申請の取り下げ

## `admin` 側

- 画面: `/admin`
- 機能:
  - staffユーザーに担当店舗を紐付け（有効/無効）
  - 承認待ち申請一覧を確認
  - 申請の承認/却下（コメント任意）

---

## 6. 既存画面への反映

- 店舗詳細の商品価格は `products.price_jpy` ではなく、`store_products.current_price_jpy` を表示
- これにより店舗別価格を正しく反映

---

## 7. 運用手順（最小）

1. `admin` が `/admin` で `staff` に担当店舗を紐付け
2. `staff` が `/dashboard/pricing` で価格変更を申請
3. `admin` が `/admin` で承認/却下
4. 承認時は店舗価格が反映され、履歴が保存される

---

## 8. セキュリティ意図

- `staff` に直接価格変更権限を与えない（必ず申請を経由）
- DB関数内で承認処理を原子的に実行（更新と履歴の不整合防止）
- RLSで「誰がどの店舗を触れるか」をDBレイヤーで強制

