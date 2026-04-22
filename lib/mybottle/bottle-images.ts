/** `public/bottles/{slug}.png` のファイル名（`catalog` の `id` と対応） */
const BOTTLE_FILE_SLUG: Record<string, string> = {
  "beer-5": "beer",
  "sour-5": "lemonsour",
  "kagetsu-1": "kyougetsu",
  "whisky-1": "suntorykaku",
};

function slugForProduct(productId: string): string {
  return BOTTLE_FILE_SLUG[productId] ?? productId;
}

/** 試す URL の順（先にヒットしたものを表示） */
export function bottleImageCandidates(productId: string): string[] {
  const slug = slugForProduct(productId);
  return [
    `/bottles/${slug}.png`,
    `/bottles/${slug}.jpg`,
    `/images/bottles/${productId}.png`,
    `/images/bottles/${productId}.jpg`,
  ];
}
