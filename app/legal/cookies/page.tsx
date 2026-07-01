import { LegalDocumentPage } from "@/components/mybottle/legal/legal-document-page";
import { getLegalCompanyInfo } from "@/lib/legal/company";
import { getCookieDocument } from "@/lib/legal/documents";

import { resolveLegalBackHref } from "@/lib/legal/navigation";

export const metadata = { title: "Cookieポリシー" };

type Props = { searchParams: Promise<{ back?: string }> };

export default async function LegalCookiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const company = getLegalCompanyInfo();
  return (
    <LegalDocumentPage
      document={getCookieDocument(company)}
      backHref={resolveLegalBackHref(params.back)}
    />
  );
}
