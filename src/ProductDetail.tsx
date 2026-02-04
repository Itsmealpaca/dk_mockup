import { useParams, useNavigate } from "react-router-dom";

const PRODUCTS: Record<
  string,
  {
    title: string;
    price: number;
    meta: string;
    tags: string[];
    desc: string;
    seller: string;
    location: string;
    likes: number;
    chats: number;
    views: number;
  }
> = {
  "1": {
    title: "엔진11 크리드티 픽시 자전거",
    price: 250000,
    meta: "일산동구 마두동 · 33분 전",
    tags: ["10대 인기🔥 픽시 자전거"],
    desc: "1년 정도 타신 엔진11 픽시 자전거입니다. 브레이크, 체인 정비 완료했어요. 직거래 선호합니다. 마두역 근처에서 만날 수 있어요.",
    seller: "자전거매니아",
    location: "경기 고양시 일산동구 마두동",
    likes: 3,
    chats: 2,
    views: 127,
  },
  "2": {
    title: "도스노벤타 로스 픽시 (화이트)",
    price: 200000,
    meta: "1.7km · 행신동 · 끌올 1시간 전",
    tags: ["픽시", "화이트"],
    desc: "도스노벤타 로스 픽시 화이트 컬러입니다. 싱글기어라 관리가 편해요. 상태 매우 좋습니다.",
    seller: "픽시마스터",
    location: "경기 고양시 덕양구 행신동",
    likes: 12,
    chats: 0,
    views: 234,
  },
  "3": {
    title: "언노운 LV1 픽시 자전거",
    price: 400000,
    meta: "고양시 일산동구 마두동 · 이웃광고",
    tags: ["픽시", "언노운", "이웃광고"],
    desc: "언노운 LV1 픽시입니다. 카본 포크 적용, 가벼운 프레임. 이웃광고 등록 중이에요.",
    seller: "픽시러버",
    location: "경기 고양시 일산동구 마두동",
    likes: 11,
    chats: 8,
    views: 342,
  },
  "4": {
    title: "26인치 MTB 자전거",
    price: 200000,
    meta: "행신동 · 22분 전",
    tags: ["MTB", "26인치"],
    desc: "1년 정도 타신 26인치 MTB 자전거입니다. 브레이크, 체인 정비 완료했어요. 직거래 선호합니다.",
    seller: "MTB러버",
    location: "경기 고양시 덕양구 행신동",
    likes: 3,
    chats: 2,
    views: 127,
  },
  "5": {
    title: "삼천리자전거 삼천리 튜러 · 21 하이브리드 자전거 700C",
    price: 70000,
    meta: "고양시 일산동구 식사동 · 1일 전",
    tags: ["10만원 이하 가성비💸"],
    desc: "출퇴근용 하이브리드 자전거입니다. 700C 휠이라 도로 주행이 편해요. 상태 좋고 가격도 깎지 않았어요!",
    seller: "일상라이더",
    location: "경기 고양시 일산동구 식사동",
    likes: 5,
    chats: 3,
    views: 89,
  },
  "6": {
    title: "알톤 생활자전거 26인치",
    price: 50000,
    meta: "270m · 화정동 · 1일 전",
    tags: ["생활자전거", "26인치", "가성비"],
    desc: "출퇴근용 알톤 생활자전거입니다. 26인치로 안정적이에요. 상태 좋고 가격 negotiable해요.",
    seller: "화정이모",
    location: "경기 고양시 덕양구 화정동",
    likes: 8,
    chats: 4,
    views: 156,
  },
  "7": {
    title: "중고 MTB 자전거 (연식 있음)",
    price: 45000,
    meta: "주엽동 · 4일 전",
    tags: ["MTB", "저가", "중고"],
    desc: "연식 있는 MTB 자전거입니다. 사용감 있지만 타는데 문제없어요. 초보자용으로 좋아요.",
    seller: "바이크맨",
    location: "경기 고양시 일산동구 주엽동",
    likes: 1,
    chats: 0,
    views: 43,
  },
  "8": {
    title: "로드마스터 접이식 미니벨로",
    price: 300000,
    meta: "일산동구 백마동 · 2일 전",
    tags: ["미니벨로", "접이식", "로드마스터"],
    desc: "로드마스터 접이식 미니벨로예요. 휴대성 좋고 수납 편해요. 거의 새 거입니다.",
    seller: "미니벨로맨",
    location: "경기 고양시 일산동구 백마동",
    likes: 2,
    chats: 1,
    views: 43,
  },
  "9": {
    title: "알톤 미니벨로 20인치",
    price: 180000,
    meta: "능곡동 · 2일 전",
    tags: ["미니벨로", "20인치", "알톤"],
    desc: "알톤 미니벨로 20인치입니다. 초등학생~성인까지 사용 가능. 상태 양호해요.",
    seller: "능곡라이더",
    location: "경기 고양시 덕양구 능곡동",
    likes: 2,
    chats: 1,
    views: 56,
  },
  "10": {
    title: "휴대성 좋은 브롬톤 스타일 미니벨로",
    price: 220000,
    meta: "행신동 · 3일 전",
    tags: ["미니벨로", "브롬톤", "휴대용"],
    desc: "브롬톤 스타일 접이식 미니벨로예요. 지하철/버스 휴대 가능. 주행감 좋아요.",
    seller: "폴딩바이크",
    location: "경기 고양시 덕양구 행신동",
    likes: 10,
    chats: 4,
    views: 189,
  },
  "11": {
    title: "CRNK 아티카 자전거 헬멧 L 그레이",
    price: 50000,
    meta: "일산동구 백마동 · 2일 전",
    tags: ["헬멧", "라이딩 용품", "안전"],
    desc: "CRNK 아티카 헬멧 L사이즈 그레이. MIPS 적용. 거의 새 제품이에요.",
    seller: "안전라이더",
    location: "경기 고양시 일산동구 백마동",
    likes: 15,
    chats: 1,
    views: 78,
  },
  "12": {
    title: "자전거 LED 라이트 세트",
    price: 15000,
    meta: "마두동 · 2일 전",
    tags: ["라이트", "LED", "야간 주행"],
    desc: "자전거 LED 전조등+후미등 세트입니다. USB 충전식. 야간 주행 필수용품이에요.",
    seller: "라이트샵",
    location: "경기 고양시 일산동구 마두동",
    likes: 2,
    chats: 0,
    views: 34,
  },
  "13": {
    title: "상태좋은 라이딩 장갑 + 보호대 세트",
    price: 30000,
    meta: "일산동구 대화동 · 3일 전",
    tags: ["장갑", "보호대", "라이딩 용품"],
    desc: "라이딩 장갑과 무릎/팔꿈치 보호대 세트. 거의 미사용 상태. 함께 구매하시면 좋아요.",
    seller: "라이딩용품",
    location: "경기 고양시 일산동구 대화동",
    likes: 2,
    chats: 1,
    views: 45,
  },
};

function formatKRW(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

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

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? PRODUCTS[id] : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center">
        <p className="text-zinc-400">상품을 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200"
        >
          목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-zinc-900">
        <div className="max-w-[430px] mx-auto flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-300 text-[14px] hover:text-zinc-100"
          >
            ←
          </button>
          <span className="text-[14px] text-zinc-400">상품 상세</span>
          <button className="text-zinc-300 text-[14px] hover:text-zinc-100">
            ⋯
          </button>
        </div>
      </header>

      <main className="max-w-[430px] mx-auto pb-24">
        <div className="w-full aspect-square">
          <PlaceholderImg label="상품 사진" className="w-full h-full rounded-none" />
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-zinc-800" />
            <div>
              <div className="text-[15px] font-semibold text-zinc-100">
                {product.seller}
              </div>
              <div className="text-[12px] text-zinc-400">{product.location}</div>
            </div>
          </div>

          <h1 className="mt-4 text-[18px] font-semibold text-zinc-100 leading-snug">
            {product.title}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full border border-orange-500/70 text-orange-500 text-[11px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-2 text-[12px] text-zinc-400">{product.meta}</div>
          <div className="mt-4 text-[22px] font-bold text-zinc-100">
            {formatKRW(product.price)}
          </div>

          <div className="mt-6 text-[15px] text-zinc-200 leading-relaxed whitespace-pre-wrap">
            {product.desc}
          </div>

          <div className="mt-6 flex gap-6 text-[13px] text-zinc-400">
            <span>관심 {product.likes}</span>
            <span>채팅 {product.chats}</span>
            <span>조회 {product.views}</span>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-black border-t border-zinc-900 p-4 flex gap-2">
        <button className="p-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-900">
          ♡
        </button>
        <button className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600">
          채팅하기
        </button>
      </footer>
    </div>
  );
}
