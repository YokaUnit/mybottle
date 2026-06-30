import type { Metadata } from "next";
import { SendScreenClient } from "@/components/mybottle/send-screen-client";

export const metadata: Metadata = {
  title: "送る",
};

type Props = {
  searchParams: Promise<{
    storeId?: string;
    productId?: string;
    friendId?: string;
  }>;
};

export default async function SendPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <SendScreenClient
      initialStoreId={params.storeId ?? ""}
      initialProductId={params.productId ?? ""}
      initialFriendId={params.friendId ?? ""}
    />
  );
}
