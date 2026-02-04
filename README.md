# 당근 자전거 검색 UI 목업 (dk_mockup)

당근 검색실 POM 인턴십 과제를 위해 제작된 **'자전거' 검색 결과** 화면 목업입니다.  
실제 당근 UI/데이터와 동일하지 않으며, 이미지/텍스트는 더미로 구성되어 있습니다.

## 기술 스택

- **React 19** + **TypeScript**
- **Vite** (빌드 도구)
- **Tailwind CSS** (스타일링)
- **React Router DOM** (라우팅)
- **Lucide React** (아이콘)

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173/dk_mockup/)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

> ⚠️ Base path가 `/dk_mockup/`로 설정되어 있어, 접속 시 `http://localhost:5173/dk_mockup/` 로 접속해야 합니다.

## 프로젝트 구조

```
src/
├── App.tsx                 # 메인 페이지 (탭, 트렌드, 광고, 중고거래, 동네생활, 모임)
├── SearchResults.tsx       # 중고거래 검색 결과
├── ProductDetail.tsx       # 중고상품 상세
├── NeighborhoodSearchResults.tsx  # 동네생활 검색 결과
├── NeighborhoodPostDetail.tsx     # 동네생활 글 상세
├── MeetingSearchResults.tsx       # 모임 검색 결과
├── MeetingDetail.tsx       # 모임 상세 (진입 비활성화)
├── components/
│   └── ProductImage.tsx    # 상품 이미지 컴포넌트 (placeholder/실제 이미지)
├── data/
│   ├── productImages.ts    # 상품 ID별 이미지 매핑
│   └── images/             # 상품 이미지 파일 (bike-1.png ~ bike-13.png)
└── main.tsx
```

## 주요 기능

### 메인 페이지 (`/`)

- **탭**: 전체, 중고거래, 동네생활, 스토어, 모임
- **트렌드 캐러셀**: 해시태그 카드 (3초마다 자동 전환, 클릭 시 해당 검색/모임 페이지로 이동)
- **광고 카드**: 비아지오 전기자전거 인수형렌탈
- **중고거래**: 4개 대표 상품 → 각각 `/search/1` ~ `/search/4` 검색 결과로 연결
- **스토어**: 광고 상품 가로 스크롤
- **동네생활**: 4개 대표 글 → `/neighborhood/1` ~ `/neighborhood/4` 검색 결과로 연결
- **모임**: 2개 모임 카드 → `/meeting/search/1`, `/meeting/search/2` 검색 결과로 연결

### 중고거래

| 경로 | 설명 |
|------|------|
| `/search/1` | 픽시 자전거 (상품 1,2,3 우선) |
| `/search/2` | 자전거 (10만원 이하 태그 활성화, 상품 4~7 우선) |
| `/search/3` | 미니벨로 자전거 (상품 8~10 우선) |
| `/search/4` | 자전거 용품 (상품 11~13 우선) |
| `/product/:id` | 상품 상세 (id: 1~13) |

### 동네생활

| 경로 | 설명 |
|------|------|
| `/neighborhood/1` | 자전거 사건·사고 SOS |
| `/neighborhood/2` | 동네 코스 질문 |
| `/neighborhood/3` | 자전거 구매·수리 고민 |
| `/neighborhood/4` | 같이 탈 이웃 구해요 |
| `/neighborhood/post/:id` | 동네생활 글 상세 |

### 모임

| 경로 | 설명 |
|------|------|
| `/meeting/search/1` | 가장 사람이 많은 모임 (인원순 정렬) |
| `/meeting/search/2` | 평균 연령대 65세 (60대 필터 표시) |
| `/meeting/detail/:id` | 모임 상세 (**검색 결과에서 진입 비활성화**, URL 직접 접근 시에만 표시) |

## 상품 이미지

- **위치**: `src/data/images/` (bike-1.png ~ bike-13.png)
- **매핑**: `src/data/productImages.ts`의 `IMAGE_BY_ID`에서 상품 ID ↔ 파일명 연결
- **지원 형식**: jpg, png, webp, gif
- **적용 범위**: 메인 중고거래, 검색 결과, 상품 상세

이미지 추가 시:

1. `src/data/images/`에 파일 추가
2. `productImages.ts`에 `"상품ID": "파일명"` 등록
3. 개발 서버 재시작 (import.meta.glob 반영)

## 배포

```bash
npm run build
npm run deploy   # gh-pages로 dist 배포
```

## 라이선스

Private
