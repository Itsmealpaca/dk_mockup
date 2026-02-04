import { useParams, useNavigate } from "react-router-dom";

const MEETINGS: Record<string, { title: string; meta: string; location: string; members: number }> = {
  "3001": { title: "운동으로 친해져요!", meta: "동네 이웃들과 함께 운동하며 건강도 챙기고 친목도 다지는 모임입니다.", location: "성사2동", members: 3 },
  "3002": { title: "고양 덕양구 자전거 모임 🚴", meta: "안녕하세요 덕양구 로드 자전거 모임입니다. - 샤방벙, 일산호 등 라이딩해요.", location: "토당동", members: 40 },
  "3003": { title: "[20-30] 전기 자전거 라이딩", meta: "20대~30대만 가입 부탁드립니다. 지역 - 서울~파주.", location: "화정동", members: 1 },
  "3004": { title: "자전거 타자구요", meta: "자전거 탑시다 따릉이 뭐든 좋아요.", location: "화정1동", members: 2 },
  "3005": { title: "씽씽! 바람을 가르자", meta: "행신4동 주민 여러분, 같이 자전거 타실 분 구해요.", location: "행신4동", members: 2 },
  "3006": { title: "로드, 산악자전거 모임", meta: "목적은 오직 자신을 위한 운동입니다. 주로 로드, 산악 위주.", location: "화정1동", members: 5 },
  "3007": { title: "주말 한강 라이딩 모임", meta: "매주 토요일 오전 한강 자전거도로 모임입니다.", location: "마두동", members: 12 },
  "3008": { title: "초보자 환영 자전거 동호회", meta: "처음 자전거 타시는 분들도 환영해요.", location: "백석동", members: 8 },
};

export default function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const meeting = id ? MEETINGS[id] : null;

  if (!meeting) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center">
        <p className="text-zinc-400">모임을 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200">목록으로</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-zinc-900">
        <div className="max-w-[430px] mx-auto flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="text-zinc-300 text-[14px]">←</button>
          <span className="text-[14px] text-zinc-400">모임</span>
          <button className="text-zinc-300 text-[14px]">⋯</button>
        </div>
      </header>
      <main className="max-w-[430px] mx-auto px-4 py-6">
        <div className="flex gap-3">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[24px]">🚴</div>
          <div>
            <h1 className="text-[18px] font-semibold text-zinc-100">{meeting.title}</h1>
            <div className="mt-1 text-[12px] text-zinc-400">{meeting.location} · 👥 {meeting.members}명</div>
          </div>
        </div>
        <div className="mt-6 text-[15px] text-zinc-200 leading-relaxed">{meeting.meta}</div>
        <button className="mt-8 w-full py-3 rounded-xl bg-orange-500 text-white font-semibold">참여하기</button>
      </main>
    </div>
  );
}
