/**
 * 상품 이미지 컴포넌트
 * - src가 있으면 실제 이미지 표시, 없으면 placeholder
 * - src/data/images/ 에 이미지 넣고 productImages.ts 에 등록
 */
const PlaceholderImg = ({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) => (
  <div
    className={
      "relative overflow-hidden rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-800 " +
      className
    }
  >
    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_45%)]" />
    <div className="absolute bottom-2 left-2 text-[11px] text-zinc-200/80">
      {label}
    </div>
  </div>
);

export default function ProductImage({
  src,
  label = "사진",
  className = "",
  objectFit = "cover",
}: {
  src?: string | null;
  label?: string;
  className?: string;
  objectFit?: "cover" | "contain";
}) {
  if (src) {
    return (
      <div
        className={
          "relative overflow-hidden border border-zinc-800 bg-zinc-900 rounded-lg " +
          className
        }
      >
        <img
          src={src}
          alt={label}
          className={"w-full h-full " + (objectFit === "contain" ? "object-contain" : "object-cover")}
        />
      </div>
    );
  }
  return <PlaceholderImg label={label} className={className} />;
}
