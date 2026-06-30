"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { listFriendsAction } from "@/app/(main)/actions/friend-actions";
import type { FriendUser } from "@/lib/mybottle/friends";

type FriendsContextValue = {
  friends: FriendUser[] | null;
  loading: boolean;
  error: string | null;
  ensureFriends: () => Promise<FriendUser[]>;
  refreshFriends: () => Promise<FriendUser[]>;
};

const FriendsContext = createContext<FriendsContextValue | null>(null);

export function FriendsProvider({ children }: { children: React.ReactNode }) {
  const cacheRef = useRef<FriendUser[] | null>(null);
  const inflightRef = useRef<Promise<FriendUser[]> | null>(null);
  const [friends, setFriends] = useState<FriendUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshFriends = useCallback(async () => {
    setLoading(true);
    setError(null);
    inflightRef.current = null;

    try {
      const list = await listFriendsAction();
      cacheRef.current = list;
      setFriends(list);
      return list;
    } catch {
      const message = "友だち一覧の読み込みに失敗しました";
      setError(message);
      cacheRef.current = [];
      setFriends([]);
      return [];
    } finally {
      setLoading(false);
      inflightRef.current = null;
    }
  }, []);

  const ensureFriends = useCallback(async () => {
    if (cacheRef.current !== null) {
      if (friends === null) setFriends(cacheRef.current);
      return cacheRef.current;
    }

    if (!inflightRef.current) {
      setLoading(true);
      setError(null);
      inflightRef.current = (async () => {
        try {
          const list = await listFriendsAction();
          cacheRef.current = list;
          setFriends(list);
          return list;
        } catch {
          const message = "友だち一覧の読み込みに失敗しました";
          setError(message);
          cacheRef.current = [];
          setFriends([]);
          return [];
        } finally {
          setLoading(false);
          inflightRef.current = null;
        }
      })();
    }

    return inflightRef.current;
  }, [friends]);

  const value = useMemo(
    () => ({ friends, loading, error, ensureFriends, refreshFriends }),
    [friends, loading, error, ensureFriends, refreshFriends],
  );

  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
}

export function useFriends() {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error("useFriends must be used within FriendsProvider");
  }
  return context;
}
