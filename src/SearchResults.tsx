import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Search, Bell, Info } from "lucide-react";

/**
 * 검색 결과 페이지 - 메인 상품별로 각각 존재
 * Search1=1,2,3 / Search2=4,5,6,7 / Search3=8,9,10 / Search4=11,12,13 우선 배치
 */

const Pill = ({ active, children, onClick }: any) => (
  <button
    onClick={onClick}
    className={
      "px-3 py-1.5 rounded-full text-[13px] transition border shrink-0 " +
      (active
        ? "bg-zinc-100 text-zinc-900 border-zinc-100"
        : "bg-zinc-900/40 text-zinc-200 border-zinc-700 hover:bg-zinc-900")
    }
  >
    {children}
  </button>
);

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

function formatKRW(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

// 검색 결과용 13개 매물
const SEARCH_ITEMS = [
  {
    id: "1",
    title: "엔진11 크리드티 픽시 자전거",
    meta: "행신동 · 22분 전",
    price: 250000,
    likes: 3,
    comments: 2,
  },
  {
    id: "2",
    title: "도스노벤타 로스 픽시 (화이트)",
    meta: "1.7km · 행신동 · 끌올 1시간 전",
    price: 200000,
    likes: 12,
    comments: 0,
  },
  {
    id: "3",
    title: "언노운 LV1 픽시 자전거",
    meta: "고양시 일산동구 마두동 · 이웃광고①",
    price: 400000,
    likes: 11,
    comments: 8,
  },
  {
    id: "4",
    title: "26인치 MTB 자전거",
    meta: "행신동 · 22분 전",
    price: 80000,
    likes: 3,
    comments: 2,
  },
  {
    id: "5",
    title: "삼천리자전거 삼천리 튜러 · 21 하이브리드 자전거 700C",
    meta: "고양시 일산동구 식사동 · 1일 전",
    price: 70000,
    likes: 5,
    comments: 3,
  },
  {
    id: "6",
    title: "알톤 생활자전거 26인치",
    meta: "270m · 화정동 · 1일 전",
    price: 50000,
    likes: 8,
    comments: 4,
  },
  {
    id: "7",
    title: "중고 MTB 자전거 (연식 있음)",
    meta: "주엽동 · 4일 전",
    price: 45000,
    likes: 1,
    comments: 0,
  },
  {
    id: "8",
    title: "로드마스터 접이식 미니벨로",
    meta: "일산동구 백마동 · 2일 전",
    price: 300000,
    likes: 2,
    comments: 1,
  },
  {
    id: "9",
    title: "알톤 미니벨로 20인치",
    meta: "능곡동 · 2일 전",
    price: 180000,
    likes: 2,
    comments: 1,
  },
  {
    id: "10",
    title: "휴대성 좋은 브롬톤 스타일 미니벨로",
    meta: "행신동 · 3일 전",
    price: 220000,
    likes: 10,
    comments: 4,
  },
  {
    id: "11",
    title: "CRNK 아티카 자전거 헬멧 L 그레이",
    meta: "일산동구 백마동 · 2일 전",
    price: 50000,
    likes: 15,
    comments: 1,
  },
  {
    id: "12",
    title: "자전거 LED 라이트 세트",
    meta: "마두동 · 2일 전",
    price: 15000,
    likes: 2,
    comments: 0,
  },
  {
    id: "13",
    title: "상태좋은 라이딩 장갑 + 보호대 세트",
    meta: "일산동구 대화동 · 3일 전",
    price: 30000,
    likes: 2,
    comments: 1,
  },
];

// 페이지별 상단 우선 IDs (임의 배정): Search1=1,2,3 / Search2=4,5,6,7 / Search3=8,9,10 / Search4=11,12,13
const PRIORITY_IDS: Record<string, string[]> = {
  "1": ["1", "2", "3"],
  "2": ["4", "5", "6", "7"],
  "3": ["8", "9", "10"],
  "4": ["11", "12", "13"],
};

// 페이지별 상단 검색어
const SEARCH_QUERIES: Record<string, string> = {
  "1": "픽시 자전거",
  "2": "자전거",
  "3": "미니벨로 자전거",
  "4": "자전거 용품",
};

// 시드 기반 셔플 (같은 sortId면 같은 순서 유지)
function shuffleWithSeed<T>(arr: T[], seed: string): T[] {
  const copy = [...arr];
  let s = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function SearchResults() {
  const navigate = useNavigate();
  const { sortId } = useParams<{ sortId: string }>();

  const tabs = useMemo(
    () => ["전체", "중고거래", "동네생활", "스토어", "모임"],
    []
  );
  const [activeTab, setActiveTab] = useState("중고거래");
  const [sortBy, setSortBy] = useState<"recommended" | "latest" | "price">("recommended");
  const [sellOnly, setSellOnly] = useState(true);
  const [buyNow, setBuyNow] = useState(false);

  const searchQuery = SEARCH_QUERIES[sortId || "1"] || "자전거";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [sortId]);

  const sortedItems = useMemo(() => {
    const priorityIds = PRIORITY_IDS[sortId || "1"] || PRIORITY_IDS["1"];
    const itemsById = Object.fromEntries(SEARCH_ITEMS.map((it) => [it.id, it]));

    const priority = priorityIds
      .map((id) => itemsById[id])
      .filter(Boolean);
    const rest = SEARCH_ITEMS.filter((it) => !priorityIds.includes(it.id));
    const shuffledRest = shuffleWithSeed(rest, sortId || "1");

    const combined = [...priority, ...shuffledRest];

    if (sortBy === "price") {
      return [...combined].sort((a, b) => a.price - b.price);
    }
    return combined;
  }, [sortBy, sortId]);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* 헤더 - 검색창 */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-900">
        <div className="max-w-[430px] mx-auto">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <button
              onClick={() => navigate(-1)}
              className="text-zinc-300 text-[14px] shrink-0"
            >
              ←
            </button>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
              <Search size={16} className="text-zinc-400 shrink-0" />
              <span className="text-[14px] text-zinc-100">{searchQuery}</span>
            </div>
            <button className="text-zinc-300 text-[14px] shrink-0">닫기</button>
          </div>

          {/* 탭 */}
          <div className="px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {tabs.map((t) => (
                <Pill
                  key={t}
                  active={t === activeTab}
                  onClick={() => setActiveTab(t)}
                >
                  {t}
                </Pill>
              ))}
            </div>
          </div>

          {/* 필터 */}
          <div className="px-4 pb-3 flex flex-wrap gap-2 items-center">
            <button className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-[12px] text-zinc-300">
              화정동 근처
            </button>
            <button className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-[12px] text-zinc-300">
              2km 이내
            </button>
            {sortId === "2" && (
              <button className="px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-100 text-[12px]">
                10만원 이하
              </button>
            )}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recommended" | "latest" | "price")}
              className="ml-auto px-2 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-[12px] text-zinc-300"
            >
              <option value="recommended">추천순</option>
              <option value="latest">최신순</option>
              <option value="price">가격 낮은순</option>
            </select>
          </div>

          {/* 체크박스 필터 */}
          <div className="px-4 pb-3 flex items-center gap-4 text-[13px] text-zinc-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sellOnly}
                onChange={(e) => setSellOnly(e.target.checked)}
                className="rounded"
              />
              판매중만 보기
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={buyNow}
                onChange={(e) => setBuyNow(e.target.checked)}
                className="rounded"
              />
              바로구매
              <Info size={14} className="text-zinc-500" />
            </label>
          </div>
        </div>
      </div>

      {/* 매물 리스트 (13개, 관련 상품 우선 + 나머지 랜덤) */}
      <main className="max-w-[430px] mx-auto pb-10">
        <div className="px-4">
          {sortedItems.map((it, idx) => (
            <div key={it.id}>
              <Link
                to={`/product/${it.id}`}
                className="flex gap-3 py-4 items-stretch hover:opacity-90 transition-opacity"
              >
                <div className="shrink-0 w-[110px] h-[110px]">
                  <PlaceholderImg label="사진" className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-zinc-100 line-clamp-2 leading-snug">
                    {it.title}
                  </div>
                  <div className="mt-1 text-[12px] text-zinc-400">{it.meta}</div>
                  <div className="mt-2 text-[15px] font-semibold text-zinc-100">
                    {formatKRW(it.price)}
                  </div>
                  <div className="mt-1 flex gap-2 text-[12px] text-zinc-500">
                    <span>♥ {it.likes}</span>
                    {it.comments > 0 && <span>💬 {it.comments}</span>}
                  </div>
                </div>
              </Link>
              {idx < sortedItems.length - 1 && (
                <div className="h-px bg-zinc-800/80" />
              )}
            </div>
          ))}
        </div>

        {/* 자전거 알림 받기 배너 */}
        <div className="mx-4 mt-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-zinc-400" />
            <span className="text-[14px] font-medium text-zinc-200">
              {searchQuery} 알림 받기
            </span>
          </div>
          <button className="text-[13px] text-orange-500 font-medium">
            설정
          </button>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none;}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}
        .line-clamp-2{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;}
      `}</style>
    </div>
  );
}
