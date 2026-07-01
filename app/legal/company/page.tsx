import { LegalDocumentPage } from "@/components/mybottle/legal/legal-document-page";
import { getLegalCompanyInfo } from "@/lib/legal/company";
import { getCompanyDocument } from "@/lib/legal/documents";

import { resolveLegalBackHref } from "@/lib/legal/navigation";

export const metadata = { title: "会社概要" };

type Props = { searchParams: Promise<{ back?: string }> };

export default async function LegalCompanyPage({ searchParams }: Props) {
  const params = await searchParams;
  const company = getLegalCompanyInfo();
  return (
    <LegalDocumentPage
      document={getCompanyDocument(company)}
      backHref={resolveLegalBackHref(params.back)}
    />
  );
}
