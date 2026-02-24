# Copilot / AI Agent Instructions for midproject

아래 지침은 이 저장소에서 코드를 수정·제안할 때 AI 에이전트가 즉시 생산적으로 행동할 수 있도록 요약한 실무 가이드입니다.

- **프로젝트 구조(빅픽처)**: 백엔드(Express)와 프론트엔드(Vue 3 + Argon Dashboard)가 분리된 모노레포입니다.
  - 백엔드: [backend/app.js](backend/app.js) — 진입점, 모든 라우터는 [backend/router/router.js](backend/router/router.js)에서 구성됩니다.
  - DB: [backend/database/mapper/](backend/database/mapper/) 아래에 쿼리/풀 관련 코드가 있으며 `mariadb`와 `.env`(`backend/dbConfig.env`)를 사용합니다.
  - 프론트엔드: [frontend/](frontend/) — Vue CLI 기반, Argon Dashboard 템플릿을 확장합니다. 라우터는 [frontend/src/router/index.js](frontend/src/router/index.js).

- **주요 개발 명령**
  - 백엔드 개발: `npm run dev` (백엔드 디렉터리에서 실행) — `nodemon app.js`로 서버(기본 포트 3000)를 띄웁니다. 확인 파일: [backend/package.json](backend/package.json).
  - 프론트엔드 개발: `npm run serve` (프론트엔드 디렉터리) — Vue CLI dev server.
  - 프론트엔드 빌드: `npm run build` (프론트엔드 디렉터리) — `cross-env` 설정으로 `PUBLIC_URL=/` 사용.

- **로컬 개발 팁 / 통신**
  - 로컬에서 프론트엔드가 백엔드 API에 접근할 때 Vue dev server proxy를 사용합니다. (백엔드 `app.js`에 프록시용 주석 존재 — `/api` 프록시 구성 예상). 확인: [frontend/vue.config.js](frontend/vue.config.js) (존재하면 우선 확인).
  - 백엔드 서버 기본 포트는 `3000`입니다. 프론트엔드에서 API 호출 경로를 만들 때 이 포트를 기준으로 합니다.

- **코드 패턴 / 컨벤션 (프로젝트 특이사항)**
  - 라우터 집중: 모든 라우터 엔트리는 [backend/router/router.js](backend/router/router.js)에 모여 있습니다. 라우터 추가/수정 시 해당 파일과 `backend/router/*_router.js`들을 함께 검사하세요.
  - 서비스 레이어: 백엔드는 `services/` 폴더(예: `backend/services/jh_support_service.js`)로 비즈니스 로직을 분리합니다 — 컨트롤러/라우터는 요청/응답, 서비스는 DB 처리.
  - SQL 매퍼: `backend/database/mapper/mapper.js` 및 `sqls/`에 쿼리 목록이 있습니다. SQL 수정 시 매퍼와 sql 파일을 동시에 업데이트하세요.
  - 프론트엔드 라우팅: `MainLayout` 아래에 지원자(일반 사용자) 라우트, `organmanager`는 기관 관리자 전용으로 별도 트리로 구성되어 있습니다. 새 페이지 추가 시 `frontend/src/router/index.js`의 구조를 따라 `children`로 등록하세요.
  - 커밋/브랜치 규칙: 루트 `README.md`에 정의된 Git 규칙을 따릅니다 (feature/* 브랜치, PR → develop, commit 메시지 접두사: `feat`, `fix`, `refactor`, `style`, `docs`).

- **파일/함수 예시(참고)**
  - 서버 시작: [backend/app.js](backend/app.js)
  - 라우터 트리: [frontend/src/router/index.js](frontend/src/router/index.js)
  - DB 매퍼 예: [backend/database/mapper/mapper.js](backend/database/mapper/mapper.js)

- **안전한 변경 범위 (AI 행동 제한)**
  - 데이터베이스 스키마나 중요한 SQL을 변경할 때는 반드시 변경 이유와 테스트 절차를 PR 설명에 포함하세요.
  - 프론트엔드 UI/디자인 변경은 작은 컴포넌트 단위로 제안하고 스크린샷/정적 예시를 포함하세요.

- **검토 포인트(PR 작성 시 체크리스트으로 사용 가능)**
  - 백엔드: `router.js`와 관련 `router/*_router.js`를 함께 수정했는가? 서비스 호출과 SQL 매퍼를 일치시켰는가?
  - 프론트엔드: 라우트 등록/네비게이션 가드가 올바른 레이아웃(`MainLayout` vs `OrganManager`)에 붙어 있는가?
  - 실행: `npm run dev` (backend) 및 `npm run serve` (frontend)로 최소한 수동 smoke test를 통과했는가?

피드백: 이 파일을 업데이트할 항목(예: 누락된 실행 명령, 추가된 루트 파일 링크)이 있으면 알려주세요. 추가로 `README.md`나 `vue.config.js` 등 더 자세히 참조하길 원하면 지시해 주세요.
