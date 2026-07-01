import { LegalDocumentPage } from "@/components/mybottle/legal/legal-document-page";
import { getLegalCompanyInfo } from "@/lib/legal/company";
import { getPrivacyDocument } from "@/lib/legal/documents";

import { resolveLegalBackHref } from "@/lib/legal/navigation";

export const metadata = { title: "プライバシーポリシー" };

type Props = { searchParams: Promise<{ back?: string }> };

export default async function LegalPrivacyPage({ searchParams }: Props) {
  const params = await searchParams;
  const company = getLegalCompanyInfo();
  return (
    <LegalDocumentPage
      document={getPrivacyDocument(company)}
      backHref={resolveLegalBackHref(params.back)}
    />
  );
}
