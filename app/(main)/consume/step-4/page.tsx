import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string; units?: string }>;
};

export default async function ConsumeStep4Page({ searchParams }: Props) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.storeId) query.set("storeId", params.storeId);
  if (params.productId) query.set("productId", params.productId);
  if (params.units) query.set("units", params.units);
  const suffix = query.toString();
  redirect(suffix ? `/consume/step-3?${suffix}` : "/consume/step-3");
}
