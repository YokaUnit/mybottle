export type LegalCompanyInfo = {
  serviceName: string;
  operatorName: string;
  representative: string;
  address: string;
  phone: string;
  email: string;
  businessHours: string;
  established: string | null;
  corporateNumber: string | null;
  jurisdictionCourt: string;
  lastUpdated: string;
};

/** 法務表記用の事業者情報。本番では環境変数で実情報を設定してください。 */
export function getLegalCompanyInfo(): LegalCompanyInfo {
  return {
    serviceName: "mybottle",
    operatorName: process.env.LEGAL_OPERATOR_NAME ?? "mybottle運営事務局",
    representative: process.env.LEGAL_REPRESENTATIVE ?? "運営責任者",
    address:
      process.env.LEGAL_ADDRESS ??
      "（開示請求・お問い合わせの際に遅滞なく開示いたします）",
    phone:
      process.env.LEGAL_PHONE ??
      "（開示請求・お問い合わせの際に遅滞なく開示いたします）",
    email: process.env.LEGAL_CONTACT_EMAIL ?? "support@mybottle.app",
    businessHours: process.env.LEGAL_BUSINESS_HOURS ?? "平日 10:00〜18:00（土日祝・年末年始を除く）",
    established: process.env.LEGAL_ESTABLISHED ?? null,
    corporateNumber: process.env.LEGAL_CORPORATE_NUMBER ?? null,
    jurisdictionCourt: process.env.LEGAL_JURISDICTION_COURT ?? "東京地方裁判所",
    lastUpdated: "2026年6月18日",
  };
}

export function legalContactMailto(subject: string, bodyPrefix = "") {
  const info = getLegalCompanyInfo();
  const params = new URLSearchParams({
    subject,
    body: `${bodyPrefix}\n\n---\nアカウント（ログイン時のメール）:\nお問い合わせ種別:\n内容:\n`,
  });
  return `mailto:${info.email}?${params.toString()}`;
}
