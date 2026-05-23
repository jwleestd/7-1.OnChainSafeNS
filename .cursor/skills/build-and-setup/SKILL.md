---
name: build-and-setup
description: Phase-0 MVP 프로젝트 초기 설정 절차. Next.js 생성, Prisma 설정, Supabase 연결, shadcn/ui 설치, 시드 데이터 삽입까지 전체 과정을 안내합니다.
---
# Project Build & Setup (Phase-0 MVP)

## Prerequisites
- Node.js 18+ & npm
- Supabase 프로젝트 (Free Tier)
- Resend 계정 (Free Tier)
- Vercel 계정

## Step 1: Next.js 프로젝트 생성
```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

## Step 2: 핵심 의존성 설치
```bash
npm install prisma @prisma/client resend
npm install -D @faker-js/faker
```

## Step 3: shadcn/ui 초기화 & 컴포넌트 설치
```bash
npx shadcn@latest init
npx shadcn@latest add button input card badge alert table dialog toast tabs textarea select separator navigation-menu
```

## Step 4: Prisma 초기화
```bash
npx prisma init
```
- `prisma/schema.prisma`에 Phase-0 엔터티 6종 정의
- `provider = "postgresql"`, `url = env("DATABASE_URL")`, `directUrl = env("DIRECT_URL")`

## Step 5: 환경변수 설정
`.env.local` 파일 생성:
```env
DATABASE_URL="postgresql://postgres.[ref]:[pw]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[pw]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"
RESEND_API_KEY="re_test_xxxxx"
ADMIN_PASSWORD="dev-admin-pw-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
FROM_EMAIL="noreply@fraud-shield.com"
```

## Step 6: DB 동기화 & 시드
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

## Step 7: 개발 서버 실행
```bash
npm run dev
```
→ http://localhost:3000 접속 확인

## Step 8: 프로젝트 구조 검증
```
app/(public)/fraud-lookup/page.tsx    ← 사기 조회 + 신고
app/(public)/safe-name/page.tsx       ← 등록 + 리졸브 + 데모 이체
app/(admin)/approval/page.tsx         ← 신고 승인 대시보드
app/api/v1/                           ← 7개 Route Handlers
lib/                                  ← email.ts, prisma.ts, validators.ts, constants.ts
prisma/schema.prisma                  ← 6 모델
```
