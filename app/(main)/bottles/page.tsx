import Link from "next/link";
import { BottlesListClient } from "@/components/mybottle/bottles-list-client";

export default function BottlesPage() {
  return (
    <main className="space-y-5 pb-24 pt-2">
      <h1 className="mb-screen-title">ボトル一覧</h1>
      <BottlesListClient />
      <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-md px-4">
        <Link href="/add-bottle" className="mb-btn-primary w-full py-4 text-base shadow-lg">
          ボトルを追加
        </Link>
      </div>
    </main>
  );
}
