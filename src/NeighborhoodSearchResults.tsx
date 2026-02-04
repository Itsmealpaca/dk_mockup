import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Search, Bell } from "lucide-react";

/**
 * 동네생활 검색 결과 페이지 - 4개 테마별
 * /neighborhood/1: 사건·사고 SOS / 2: 동네 코스 질문 / 3: 구매·수리 고민 / 4: 같이 탈 이웃 구해요
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

// 동네생활 더미 데이터 (dk_mockup/동네생활 더미 참고)
const NEIGHBORHOOD_POSTS = [
  // 1. 자전거 사건·사고 SOS (2001~2008)
  { id: "2001", title: "자전거 잠깐 세워놨는데 도난당했어요", location: "마두동", time: "5일 전", views: 202, comments: 12, snippet: "저번주 공원에서 잠깐 세워놨는데 돌아오니까 없어졌어요...", tag: "자전거 사건·사고 SOS" },
  { id: "2002", title: "공원에서 자전거 긁힘 사고… 연락 받으신 분 있나요?", location: "주엽동", time: "1주 전", views: 134, comments: 5, snippet: "어제 오후에 공원 주차장에서 자전거 옆면이 긁힌 채로...", tag: "자전거 사건·사고 SOS" },
  { id: "2003", title: "픽시 자전거 주행 중 넘어졌는데 병원 가야 할까요?", location: "백석동", time: "2일 전", views: 89, comments: 4, snippet: "브레이크가 없어서 발로 밟다가 넘어졌는데 다리 찢어졌어요.", tag: "자전거 사건·사고 SOS" },
  { id: "2004", title: "자전거 사고 후 상대방이 연락을 안 줍니다", location: "대화동", time: "3일 전", views: 156, comments: 9, snippet: "교차로에서 부딪혔는데 상대분이 번호 남기고 가더니 연락이...", tag: "자전거 사건·사고 SOS" },
  { id: "2005", title: "밤에 자전거 타다 차랑 거의 부딪힐 뻔했어요", location: "화정동", time: "4일 전", views: 98, comments: 6, snippet: "좁은 골목에서 안개 낀 날 야간 주행 중이었는데...", tag: "자전거 사건·사고 SOS" },
  { id: "2006", title: "자전거 도난 신고 해보신 분 계신가요?", location: "행신동", time: "1주 전", views: 177, comments: 11, snippet: "어제 밤에 현관 앞에서 도난당했는데 신고 절차를 알고 싶어요.", tag: "자전거 사건·사고 SOS" },
  { id: "2007", title: "자전거 자물쇠 잘리는 경우 많나요?", location: "탄현동", time: "6일 전", views: 121, comments: 7, snippet: "U자락으로 잠궜는데 하루만에 잘려있더라구요.", tag: "자전거 사건·사고 SOS" },
  { id: "2008", title: "중고로 산 자전거가 도난품일 수도 있을까요", location: "정발산동", time: "1주 전", views: 83, comments: 3, snippet: "당근에서 산 건데 시리얼 넘버 확인하는 방법이 있을까요?", tag: "자전거 사건·사고 SOS" },
  // 2. 동네 코스 질문 (2101~2108)
  { id: "2101", title: "일산에서 자전거 타기 괜찮은 코스 있을까요?", location: "백석동", time: "12일 전", views: 20, comments: 2, snippet: "요즘 운동 겸 자전거를 타보려고 하는데 차 많지 않은 코스요.", tag: "동네 코스 질문" },
  { id: "2102", title: "초보자도 탈 수 있는 평지 코스 추천 부탁드려요", location: "마두동", time: "8일 전", views: 34, comments: 4, snippet: "자전거 막 배운 동생이랑 같이 탈 수 있는 곳 알려주세요.", tag: "동네 코스 질문" },
  { id: "2103", title: "한강 말고 동네에서 가볍게 탈 곳 있나요?", location: "주엽동", time: "6일 전", views: 41, comments: 3, snippet: "한강은 멀어서요. 동네에서 30분~1시간 정도 루프 코스 있나요?", tag: "동네 코스 질문" },
  { id: "2104", title: "야간에 자전거 타기 안전한 코스 있을까요", location: "화정동", time: "10일 전", views: 29, comments: 1, snippet: "퇴근 후 밤 9시쯤 타는데 불빛 잘 나오는 코스요.", tag: "동네 코스 질문" },
  { id: "2105", title: "미니벨로 타기 좋은 동네 코스 추천", location: "대화동", time: "2주 전", views: 18, comments: 1, snippet: "미니벨로로 출퇴근 연습하려는데 오르막 적은 곳이요.", tag: "동네 코스 질문" },
  { id: "2106", title: "출퇴근용 자전거 루트로 괜찮은 길 있나요?", location: "행신동", time: "9일 전", views: 26, comments: 2, snippet: "행신역에서 일산까지 자전거로 출퇴근 가능한가요?", tag: "동네 코스 질문" },
  { id: "2107", title: "주말에 사람 적은 라이딩 코스 추천해주세요", location: "탄현동", time: "2주 전", views: 37, comments: 5, snippet: "주말 오전에 한적하게 타고 싶은데요.", tag: "동네 코스 질문" },
  { id: "2108", title: "아이랑 같이 자전거 탈 수 있는 곳 있을까요?", location: "정발산동", time: "3주 전", views: 44, comments: 6, snippet: "초등학생 아이랑 같이 탈 수 있는 안전한 코스요.", tag: "동네 코스 질문" },
  // 3. 자전거 구매·수리 고민 (2201~2208)
  { id: "2201", title: "픽시 자전거 브레이크 수리 어디서 하나요?", location: "주엽동", time: "1개월 전", views: 47, comments: 1, snippet: "중고로 산 픽시인데 브레이크가 너무 밀려요.", tag: "자전거 구매·수리 고민" },
  { id: "2202", title: "중고 자전거 살 때 꼭 봐야 할 포인트가 뭘까요?", location: "마두동", time: "3주 전", views: 63, comments: 4, snippet: "처음 중고 자전거 구매하는데 체크리스트 알려주세요.", tag: "자전거 구매·수리 고민" },
  { id: "2203", title: "10만원대 자전거로 출퇴근 가능할까요?", location: "식사동", time: "2주 전", views: 52, comments: 3, snippet: "5km 정도인데 10만원 이하로 살 수 있을까요?", tag: "자전거 구매·수리 고민" },
  { id: "2204", title: "미니벨로랑 하이브리드 중에 고민 중입니다", location: "백석동", time: "1주 전", views: 71, comments: 5, snippet: "출퇴근+주말 라이딩 겸용으로 뭐가 나을까요?", tag: "자전거 구매·수리 고민" },
  { id: "2205", title: "자전거 체인 소리 나는데 교체해야 하나요?", location: "대화동", time: "10일 전", views: 39, comments: 2, snippet: "찰칵찰칵 소리가 나는데 오일만 발라도 될까요?", tag: "자전거 구매·수리 고민" },
  { id: "2206", title: "픽시 자전거 초보가 타기 너무 위험할까요?", location: "화정동", time: "2주 전", views: 84, comments: 6, snippet: "브레이크가 없다고 들었는데 입문용으로 괜찮을까요?", tag: "자전거 구매·수리 고민" },
  { id: "2207", title: "중고 자전거 가격 적정선이 어느 정도인가요", location: "행신동", time: "3주 전", views: 58, comments: 3, snippet: "삼천리 26인치 3년차인데 얼마에 파는 게 적정인가요?", tag: "자전거 구매·수리 고민" },
  { id: "2208", title: "자전거 정비 혼자 해도 될까요?", location: "탄현동", time: "1개월 전", views: 46, comments: 2, snippet: "체인 청소, 브레이크 조정 같은 거 유튜브 보고 해도 될까요?", tag: "자전거 구매·수리 고민" },
  // 4. 같이 탈 이웃 구해요 (2301~2308)
  { id: "2301", title: "주말 아침에 가볍게 자전거 타실 분 계신가요?", location: "화정동", time: "3일 전", views: 53, comments: 4, snippet: "혼자 타다 보니 심심해서요. 한강이나 공원 한 바퀴 같이요.", tag: "같이 탈 이웃 구해요" },
  { id: "2302", title: "출퇴근 같이 타실 분 구해요", location: "마두동", time: "5일 전", views: 31, comments: 2, snippet: "행신→김포 방향 출퇴근하는 분 있으시면 같이 타요.", tag: "같이 탈 이웃 구해요" },
  { id: "2303", title: "초보자 같이 연습해요", location: "백석동", time: "1주 전", views: 67, comments: 8, snippet: "저도 막 배워서 같이 천천히 연습하실 분 구해요.", tag: "같이 탈 이웃 구해요" },
  { id: "2304", title: "밤에 야간 라이딩 하실 분", location: "주엽동", time: "2일 전", views: 28, comments: 1, snippet: "퇴근 후 8시쯤 1시간 정도 타실 분.", tag: "같이 탈 이웃 구해요" },
  { id: "2305", title: "로드바이크 타시는 분 같이 한강 가요", location: "대화동", time: "4일 전", views: 45, comments: 3, snippet: "이번 주말 오전에 한강 남 cycle 돌이 코스요.", tag: "같이 탈 이웃 구해요" },
  { id: "2306", title: "미니벨로 동호회 모집해요", location: "행신동", time: "1주 전", views: 39, comments: 5, snippet: "미니벨로 타시는 분들 모여서 가끔 같이 타요.", tag: "같이 탈 이웃 구해요" },
  { id: "2307", title: "아이 동반 가족 라이딩 같이 가요", location: "탄현동", time: "3일 전", views: 22, comments: 2, snippet: "초등생 아이랑 같이 타실 가족 분 구해요.", tag: "같이 탈 이웃 구해요" },
  { id: "2308", title: "일산 호수공원 루프 같이 타요", location: "정발산동", time: "6일 전", views: 41, comments: 4, snippet: "일산호 한 바퀴 1시간 정도. 느긋하게 타실 분.", tag: "같이 탈 이웃 구해요" },
];

// 페이지별 상단 우선 IDs: 1=2001~2003, 2=2101~2104, 3=2201~2203, 4=2301~2303
const PRIORITY_IDS: Record<string, string[]> = {
  "1": ["2001", "2002", "2003"],
  "2": ["2101", "2102", "2103", "2104"],
  "3": ["2201", "2202", "2203"],
  "4": ["2301", "2302", "2303"],
};

const CATEGORY_LABELS: Record<string, string> = {
  "1": "자전거 사건·사고 SOS",
  "2": "동네 코스 질문",
  "3": "자전거 구매·수리 고민",
  "4": "같이 탈 이웃 구해요",
};

function getSearchQuery(tag: string): string {
  return tag.includes("자전거") ? tag : `자전거 ${tag}`;
}

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

export default function NeighborhoodSearchResults() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const tabs = useMemo(
    () => ["전체", "중고거래", "동네생활", "스토어", "모임"],
    []
  );
  const [activeTab, setActiveTab] = useState("동네생활");
  const [sortBy, setSortBy] = useState<"recommended" | "latest" | "popular">("recommended");

  const categoryLabel = CATEGORY_LABELS[categoryId || "1"] || "동네생활";
  const searchQuery = getSearchQuery(categoryLabel);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [categoryId]);

  const posts = useMemo(() => {
    const rangeMap: Record<string, string[]> = {
      "1": ["2001","2002","2003","2004","2005","2006","2007","2008"],
      "2": ["2101","2102","2103","2104","2105","2106","2107","2108"],
      "3": ["2201","2202","2203","2204","2205","2206","2207","2208"],
      "4": ["2301","2302","2303","2304","2305","2306","2307","2308"],
    };
    const ids = rangeMap[categoryId || "1"] || rangeMap["1"];
    return NEIGHBORHOOD_POSTS.filter((p) => ids.includes(p.id));
  }, [categoryId]);

  const sortedItems = useMemo(() => {
    const priorityIds = PRIORITY_IDS[categoryId || "1"] || PRIORITY_IDS["1"];
    const itemsById = Object.fromEntries(posts.map((p) => [p.id, p]));
    const priority = priorityIds.map((id) => itemsById[id]).filter(Boolean);
    const rest = posts.filter((p) => !priorityIds.includes(p.id));
    const shuffledRest = shuffleWithSeed(rest, categoryId || "1");
    const combined = [...priority, ...shuffledRest];
    if (sortBy === "popular") {
      return [...combined].sort((a, b) => (b.views + b.comments) - (a.views + a.comments));
    }
    return combined;
  }, [posts, categoryId, sortBy]);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-900">
        <div className="max-w-[430px] mx-auto">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <button onClick={() => navigate(-1)} className="text-zinc-300 text-[14px] shrink-0">←</button>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
              <Search size={16} className="text-zinc-400 shrink-0" />
              <span className="text-[14px] text-zinc-100">{searchQuery}</span>
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
            <button className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-[12px] text-zinc-300">화정동 근처</button>
            <button className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-[12px] text-zinc-300">서초2동 근처</button>
            <button className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-[12px] text-zinc-300">2km 이내</button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recommended" | "latest" | "popular")}
              className="ml-auto px-2 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-[12px] text-zinc-300"
            >
              <option value="recommended">추천순</option>
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
          </div>
        </div>
      </div>

      <main className="max-w-[430px] mx-auto pb-10">
        <div className="px-4">
          {sortedItems.map((post, idx) => (
            <div key={post.id}>
              <Link
                to={`/neighborhood/post/${post.id}`}
                className="flex gap-3 py-4 items-stretch hover:opacity-90 transition-opacity block"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-zinc-100 line-clamp-1">{post.title}</div>
                  <div className="mt-1 text-[12px] text-zinc-400 line-clamp-2">{post.snippet}</div>
                  <div className="mt-2 flex items-center justify-between text-[12px] text-zinc-500">
                    <span>{post.location} · {post.time} · 조회 {post.views}</span>
                    {post.comments > 0 && <span>💬 {post.comments}</span>}
                  </div>
                </div>
                {idx === 0 && (
                  <div className="w-[76px] h-[76px] shrink-0 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-500">썸네일</div>
                )}
              </Link>
              {idx < sortedItems.length - 1 && <div className="h-px bg-zinc-800/80" />}
            </div>
          ))}
        </div>
        <div className="mx-4 mt-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-zinc-400" />
            <span className="text-[14px] font-medium text-zinc-200">{searchQuery} 알림 받기</span>
          </div>
          <button className="text-[13px] text-orange-500 font-medium">설정</button>
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
