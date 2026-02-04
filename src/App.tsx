import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  Bell,
  MoreVertical,
  ChevronRight,
  Megaphone,
  Bike,
  Users,
  Route,
  Wallet,
} from "lucide-react";

/**
 * 당근 '자전거' 검색 결과 화면을 참고한 웹 UI 목업입니다.
 * - 모바일(약 390px) 기준으로 가운데 정렬
 * - 다크 테마, 탭, 광고 카드, 중고거래 리스트, 상품 가로 스크롤, 동네생활 카드, 모임 섹션
 * - 실제 데이터/이미지는 더미(placeholder)로 구성
 */

const Pill = ({ active, children, onClick }: any) => (
  <button
    onClick={onClick}
    className={
      "px-3 py-1.5 rounded-full text-[13px] transition border " +
      (active
        ? "bg-zinc-100 text-zinc-900 border-zinc-100"
        : "bg-zinc-900/40 text-zinc-200 border-zinc-700 hover:bg-zinc-900")
    }
  >
    {children}
  </button>
);

const SectionTitle = ({ title, right }: any) => (
  <div className="flex items-center justify-between px-4 pt-5 pb-2">
    <div className="text-[15px] font-semibold text-zinc-100">{title}</div>
    {right}
  </div>
);

const Hr = () => <div className="h-px bg-zinc-800/80 my-2" />;

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

const Price = ({ value }: any) => (
  <div className="text-[15px] font-semibold text-zinc-100">{value}</div>
);

const Meta = ({ children }: any) => (
  <div className="text-[12px] text-zinc-400">{children}</div>
);

const TrendCarousel = ({
  tags,
}: {
  tags: Array<{ hash: string; icon: any; to?: string }>;
}) => {
  if (!tags || tags.length === 0) return null;

  const total = tags.length;

  // 0 → 1 → … → last → … → 1 → 0 로 왕복(ping-pong) 이동
  const [index, setIndex] = useState(0); // 0 ~ total-1
  const [direction, setDirection] = useState<1 | -1>(1); // 1: 오른쪽, -1: 왼쪽

  useEffect(() => {
    const t = window.setInterval(() => {
      setIndex((prev) => {
        // 왼쪽 끝에서 다시 왼쪽으로 가려 하면 오른쪽으로 전환
        if (prev === 0 && direction === -1) {
          setDirection(1);
          return 1;
        }
        // 오른쪽 끝에서 다시 오른쪽으로 가려 하면 왼쪽으로 전환
        if (prev === total - 1 && direction === 1) {
          setDirection(-1);
          return total - 2;
        }
        return prev + direction;
      });
    }, 3000);
    return () => window.clearInterval(t);
  }, [direction, total]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0f1115_0%,#0b0c10_45%,#07080b_100%)] border border-zinc-900">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {tags.map((t, i) => {
          const CardContent = (
            <div className="flex items-center justify-between px-4 py-5">
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-zinc-100">
                  이웃들은 지금
                </div>
                <div className="mt-1 text-[15px] font-semibold text-zinc-100">
                  <span className="text-orange-500">#{t.hash}</span>
                  <span className="text-zinc-100"> 에 관심이 많아요</span>
                </div>
              </div>

              <div className="ml-3 shrink-0">
                <div className="w-[64px] h-[64px] rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] flex items-center justify-center">
                  <t.icon size={34} className="text-orange-500" />
                </div>
              </div>
            </div>
          );
          return (
            <div key={i} className="w-full shrink-0">
              {t.to ? (
                <Link to={t.to} className="block hover:opacity-90 transition-opacity">
                  {CardContent}
                </Link>
              ) : (
                CardContent
              )}
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-3 left-4 flex gap-1.5">
        {tags.map((_, i) => (
          <div
            key={i}
            className={
              "h-1.5 rounded-full transition-all duration-300 " +
              (i === index ? "w-6 bg-zinc-200/80" : "w-1.5 bg-zinc-500/60")
            }
          />
        ))}
      </div>
    </div>
  );
};

function formatKRW(n: number) {
  // 단순 포맷(실서비스 수준 정교함 아님)
  return n.toLocaleString("ko-KR") + "원";
}

export default function App() {
  const tabs = useMemo(() => ["전체", "중고거래", "동네생활", "스토어", "모임"], []);
  const [activeTab, setActiveTab] = useState("전체");
  const [query, setQuery] = useState("자전거");

  const usedItems = useMemo(
    () => [
      {
        id: "1",
        title: "엔진11 크리드티 픽시 자전거",
        tags: ["10대 인기🔥 픽시 자전거"],
        meta: "일산동구 마두동 · 33분 전",
        price: 250000,
        liked: false,
      },
      {
        id: "2",
        title: "삼천리자전거 삼천리 튜러 · 21 하이브리드 자전거 700C",
        tags: ["10만원 이하 가성비💸"],
        meta: "고양시 일산동구 식사동 · 1일 전",
        price: 70000,
        liked: true,
      },
      {
        id: "3",
        title: "로드마스터 접이식 미니벨로 자전거",
        tags: ["작은 바퀴 입문자용 미니벨로🐤"],
        meta: "270m · 화정동 · 1일 전",
        price: 200000,
        liked: true,
      },
      {
        id: "4",
        title: "CRNK 아티카 자전거 헬멧 L 그레이",
        tags: ["안전제일 라이딩 용품🦺"],
        meta: "일산동구 백마동 · 2일 전",
        price: 500000,
        liked: true,
      },
    ],
    []
  );

  const storeAds = useMemo(
    () => [
      { name: "Montheria MTB자전거", price: 193000, shop: "쿠팡" },
      { name: "닥터바이크 2023년형 66cm", price: 179000, shop: "쿠팡" },
      { name: "Montheria 로드자전거", price: 193000, shop: "쿠팡" },
      { name: "하이브리드 700C", price: 169000, shop: "쿠팡" },
      { name: "미니벨로", price: 159000, shop: "쿠팡" },
    ],
    []
  );

  const neighborhoodRepresentativePosts = useMemo(
    () => [
      { id: "1", tag: "자전거 사건·사고 SOS", title: "자전거 잠깐 세워놨는데 도난당했어요", snippet: "저번주 공원에서 잠깐 세워놨는데 돌아오니까 없어졌어요...", meta: "마두동 · 5일 전 · 조회 202", comments: 12 },
      { id: "2", tag: "동네 코스 질문", title: "일산에서 자전거 타기 괜찮은 코스 있을까요?", snippet: "요즘 운동 겸 자전거를 타보려고 하는데 차 많지 않은 코스요.", meta: "백석동 · 12일 전 · 조회 20", comments: 2 },
      { id: "3", tag: "자전거 구매·수리 고민", title: "픽시 자전거 브레이크 수리 어디서 하나요?", snippet: "중고로 산 픽시인데 브레이크가 너무 밀려요.", meta: "주엽동 · 1개월 전 · 조회 47", comments: 1 },
      { id: "4", tag: "같이 탈 이웃 구해요", title: "주말 아침에 가볍게 자전거 타실 분 계신가요?", snippet: "혼자 타다 보니 심심해서요. 한강이나 공원 한 바퀴 같이요.", meta: "화정동 · 3일 전 · 조회 53", comments: 4 },
    ],
    []
  );

  const groups = useMemo(
    () => [
      { id: "1", tag: "가장 사람이 많은 모임", title: "운동으로 친해져요!", meta: "동네 이웃들과 함께 운동도 하고 건강도 챙기고 친목도...", members: "성사2동 · 3" },
      { id: "2", tag: "평균 연령대 65세", title: "고양 덕양구 자전거 모임 🚴", meta: "안녕하세요 덕양구 로드 자전거 모임입니다! - 사방...", members: "토당동 · 40" },
    ],
    []
  );

  const trendTags = useMemo(
    () => [
      { hash: "자전거 동호회", icon: Bike, to: "/meeting/search/1" },
      { hash: "자전거 도난", icon: Users, to: "/neighborhood/1" },
      { hash: "미니벨로 자전거", icon: Bike, to: "/search/3" },
      { hash: "동네 자전거 코스", icon: Route, to: "/neighborhood/2" },
      { hash: "가성비 자전거", icon: Wallet, to: "/search/2" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* 상단 헤더 영역 */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-900">
        <div className="max-w-[430px] mx-auto">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <button className="text-zinc-300 text-[14px]">←</button>

            <div className="flex-1">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <Search size={16} className="text-zinc-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-zinc-500"
                  placeholder="검색"
                />
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-md hover:bg-zinc-800"
                  aria-label="clear"
                >
                  <X size={14} className="text-zinc-400" />
                </button>
              </div>
            </div>

            <button className="text-zinc-300 text-[14px]">닫기</button>
          </div>

          {/* 탭 */}
          <div className="px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {tabs.map((t) => (
                <Pill key={t} active={t === activeTab} onClick={() => setActiveTab(t)}>
                  {t}
                </Pill>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <main className="max-w-[430px] mx-auto pb-10">
        {/* 검색영역 아래, 광고영역 위: 트렌드 섹션(2초마다 자동 전환) */}
        <div className="px-4 pt-3">
          <TrendCarousel tags={trendTags} />
        </div>

        {/* 상단 광고 카드 */}
        <div className="px-4 pt-3">
          <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden px-4 py-2">
            {/* 헤더: 로고 | 비아지오 · 광고 | 더보기 */}
            <div className="flex items-center gap-0 mb-2">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-white tracking-tight">VIAGGIO</span>
              </div>
              <span className="ml-2 text-[12px] text-zinc-400">비아지오 · 광고</span>
              <button className="ml-auto p-1 rounded-md hover:bg-zinc-900" aria-label="more">
                <MoreVertical size={18} className="text-zinc-400" />
              </button>
            </div>
            {/* 본문: 텍스트 | 이미지 */}
            <div className="flex items-stretch gap-0 mb-2">
              <div className="flex-1 min-w-0 pr-3">
                <div className="text-[14px] font-semibold text-zinc-100 leading-snug">
                  출퇴근 전기자전거 인수형렌탈!
                </div>
                <div className="mt-1 text-[12px] text-zinc-400 leading-relaxed">
                  월 렌탈료만 내고 전기자전거 추가금 없이 인수했어요!
                </div>
              </div>
              <div className="w-[100px] h-[100px] shrink-0">
                <PlaceholderImg label="광고 이미지" className="w-full h-full rounded-lg" />
              </div>
            </div>
            {/* CTA: 메가폰 아이콘 | 비아지오 혜택 알아보기 | 화살표 */}
            <button className="w-full flex items-center gap-0 py-2 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                <Megaphone size={16} className="text-white" />
              </div>
              <span className="ml-2 text-[13px] text-zinc-200">비아지오 혜택 알아보기</span>
              <ChevronRight size={18} className="ml-auto text-zinc-400" />
            </button>
          </div>
        </div>

        {/* 중고거래 */}
        <SectionTitle
          title="중고거래"
          right={
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-[13px] text-zinc-200 hover:bg-zinc-900">
              <Bell size={16} className="text-zinc-300" />
              자전거 알림 받기
            </button>
          }
        />

        <div className="px-4">
          <div>
            {usedItems.map((it, idx) => (
              <div key={(it as any).id ?? idx}>
                <Link
                  to={`/search/${(it as any).id}`}
                  className="block hover:opacity-90 transition-opacity"
                >
                  <div className="flex gap-3 py-3 items-stretch">
                    <div className="shrink-0 w-[104px] h-[104px]">
                      <PlaceholderImg label="사진" className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {Array.isArray((it as any).tags) && (it as any).tags.length > 0 ? (
                        <div className="flex flex-nowrap gap-0 mb-2 overflow-hidden">
                          {(it as any).tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 rounded-full border border-orange-500/70 text-orange-500 text-[10px] font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="text-[12px] text-zinc-100 line-clamp-2 leading-snug">
                        {it.title}
                      </div>
                      <div className="mt-0.5">
                        <Meta>{it.meta}</Meta>
                      </div>
                      <div className="mt-1">
                        <Price value={formatKRW(it.price)} />
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        className="p-1 rounded-md hover:bg-zinc-900"
                        aria-label="more"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      >
                        <MoreVertical size={18} className="text-zinc-400" />
                      </button>
                      <div className="text-[12px] text-zinc-400">{it.liked ? "♥" : ""}</div>
                    </div>
                  </div>
                </Link>
                {idx < usedItems.length - 1 ? (
                  <div className="h-px bg-zinc-800/80" />
                ) : null}
              </div>
            ))}
          </div>

          <button className="mt-4 w-full rounded-2xl bg-zinc-800 border border-zinc-800 px-4 py-3 text-[14px] text-zinc-200 hover:bg-zinc-900 inline-flex items-center justify-center gap-2">
            중고거래 더보기
            <ChevronRight size={16} className="text-zinc-400" />
          </button>
        </div>

        <Hr />

        {/* 스토어 광고 영역 */}
        <SectionTitle
          title="광고 · ‘자전거’ 새 상품"
          right={
            <button className="text-[13px] text-zinc-400 hover:text-zinc-300 inline-flex items-center gap-1">
              더보기 <ChevronRight size={14} />
            </button>
          }
        />

        <div className="px-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {storeAds.map((p, i) => (
              <div
                key={i}
                className="min-w-[150px] rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden"
              >
                <div className="p-3">
                  <PlaceholderImg label="상품" className="w-full h-[92px]" />
                  <div className="mt-3 text-[13px] text-zinc-100 line-clamp-2 leading-snug">
                    {p.name}
                  </div>
                  <div className="mt-2 text-[14px] font-semibold text-zinc-100">
                    {formatKRW(p.price)}
                  </div>
                  <div className="mt-1 text-[12px] text-zinc-400">{p.shop}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Hr />

        {/* 동네생활 */}
        <SectionTitle title="동네생활" right={null} />
        <div className="px-4">
          <div>
            {neighborhoodRepresentativePosts.map((post, idx) => (
              <div key={post.id}>
                <Link
                  to={`/neighborhood/${post.id}`}
                  className="block hover:opacity-90 transition-opacity"
                >
                  <div className="flex gap-3 py-3 min-h-[96px]">
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-orange-500/90 mb-1 line-clamp-1">
                        {post.tag}
                      </div>
                      <div className="text-[14px] font-semibold text-zinc-100 line-clamp-1">
                        {post.title}
                      </div>
                      <div className="mt-1 text-[12px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {post.snippet}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <Meta>{post.meta}</Meta>
                        <div className="text-[12px] text-zinc-400">
                          {post.comments > 0 ? `💬 ${post.comments}` : ""}
                        </div>
                      </div>
                    </div>
                    {idx === 0 ? (
                      <PlaceholderImg label="썸네일" className="w-[76px] h-[76px] shrink-0" />
                    ) : null}
                  </div>
                </Link>
                {idx < neighborhoodRepresentativePosts.length - 1 ? (
                  <div className="h-px bg-zinc-800/80" />
                ) : null}
              </div>
            ))}
          </div>

          <button className="mt-4 w-full rounded-2xl bg-zinc-800 border border-zinc-800 px-4 py-3 text-[14px] text-zinc-200 hover:bg-zinc-900 inline-flex items-center justify-center gap-2">
            동네생활 더보기
            <ChevronRight size={16} className="text-zinc-400" />
          </button>
        </div>

        <Hr />

        {/* 모임 */}
        <SectionTitle title="모임" right={null} />
        <div className="px-4">
          <div className="space-y-3">
            {groups.map((g) => (
              <Link key={g.id} to={`/meeting/search/${g.id}`} className="block hover:opacity-90 transition-opacity">
                <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                  <div className="flex gap-3 p-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <div className="text-[12px] text-zinc-300">🚴</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-orange-500/90 mb-1">
                        {g.tag}
                      </div>
                      <div className="text-[14px] font-semibold text-zinc-100 line-clamp-1">
                        {g.title}
                      </div>
                      <div className="mt-1 text-[12px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {g.meta}
                      </div>
                      <div className="mt-2">
                        <Meta>{g.members}</Meta>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ChevronRight size={20} className="text-zinc-500" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button className="mt-4 w-full rounded-2xl bg-zinc-800 border border-zinc-800 px-4 py-3 text-[14px] text-zinc-200 hover:bg-zinc-900 inline-flex items-center justify-center gap-2">
            모임 더보기
            <ChevronRight size={16} className="text-zinc-400" />
          </button>
        </div>

        <div className="px-4 pt-8">
          <div className="text-[12px] text-zinc-500 leading-relaxed">
            ※ 이 화면은 당근 검색실 POM 인턴십 과제를 위해 제작된 목업입니다. 실제 당근 UI/데이터와 동일하지 않으며,
            이미지/텍스트는 더미로 구성되어 있습니다.
          </div>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none;}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}
        .line-clamp-1, .line-clamp-2{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;}
        .line-clamp-1{-webkit-line-clamp:1;}
        .line-clamp-2{-webkit-line-clamp:2;}
      `}</style>
    </div>
  );
}
