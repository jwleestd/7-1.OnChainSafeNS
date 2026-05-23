---
description: Phase-0 specific constraints and policies (C-P0-001~009)
globs: ["**/*"]
alwaysApply: true
---
# Phase-0 Constraints (즉시 구현 제약)

## 정책 제약 (C-P0)

| ID | 제약 | 설명 |
|---|---|---|
| C-P0-001 | 항상 Simulation | `if (simulationMode)` 분기 금지. 모든 코드가 시뮬레이션 전제 |
| C-P0-002 | Mock 모듈 금지 | 시드 데이터만 사용. Mock 서비스/모듈 구현하지 않음 |
| C-P0-003 | Admin PW + 이메일 인증만 | JWT, RBAC, OAuth2 구현하지 않음 |
| C-P0-004 | Email 단일 채널 | Resend Free (100통/일). 한도 초과 시 Pro 업그레이드 |
| C-P0-005 | KYC = 이메일 인증 | 외부 KYC Provider 사용하지 않음 |
| C-P0-006 | 블록체인 미연동 | ethers.js 미사용. 온체인 이체 없음 |
| C-P0-007 | Rate Limit 생략 | Vercel 내장 DDoS 보호에 위임. Phase-1a에서 도입 |
| C-P0-008 | Playwright 생략 | 수동 테스트 체크리스트로 대체. Phase-1a에서 Playwright 도입 |
| C-P0-009 | 2계층 아키텍처 | Route Handler에서 직접 Prisma 호출. Service 분리 강제 없음 |

## 기술 스택 제약 (C-TEC)

| ID | 제약 | 비고 |
|---|---|---|
| C-TEC-001 | Next.js App Router 단일 풀스택 | — |
| C-TEC-002 | Route Handlers만 사용 | Server Actions Phase-0 미사용 |
| C-TEC-003 | Supabase PostgreSQL 단일 | 로컬·배포 모두 원격 DB |
| C-TEC-004 | Tailwind CSS + shadcn/ui | — |
| C-TEC-007 | Vercel 배포 | Git Push 자동 배포 |

## Phase-0 환경변수

| 변수명 | 용도 |
|---|---|
| `DATABASE_URL` | Prisma DB 연결 (Supabase Pooler) |
| `DIRECT_URL` | Prisma 직접 연결 (마이그레이션용) |
| `RESEND_API_KEY` | Resend Email API 키 |
| `ADMIN_PASSWORD` | Admin 인증 비밀번호 |
| `NEXT_PUBLIC_APP_URL` | 프론트엔드 기본 URL |
| `FROM_EMAIL` | 발신 이메일 주소 |

## 보안 주의사항
- `NEXT_PUBLIC_` 접두사 없는 변수는 클라이언트 미노출
- `ADMIN_PASSWORD`, API Key는 절대 `NEXT_PUBLIC_` 금지
- `.env.local`은 `.gitignore`에 포함. `.env.example`만 커밋
