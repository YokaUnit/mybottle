"use client";

import { useState } from "react";
import { updateProductAction } from "@/app/(admin-manage)/admin/actions";
import { ChevronDown } from "lucide-react";

export type ProductAdminItem = {
  id: string;
  name: string;
  category: string;
  type: "virtual" | "physical";
  priceJpy: number;
  bundleSize: number;
  description: string;
  imagePath: string | null;
  isActive: boolean;
};

export function AdminProductsClient({ products }: { products: ProductAdminItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="space-y-2">
      {products.map((product) => {
        const open = openId === product.id;
        return (
          <li key={product.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#e7e5e4]">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : product.id)}
              className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left"
            >
              <span>
                <span className="block font-extrabold text-[#292524]">{product.name}</span>
                <span className="mt-0.5 block text-xs font-medium text-[#78716c]">
                  {product.category} · {product.priceJpy.toLocaleString("ja-JP")}円
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    product.isActive ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {product.isActive ? "公開" : "非公開"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-[#a8a29e] transition ${open ? "rotate-180" : ""}`}
                  strokeWidth={2.5}
                />
              </span>
            </button>

            {open ? (
              <form action={updateProductAction} className="space-y-2 border-t border-[#f5f5f4] px-4 py-3">
                <input type="hidden" name="product_id" value={product.id} />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    name="price_jpy"
                    type="number"
                    min={0}
                    defaultValue={product.priceJpy}
                    className="rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
                    placeholder="価格"
                  />
                  <input
                    name="bundle_size"
                    type="number"
                    min={1}
                    defaultValue={product.bundleSize}
                    className="rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
                    placeholder="セット杯数"
                  />
                </div>
                <textarea
                  name="description"
                  defaultValue={product.description}
                  rows={2}
                  className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
                />
                <input
                  name="image_path"
                  defaultValue={product.imagePath ?? ""}
                  className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
                  placeholder="画像パス（例: products/whisky-1.webp）"
                />
                <select
                  name="is_active"
                  defaultValue={product.isActive ? "true" : "false"}
                  className="h-10 w-full rounded-xl border border-[#e7e5e4] bg-[#fffbeb] px-3 text-sm"
                >
                  <option value="true">公開</option>
                  <option value="false">非公開</option>
                </select>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#b45309] py-2.5 text-xs font-extrabold text-white"
                >
                  保存する
                </button>
              </form>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
