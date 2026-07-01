import { LegalDocumentPage, TokushohoTable } from "@/components/mybottle/legal/legal-document-page";
import { getLegalCompanyInfo } from "@/lib/legal/company";
import { getTokushohoRows } from "@/lib/legal/documents";

import { resolveLegalBackHref } from "@/lib/legal/navigation";

export const metadata = { title: "特定商取引法に基づく表記" };

type Props = { searchParams: Promise<{ back?: string }> };

export default async function LegalTokushohoPage({ searchParams }: Props) {
  const params = await searchParams;
  const company = getLegalCompanyInfo();

  return (
    <LegalDocumentPage
      document={{
        title: "特定商取引法に基づく表記",
        description:
          "特定商取引法第11条（通信販売）に基づき、本サービスの運営者情報および取引条件を表示します。",
        sections: [
          {
            title: "表記について",
            body: [
              "本サービスはボトルキープの状態管理を行うプラットフォームです。酒類等の販売・代金受領は各店舗にて行われます。",
              "以下は本サービスの運営者に関する表示です。",
            ],
          },
        ],
      }}
      backHref={resolveLegalBackHref(params.back)}
    >
      <TokushohoTable rows={getTokushohoRows(company)} />
    </LegalDocumentPage>
  );
}
