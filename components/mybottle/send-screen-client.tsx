"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Minus,
  Plus,
  Search,
  SendHorizontal,
  UserPlus,
  Users,
} from "lucide-react";
import {
  addFriendAction,
  searchUsersAction,
  sendBottleToFriendAction,
} from "@/app/(main)/actions/friend-actions";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { AddFriendSheet } from "@/components/mybottle/add-friend-sheet";
import { useFriends } from "@/components/mybottle/friends-provider";
import { useMasterData } from "@/components/mybottle/master-data-provider";
import { useStock } from "@/components/mybottle/stock-provider";
import type { FriendUser } from "@/lib/mybottle/friends";

type Step = "recipient" | "bottle" | "amount" | "confirm" | "done";

type Props = {
  initialStoreId?: string;
  initialProductId?: string;
  initialFriendId?: string;
};

function FriendAvatar({ friend, size = "md" }: { friend: FriendUser; size?: "md" | "lg" }) {
  const dim = size === "lg" ? "h-12 w-12 text-lg" : "h-10 w-10 text-sm";
  const initial = (friend.displayName.trim()[0] ?? "?").toUpperCase();

  if (friend.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={friend.avatarUrl}
        alt=""
        className={`${dim} shrink-0 rounded-full object-cover ring-2 ring-white`}
      />
    );
  }

  return (
    <span
      className={`${dim} grid shrink-0 place-items-center rounded-full bg-[#ecfdf5] font-extrabold text-[#0d9488] ring-2 ring-white`}
      aria-hidden
    >
      {initial}
    </span>
  );
}

export function SendScreenClient({
  initialStoreId = "",
  initialProductId = "",
  initialFriendId = "",
}: Props) {
  const { stock, refreshState } = useStock();
  const { stores } = useMasterData();
  const { friends, loading: friendsLoading, error: friendsError, ensureFriends, refreshFriends } =
    useFriends();
  const [pending, startTransition] = useTransition();

  const [step, setStep] = useState<Step>("recipient");
  const [friendFilter, setFriendFilter] = useState("");
  const [addSearchQuery, setAddSearchQuery] = useState("");
  const [addSearchResults, setAddSearchResults] = useState<FriendUser[]>([]);
  const [addSearching, setAddSearching] = useState(false);
  const [addSearchError, setAddSearchError] = useState<string | null>(null);
  const [tab, setTab] = useState<"friends" | "add">("friends");

  const [pendingFriend, setPendingFriend] = useState<FriendUser | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<FriendUser | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState(initialStoreId);
  const [selectedProductId, setSelectedProductId] = useState(initialProductId);
  const [units, setUnits] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const friendList = friends ?? [];

  const filteredFriends = useMemo(() => {
    const q = friendFilter.trim().toLowerCase();
    if (!q) return friendList;
    return friendList.filter((friend) => friend.displayName.toLowerCase().includes(q));
  }, [friendFilter, friendList]);

  useEffect(() => {
    void ensureFriends();
  }, [ensureFriends]);

  useEffect(() => {
    if (!initialFriendId || friends === null) return;
    const match = friends.find((f) => f.id === initialFriendId);
    if (match) {
      setSelectedFriend(match);
      setStep(initialStoreId && initialProductId ? "amount" : "bottle");
    }
  }, [friends, initialFriendId, initialProductId, initialStoreId]);

  useEffect(() => {
    if (tab !== "add") return;

    const q = addSearchQuery.trim();
    if (q.length < 2) {
      setAddSearchResults([]);
      setAddSearchError(null);
      return;
    }

    const timer = window.setTimeout(async () => {
      setAddSearching(true);
      setAddSearchError(null);
      try {
        const results = await searchUsersAction(q, { excludeFriends: true });
        setAddSearchResults(results);
      } catch (e) {
        setAddSearchResults([]);
        setAddSearchError(e instanceof Error ? e.message : "検索に失敗しました");
      } finally {
        setAddSearching(false);
      }
    }, 280);

    return () => window.clearTimeout(timer);
  }, [addSearchQuery, tab]);

  const selectedStock = useMemo(
    () => stock.find((s) => s.storeId === selectedStoreId && s.productId === selectedProductId),
    [stock, selectedStoreId, selectedProductId],
  );

  const maxUnits = selectedStock?.remainingUnits ?? 1;

  useEffect(() => {
    if (units > maxUnits) setUnits(Math.max(1, maxUnits));
  }, [maxUnits, units]);

  function pickFriend(friend: FriendUser) {
    setError(null);
    setSelectedFriend(friend);
    if (initialStoreId && initialProductId && stock.some((s) => s.storeId === initialStoreId && s.productId === initialProductId)) {
      setSelectedStoreId(initialStoreId);
      setSelectedProductId(initialProductId);
      setStep("amount");
    } else {
      setStep("bottle");
    }
  }

  function requestAddFriend(friend: FriendUser) {
    setError(null);
    setPendingFriend(friend);
  }

  function confirmAddFriend() {
    if (!pendingFriend) return;
    startTransition(async () => {
      try {
        await addFriendAction(pendingFriend.id);
        await refreshFriends();
        setPendingFriend(null);
        setTab("friends");
        setFriendFilter("");
        pickFriend(pendingFriend);
      } catch (e) {
        setError(e instanceof Error ? e.message : "友だち追加に失敗しました");
      }
    });
  }

  function submitSend() {
    if (!selectedFriend || !selectedStock) return;
    startTransition(async () => {
      try {
        await sendBottleToFriendAction({
          friendId: selectedFriend.id,
          storeId: selectedStock.storeId,
          productId: selectedStock.productId,
          units,
          message,
        });
        await refreshState();
        setStep("done");
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "送信に失敗しました");
      }
    });
  }

  const storeName = stores.find((s) => s.id === selectedStock?.storeId)?.name ?? "加盟店";

  const displayError = error ?? friendsError;

  if (step === "done" && selectedFriend && selectedStock) {
    return (
      <main className="pb-8 pt-2">
        <div className="mb-surface flex flex-col items-center px-6 py-12 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#ecfdf5] text-[#14b8a6]">
            <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden />
          </span>
          <h1 className="mt-5 text-xl font-extrabold text-[var(--mb-ink)]">送りました</h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
            {selectedFriend.displayName} さんのマイボトルに
            <br />
            {selectedStock.productName} {units}
            {selectedStock.unitLabel} を追加しました
          </p>
          <Link href="/" className="mb-btn-primary mt-8 w-full max-w-xs py-3.5 text-sm">
            ホームへ
          </Link>
          <button
            type="button"
            className="mt-3 text-sm font-extrabold text-[#0d9488]"
            onClick={() => {
              setStep("recipient");
              setSelectedFriend(null);
              setSelectedStoreId("");
              setSelectedProductId("");
              setUnits(1);
              setMessage("");
            }}
          >
            続けて送る
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-8 pt-2">
      <div className="mb-4 flex items-center gap-2">
        {step !== "recipient" ? (
          <button
            type="button"
            onClick={() => {
              setError(null);
              if (step === "bottle") setStep("recipient");
              else if (step === "amount") setStep("bottle");
              else if (step === "confirm") setStep("amount");
            }}
            className="grid h-9 w-9 place-items-center rounded-full bg-[var(--mb-muted)] text-[var(--mb-ink)]"
            aria-label="戻る"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>
        ) : null}
        <h1 className="mb-screen-title flex-1">送る</h1>
      </div>

      {step === "recipient" ? (
        <div className="space-y-4">
          <div className="flex rounded-full bg-[var(--mb-muted)] p-1">
            <button
              type="button"
              onClick={() => setTab("friends")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-extrabold transition ${
                tab === "friends" ? "bg-white text-[#0d9488] shadow-sm" : "text-[#64748b]"
              }`}
            >
              <Users className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
              友だち
            </button>
            <button
              type="button"
              onClick={() => setTab("add")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-extrabold transition ${
                tab === "add" ? "bg-white text-[#0d9488] shadow-sm" : "text-[#64748b]"
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
              友だち追加
            </button>
          </div>

          {tab === "friends" ? (
            <div className="space-y-3">
              {friendList.length > 0 ? (
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={friendFilter}
                    onChange={(e) => setFriendFilter(e.target.value)}
                    placeholder="友だちを検索"
                    className="mb-search-input w-full pl-11"
                    autoComplete="off"
                  />
                </div>
              ) : null}

              {friendsLoading && friends === null ? (
                <ul className="space-y-2" aria-busy="true">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <li key={i} className="mb-surface flex animate-pulse items-center gap-3 p-4">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--mb-muted)]" />
                      <div className="h-4 flex-1 rounded bg-[var(--mb-muted)]" />
                    </li>
                  ))}
                </ul>
              ) : friendList.length === 0 ? (
                <div className="mb-surface flex min-h-[min(52vh,22rem)] flex-col items-center justify-center px-6 py-12 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#ecfdf5] to-[#d1faf0] text-[#14b8a6] shadow-[0_4px_14px_rgba(20,184,166,0.15)]">
                    <Users className="h-6 w-6" strokeWidth={2.25} aria-hidden />
                  </span>
                  <p className="mt-5 text-base font-extrabold text-[var(--mb-ink)]">友だちがまだいません</p>
                  <p className="mt-2 max-w-[16rem] text-xs font-medium leading-relaxed text-[var(--mb-forest-light)]">
                    まずユーザーを探して
                    <br />
                    友だちに追加しましょう
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab("add")}
                    className="mb-btn-primary mx-auto mt-7 flex w-full max-w-[13.5rem] items-center justify-center gap-1.5 py-3 text-sm shadow-[0_6px_18px_rgba(20,184,166,0.28)]"
                  >
                    <UserPlus className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                    友だちを追加
                  </button>
                </div>
              ) : filteredFriends.length === 0 ? (
                <div className="mb-surface px-5 py-10 text-center">
                  <p className="text-sm font-extrabold text-[var(--mb-ink)]">該当する友だちがいません</p>
                  <p className="mt-2 text-xs font-medium text-[var(--mb-forest-light)]">
                    別のキーワードで検索するか、新しい友だちを追加してください
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFriendFilter("");
                      setTab("add");
                    }}
                    className="mt-5 text-sm font-extrabold text-[#0d9488]"
                  >
                    友だちを追加する
                  </button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {filteredFriends.map((friend) => (
                    <li key={friend.id}>
                      <button
                        type="button"
                        onClick={() => pickFriend(friend)}
                        className="mb-surface flex w-full items-center gap-3 p-4 text-left transition active:scale-[0.99]"
                      >
                        <FriendAvatar friend={friend} />
                        <span className="min-w-0 flex-1 font-extrabold text-[var(--mb-ink)]">
                          {friend.displayName}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#94a3b8]" strokeWidth={2.5} aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {friendList.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setTab("add")}
                  className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-[#99f6e4] bg-[#ecfdf5]/60 py-3 text-xs font-extrabold text-[#0d9488] transition active:bg-[#ecfdf5]"
                >
                  <UserPlus className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
                  新しい友だちを追加
                </button>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="mb-surface px-4 py-3">
                <p className="text-xs font-extrabold text-[var(--mb-ink)]">友だちを探して追加</p>
                <p className="mt-1 text-[11px] font-medium leading-relaxed text-[var(--mb-forest-light)]">
                  表示名・メール・電話番号で検索し、見つかった人を友だちに追加できます。追加後すぐ杯数を送れます。
                </p>
              </div>

              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]"
                  strokeWidth={2.25}
                  aria-hidden
                />
                <input
                  type="search"
                  value={addSearchQuery}
                  onChange={(e) => setAddSearchQuery(e.target.value)}
                  placeholder="表示名・メール・電話番号"
                  className="mb-search-input w-full pl-11"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              <p className="px-1 text-[11px] font-medium text-[#94a3b8]">
                2文字以上。表示名は部分一致、メール・電話は登録情報と一致する必要があります。
              </p>

              {addSearchError ? (
                <p className="text-center text-sm font-bold text-red-500">{addSearchError}</p>
              ) : null}

              {addSearchQuery.trim().length < 2 ? (
                <div className="mb-surface px-5 py-8 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#ecfdf5] text-[#14b8a6]">
                    <Search className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                  </span>
                  <p className="mt-4 text-sm font-extrabold text-[var(--mb-ink)]">ユーザーを検索</p>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-[var(--mb-forest-light)]">
                    相手の表示名・メール・電話番号を入力してください
                  </p>
                </div>
              ) : addSearching ? (
                <ul className="space-y-2" aria-busy="true">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <li key={i} className="mb-surface flex animate-pulse items-center gap-3 p-4">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--mb-muted)]" />
                      <div className="h-4 flex-1 rounded bg-[var(--mb-muted)]" />
                    </li>
                  ))}
                </ul>
              ) : addSearchResults.length === 0 ? (
                <div className="space-y-3">
                  <div className="mb-surface px-5 py-8 text-center">
                    <p className="text-sm font-extrabold text-[var(--mb-ink)]">該当するユーザーがいません</p>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-[var(--mb-forest-light)]">
                      キーワードを変えるか、すでに友だちの場合は友だちタブを確認してください
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {addSearchResults.map((user) => (
                    <li key={user.id}>
                      <button
                        type="button"
                        onClick={() => requestAddFriend(user)}
                        className="mb-surface flex w-full items-center gap-3 p-4 text-left transition active:scale-[0.99]"
                      >
                        <FriendAvatar friend={user} />
                        <span className="min-w-0 flex-1">
                          <span className="block font-extrabold text-[var(--mb-ink)]">{user.displayName}</span>
                          <span className="mt-0.5 block text-[11px] font-medium text-[#0d9488]">
                            タップして友だちに追加
                          </span>
                        </span>
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ecfdf5] text-[#14b8a6]">
                          <UserPlus className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ) : null}

      {step === "bottle" && selectedFriend ? (
        <div className="space-y-4">
          <div className="mb-surface flex items-center gap-3 p-4">
            <FriendAvatar friend={selectedFriend} />
            <div>
              <p className="text-[11px] font-bold text-[var(--mb-forest-light)]">送る相手</p>
              <p className="font-extrabold text-[var(--mb-ink)]">{selectedFriend.displayName}</p>
            </div>
          </div>

          {stock.length === 0 ? (
            <div className="mb-surface px-5 py-10 text-center">
              <p className="text-sm font-extrabold">送れるボトルがありません</p>
              <Link href="/products/step-1" className="mb-btn-primary mt-6 inline-flex px-6 py-3 text-sm">
                ボトルを購入する
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {stock.map((item) => {
                const storeLabel = stores.find((s) => s.id === item.storeId)?.name ?? "加盟店";
                return (
                  <li key={`${item.storeId}-${item.productId}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStoreId(item.storeId);
                        setSelectedProductId(item.productId);
                        setUnits(1);
                        setStep("amount");
                      }}
                      className="mb-surface flex w-full items-center gap-3 p-3 text-left transition active:scale-[0.99]"
                    >
                      <BottleProductImage
                        productId={item.productId}
                        type={item.type}
                        frameClassName="h-14 w-14"
                        fallbackEmojiClassName="text-xl"
                        plain
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-[var(--mb-forest-light)]">{storeLabel}</p>
                        <p className="font-extrabold text-[var(--mb-ink)]">{item.productName}</p>
                        <p className="mt-0.5 text-xs font-bold text-[#0d9488]">
                          残り {item.remainingUnits}
                          {item.unitLabel}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#94a3b8]" strokeWidth={2.5} aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}

      {step === "amount" && selectedFriend && selectedStock ? (
        <div className="space-y-4">
          <div className="mb-surface p-4">
            <p className="text-[11px] font-bold text-[var(--mb-forest-light)]">{storeName}</p>
            <p className="mt-1 font-extrabold text-[var(--mb-ink)]">{selectedStock.productName}</p>
            <p className="mt-1 text-xs font-medium text-[#64748b]">
              {selectedFriend.displayName} さんへ送る杯数
            </p>
            <div className="mt-5 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => setUnits((n) => Math.max(1, n - 1))}
                disabled={units <= 1}
                className="grid h-11 w-11 place-items-center rounded-full bg-[var(--mb-muted)] text-[var(--mb-ink)] disabled:opacity-40"
                aria-label="減らす"
              >
                <Minus className="h-5 w-5" strokeWidth={2.5} />
              </button>
              <p className="min-w-[5rem] text-center text-3xl font-extrabold tabular-nums text-[var(--mb-ink)]">
                {units}
                <span className="ml-1 text-base">{selectedStock.unitLabel}</span>
              </p>
              <button
                type="button"
                onClick={() => setUnits((n) => Math.min(maxUnits, n + 1))}
                disabled={units >= maxUnits}
                className="grid h-11 w-11 place-items-center rounded-full bg-[var(--mb-muted)] text-[var(--mb-ink)] disabled:opacity-40"
                aria-label="増やす"
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
            <p className="mt-3 text-center text-xs font-medium text-[#94a3b8]">
              残り {maxUnits}
              {selectedStock.unitLabel} まで送れます
            </p>
          </div>

          <div className="mb-surface space-y-2 p-4">
            <label htmlFor="gift-message" className="text-xs font-semibold text-[var(--mb-forest-light)]">
              メッセージ（任意）
            </label>
            <input
              id="gift-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={80}
              placeholder="お疲れさま！など"
              className="w-full rounded-xl border border-[var(--mb-ring)] bg-white px-3 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--mb-accent)]/35"
            />
          </div>

          <button
            type="button"
            onClick={() => setStep("confirm")}
            className="mb-btn-primary w-full py-3.5 text-sm"
          >
            確認へ
          </button>
        </div>
      ) : null}

      {step === "confirm" && selectedFriend && selectedStock ? (
        <div className="space-y-4">
          <div className="mb-surface space-y-4 p-5">
            <div className="flex items-center gap-3">
              <FriendAvatar friend={selectedFriend} size="lg" />
              <div>
                <p className="text-[11px] font-bold text-[var(--mb-forest-light)]">送る相手</p>
                <p className="text-lg font-extrabold text-[var(--mb-ink)]">{selectedFriend.displayName}</p>
              </div>
            </div>
            <div className="rounded-xl bg-[var(--mb-muted)] p-4">
              <p className="text-[11px] font-bold text-[var(--mb-forest-light)]">{storeName}</p>
              <p className="mt-1 font-extrabold">{selectedStock.productName}</p>
              <p className="mt-3 text-2xl font-extrabold text-[#0d9488]">
                {units}
                {selectedStock.unitLabel}
              </p>
              {message.trim() ? (
                <p className="mt-3 text-sm font-medium text-[#64748b]">「{message.trim()}」</p>
              ) : null}
            </div>
            <p className="text-xs font-medium leading-relaxed text-[#64748b]">
              送信後、{selectedFriend.displayName} さんのマイボトルにすぐ反映されます。この操作は取り消せません。
            </p>
          </div>

          <button
            type="button"
            disabled={pending}
            onClick={submitSend}
            className="mb-btn-primary flex w-full items-center justify-center gap-2 py-3.5 text-sm disabled:opacity-60"
          >
            <SendHorizontal className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            {pending ? "送信中..." : "送る"}
          </button>
        </div>
      ) : null}

      {displayError ? <p className="mt-4 text-center text-sm font-bold text-red-500">{displayError}</p> : null}

      <AddFriendSheet
        friend={pendingFriend}
        pending={pending}
        onConfirm={confirmAddFriend}
        onClose={() => setPendingFriend(null)}
      />
    </main>
  );
}
