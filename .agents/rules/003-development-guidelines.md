---
description: Phase-0 MVP development standards and architecture guidelines
globs: ["**/*"]
alwaysApply: true
---
# Development Guidelines (Phase-0 MVP)

## Version Control
- **System:** Git
- **Repository:** GitHub
- **Branching:** Git Flow / Feature Branch Workflow
- **Commit Policy:** Atomic commits, Conventional Commits format.

## Architecture (2계층 — 바이브코딩 호환)

| 계층 | 위치 | 책임 |
|---|---|---|
| Page (RSC) | `app/**/page.tsx` | UI 렌더링, 사용자 상호작용 |
| Middleware | `middleware.ts` | Admin 경로 인증 가드 |
| Route Handler | `app/api/v1/**/route.ts` | HTTP 파싱 + 비즈니스 로직 + DB 호출 + 응답 (통합) |
| Shared Utilities | `lib/*.ts` | 이메일 발송, 입력 검증, DB 싱글턴 — 2개+ Route Handler에서 반복되는 로직만 분리 |

- Route Handler에서 직접 Prisma 호출 허용 (3계층 Service 분리 불요)
- Phase-1a 리팩터링 가이드: 100줄 초과 또는 3개+ 반복 시 `lib/services/`로 추출

## Project Structure (Phase-0)
```
next-fraud-shield/
├── app/
│   ├── (public)/fraud-lookup/page.tsx    ← 사기 조회 + 신고
│   ├── (public)/safe-name/page.tsx       ← 등록 + 리졸브 + 데모 이체
│   ├── (admin)/approval/page.tsx         ← 신고 승인 대시보드
│   ├── auth/verify/page.tsx              ← 이메일 인증
│   ├── auth/admin-login/page.tsx         ← Admin PW 로그인
│   ├── api/v1/fraud/lookup/route.ts      ← GET: 조회
│   ├── api/v1/fraud/report/route.ts      ← POST: 신고
│   ├── api/v1/resolve/route.ts           ← GET: 리졸브
│   ├── api/v1/safename/register/route.ts ← POST: 등록
│   ├── api/v1/transfer/demo/route.ts     ← POST: 데모 이체
│   ├── api/v1/admin/approve/route.ts     ← POST: 승인/거부
│   └── api/v1/auth/verify-email/route.ts ← POST: 코드 확인
├── components/ui/                        ← shadcn/ui 컴포넌트
├── lib/
│   ├── email.ts                          ← Resend 이메일 발송
│   ├── prisma.ts                         ← PrismaClient 싱글턴
│   ├── validators.ts                     ← 이름 규칙, 주소 형식 검증
│   └── constants.ts                      ← 예약어 목록, 에러 메시지
├── prisma/schema.prisma                  ← 6 모델, provider="postgresql"
├── prisma/seed.ts                        ← 시드 (30+10+5+1건, faker)
├── middleware.ts                          ← Admin 인증 가드
└── .env.local                            ← 환경변수
```

## Performance Standards (Phase-0 NFR)
- 사기 조회: p95 ≤ 2,000ms
- 리졸브: p95 ≤ 500ms
- 등록: p95 ≤ 3,000ms
- 가용성: ≥ 99.0% (월 다운타임 ≤ 7.3h)
- 월 비용: ≤ $22

## Development Priorities
1. **Accuracy:** 사기 DB 매칭·Safe-Name 리졸브 로직 정확성 최우선.
2. **Simplicity:** CRUD 중심, 2계층, 최소 의존성.
3. **User Safety:** 이메일 인증 기반 신고, Admin 인증 승인.

## See also:
- [001-project-overview.md](001-project-overview.md)
- [002-tech-stack.md](002-tech-stack.md)
