import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search } from "lucide-react";

/**
 * 모임 검색 결과 페이지 - 2개 타입별
 * /meeting/1: 가장 사람이 많은 모임 / 2: 평균 연령대 65세
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

const PlaceholderImg = ({ label, className = "" }: { label: string; className?: string }) => (
  <div
    className={
      "relative overflow-hidden rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 " +
      className
    }
  >
    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_45%)]" />
    <div className="absolute inset-0 flex items-center justify-center text-[24px]">🚴</div>
    <div className="absolute bottom-2 left-2 text-[11px] text-zinc-200/80">{label}</div>
  </div>
);

const MEETINGS = [
  { id: "3001", title: "운동으로 친해져요!", meta: "동네 이웃들과 함께 운동하며 건강도 챙기고 친목도 다...", location: "성사2동", members: 5 },
  { id: "3002", title: "[7080] 고양파주 들국화🏵️", meta: "안녕하세요 이팔청춘 시니어 로드 자전거 모임입니다:)", location: "토당동", members: 30 },
  { id: "3003", title: "[20-30] 전기 자전거 라이딩", meta: "20대~30대만 가입 부탁드립니다. 지역 - 서울~파주...", location: "화정동", members: 120 },
  { id: "3004", title: "자전거 타자구요", meta: "자전거 탑시다 따릉이 뭐든 좋아요 저랑 자전거...", location: "화정1동", members: 2 },
  { id: "3005", title: "씽씽! 바람을 가르자", meta: "안녕하세요! 행신4동 주민 여러분, 같이 자전거 타실...", location: "행신4동", members: 5 },
  { id: "3006", title: "로드, 산악자전거 모임", meta: "목적은 오직 자신을 위한 운동입니다. 주로 로드, 산악...", location: "화정1동", members: 10, tag: "신규 모임" },
  { id: "3007", title: "주말 한강 라이딩 모임", meta: "매주 토요일 오전 한강 자전거도로 모임입니다.", location: "마두동", members: 12 },
  { id: "3008", title: "초보자 환영🤗 팀 둥가둥가", meta: "처음 자전거 타시는 분들도 환영해요. 같이 천천히 속도를 올려봐요!", location: "성사2동", members: 208 },
];

const PRIORITY_IDS: Record<string, string[]> = {
  "1": ["3003", "3001", "3007", "3008"],
  "2": ["3002", "3006", "3005", "3004"],
};

const CATEGORY_LABELS: Record<string, string> = {
  "1": "자전거 모임",
  "2": "자전거 모임",
};

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

export default function MeetingSearchResults() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const tabs = useMemo(() => ["전체", "중고거래", "동네생활", "스토어", "모임"], []);
  const [activeTab, setActiveTab] = useState("모임");
  const [sortBy, setSortBy] = useState<"recommended" | "popular">("recommended");
  const ageFilterLabel = categoryId === "2" ? "60대" : "모집 연령대";

  const categoryLabel = CATEGORY_LABELS[categoryId || "1"] || "자전거 모임";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [categoryId]);

  const sortedItems = useMemo(() => {
    const cid = categoryId || "1";
    const combined = [...MEETINGS];
    if (cid === "1") {
      return combined.sort((a, b) => b.members - a.members);
    }
    const priorityIds = PRIORITY_IDS[cid] || PRIORITY_IDS["2"];
    const itemsById = Object.fromEntries(MEETINGS.map((m) => [m.id, m]));
    const priority = priorityIds.map((id) => itemsById[id]).filter(Boolean);
    const rest = MEETINGS.filter((m) => !priorityIds.includes(m.id));
    const shuffledRest = shuffleWithSeed(rest, cid);
    let result = [...priority, ...shuffledRest];
    if (sortBy === "popular") {
      result = [...result].sort((a, b) => b.members - a.members);
    }
    return result;
  }, [categoryId, sortBy]);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-900">
        <div className="max-w-[430px] mx-auto">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <button onClick={() => navigate(-1)} className="text-zinc-300 text-[14px] shrink-0">←</button>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
              <Search size={16} className="text-zinc-400 shrink-0" />
              <span className="text-[14px] text-zinc-100">{categoryLabel}</span>
            </div>
            <button className="text-zinc-300 text-[14px] shrink-0">닫기</button>
          </div>
          <div className="px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {tabs.map((t) => (
                <Pill key={t} active={t === activeTab} onClick={() => setActiveTab(t)}>{t}</Pill>
              ))}
            </div>
          </div>
          <div className="px-4 pb-3 flex flex-wrap gap-2 items-center">
            <button className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-[12px] text-zinc-300">전국</button>
            <button
              className={
                "px-3 py-1.5 rounded-full border text-[12px] " +
                (categoryId === "2"
                  ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                  : "bg-zinc-800 border-zinc-700 text-zinc-300")
              }
            >
              {ageFilterLabel}
            </button>
            <button className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-[12px] text-zinc-300">카테고리</button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recommended" | "popular")}
              className="ml-auto px-2 py-1 rounded-md bg-white border border-zinc-700 text-[12px] text-zinc-900"
            >
              <option value="recommended">추천순</option>
              <option value="popular">인원순</option>
            </select>
          </div>
        </div>
      </div>

      <main className="max-w-[430px] mx-auto pb-10">
        <div className="px-4">
          {sortedItems.map((meeting, idx) => (
            <div key={meeting.id}>
              <div className="flex gap-3 py-4 items-stretch block cursor-default">
                <div className="shrink-0 w-[110px] self-stretch min-h-[96px]">
                  <PlaceholderImg label="모임" className="w-full h-full border-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-zinc-100 line-clamp-1">{meeting.title}</div>
                  <div className="mt-1 text-[12px] text-zinc-400 line-clamp-2">{meeting.meta}</div>
                  <div className="mt-2 flex items-center gap-2 text-[12px] text-zinc-500">
                    <span>{meeting.location}</span>
                    <span>·</span>
                    <span>👥 {meeting.members}</span>
                    {(meeting as any).tag && (
                      <>
                        <span>·</span>
                        <span className="text-zinc-400">{(meeting as any).tag}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  <span className="text-zinc-500">›</span>
                </div>
              </div>
              {idx < sortedItems.length - 1 && <div className="h-px bg-zinc-800/80" />}
            </div>
          ))}
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none;}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}
        .line-clamp-1,.line-clamp-2{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;}
        .line-clamp-1{-webkit-line-clamp:1;}
        .line-clamp-2{-webkit-line-clamp:2;}
      `}</style>
    </div>
  );
}
