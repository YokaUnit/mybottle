import { BenefitsPageClient } from "@/components/mybottle/benefits-page-client";
import { getPublicStoreBenefits } from "@/lib/store-manage/queries";
import { getBenefitNews } from "@/lib/supabase/mybottle";

export default async function BenefitsPage() {
  const [news, storeBenefits] = await Promise.all([getBenefitNews(), getPublicStoreBenefits()]);
  return <BenefitsPageClient initialNews={news} storeBenefits={storeBenefits} />;
}
