---
name: error-fixing
description: Next.js + Prisma + Supabase 환경에서의 에러 진단 및 수정 절차. 빌드 에러, 런타임 에러, DB 에러를 체계적으로 해결합니다.
---
# Error Fixing Process (Phase-0 MVP)

## 7단계 구조화 진단

### Step 1: 에러 현상 파악
- 에러 메시지 전문을 정확히 읽는다.
- 에러 유형을 분류한다: Build / Runtime / DB / Network / Type

### Step 2: 컨텍스트 수집
- 에러가 발생한 파일과 라인 번호를 확인한다.
- 관련된 Route Handler, lib/ 유틸리티, Prisma 모델을 확인한다.

### Step 3: 에러 유형별 점검

#### Build Error (TypeScript / Next.js)
- `tsconfig.json` strict mode 설정 확인
- import 경로 (`@/` alias) 확인
- `next.config.ts` 설정 확인

#### Runtime Error (API Route)
- `NextRequest` / `NextResponse` 올바른 import 확인
- Prisma Client 싱글턴 (`lib/prisma.ts`) 사용 확인
- 비동기 처리 (`await`) 누락 확인

#### Database Error (Prisma / Supabase)
- `DATABASE_URL`, `DIRECT_URL` 환경변수 확인
- `npx prisma generate` 실행 여부 확인
- `npx prisma db push` 스키마 동기화 확인
- Supabase 대시보드에서 연결 상태 확인

#### Email Error (Resend)
- `RESEND_API_KEY` 환경변수 확인
- `FROM_EMAIL` 도메인 인증 상태 확인
- Resend 일일 한도 (100통/일) 확인

### Step 4: 가설 수립
- 가능한 원인을 2~3개 나열한다.
- 가장 가능성 높은 가설부터 검증한다.

### Step 5: 최소 범위 수정
- 한 번에 하나의 변경만 적용한다.
- 변경 전후 상태를 비교할 수 있도록 한다.

### Step 6: 검증
- `npm run dev`로 빌드 에러 확인.
- 해당 API 엔드포인트를 직접 호출하여 응답 확인.
- Prisma Studio (`npx prisma studio`)로 DB 상태 확인.

### Step 7: 근본 원인 기록
- 에러의 근본 원인을 한 줄로 요약한다.
- 재발 방지를 위해 필요 시 validators.ts 또는 constants.ts에 검증 로직 추가.
