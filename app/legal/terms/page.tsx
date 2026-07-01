import { LegalDocumentPage } from "@/components/mybottle/legal/legal-document-page";
import { getLegalCompanyInfo } from "@/lib/legal/company";
import { getTermsDocument } from "@/lib/legal/documents";
import { resolveLegalBackHref } from "@/lib/legal/navigation";

export const metadata = { title: "利用規約" };

type Props = { searchParams: Promise<{ back?: string }> };

export default async function LegalTermsPage({ searchParams }: Props) {
  const params = await searchParams;
  const company = getLegalCompanyInfo();
  return (
    <LegalDocumentPage
      document={getTermsDocument(company)}
      backHref={resolveLegalBackHref(params.back)}
    />
  );
}
