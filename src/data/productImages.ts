/**
 * 상품 ID별 이미지
 * - id -> 파일명 매핑 (src/data/images/ 폴더 기준)
 * - import로 로드하여 base path 문제 없음
 */
export const IMAGE_BY_ID: Record<string, string> = {
  "1": "bike-1.png",
  "2": "bike-2.png",
  "3": "bike-3.png",
  "4": "bike-4.png",
  "5": "bike-5.png",
  "6": "bike-6.png",
  "7": "bike-7.png",
  "8": "bike-8.png",
  "9": "bike-9.png",
  "10": "bike-10.png",
  "11": "bike-11.png",
  "12": "bike-12.png",
  "13": "bike-13.png",
  // ... (상품 id "1"~"13" 까지 등록 가능)
};

// eager import: 파일명 -> 실제 URL (Vite가 base path 포함한 경로로 변환)
const imageModules = import.meta.glob("./images/*", { eager: true, import: "default" }) as Record<string, string>;

export function getImageUrl(id: string): string | undefined {
  const filename = IMAGE_BY_ID[id];
  if (!filename) return undefined;
  const key = `./images/${filename}`;
  return imageModules[key];
}
