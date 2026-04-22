import { BenefitsPageClient } from "@/components/mybottle/benefits-page-client";
import { getBenefitNews } from "@/lib/supabase/mybottle";

export default async function BenefitsPage() {
  const news = await getBenefitNews();
  return <BenefitsPageClient initialNews={news} />;
}
