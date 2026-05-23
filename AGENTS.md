# Project Instructions

This is the cross-tool global rules file (AGENTS.md) supported by Google Antigravity (v1.20.3+), Cursor, and Claude Code.

## Code Style

- Maintain clean, readable, and well-documented code.
- Use TypeScript strict mode. Avoid `any` type.
- Follow ESLint + Prettier conventions.

---

## 🏗️ 001. Project Overview

**Product Name:** 온체인 사기 방지 플랫폼 (On-Chain Fraud Shield Platform)

**Vision:** 수만 건의 오송금 민원과 오탐지를 해결하고, 사람이 읽을 수 있는 이름 기반 안전 거래와 실시간 사기 주소 필터링을 보장하는 온체인 사기 방지 플랫폼

**Phase-0 (Actionable MVP) Core Features:**

- P0-1: 사기 주소 조회 — 주소+체인 입력 → 사기 DB 매칭·위험 등급 조회
- P0-2: 사기 주소 신고 — 이메일 인증 유저의 주소·피해내역 제출 → 운영자 승인
- P0-3: Safe-Name 등록 — 이름(.safe) + 지갑주소 + 체인 → 오프체인 등록
- P0-4: Safe-Name 리졸브 — 이름 → 매핑 주소 반환 + 사기 DB 교차 검증
- P0-5: 운영자 승인 대시보드 — 대기 신고 목록 조회·승인/거부
- P0-6: 데모 이체 시뮬레이션 — 이름+금액 → 사기 검증 → 완료/차단 → Email 통지

**Target Audience:**

- Primary: 일반 유저(C2) — 사기 조회, Safe-Name 등록·리졸브, 신고
- Secondary: 운영자(O1) — 신고 승인, 시스템 관리

**Phase-0 Goals & Success Metrics:**

- 19개 REQ E2E 수동 테스트 100% Pass
- 월 비용 ≤ $22 (Vercel + Supabase + Resend + 도메인)
- 유저 피드백 10건+, 치명 블로커 0건
- 데모 이체 시뮬레이션 이해도 ≥ 90%

---

## 🛠️ 002. Technical Stack

**Fullstack (Next.js — 단일 풀스택 모노리스):**

- Language: TypeScript (strict mode)
- Framework: Next.js 15 App Router
- ORM: Prisma
- Database: Supabase PostgreSQL (로컬·배포 단일 환경)
- UI: Tailwind CSS + shadcn/ui
- Email: Resend API
- Deploy: Vercel (Git Push 자동 배포)

**Phase-0 미사용 (향후 Phase):**

- AI/LLM: Vercel AI SDK + Google Gemini (Phase-3)
- Blockchain: ethers.js + Solidity (Phase-2+)
- KYC: 외부 KYC Provider (Phase-2)

**Infrastructure:**

- Version Control: Git + GitHub
- CI/CD: Vercel 자동 배포 (별도 CI 설정 불요)
- Testing: Phase-0은 수동 테스트 체크리스트, Phase-1a+ Playwright E2E

---

## 📋 003. Development Guidelines

**Phase-0 설계 원칙:**

| # | 원칙 | 설명 |
|---|---|---|
| P1 | 항상 Simulation | `if (simulationMode)` 분기 금지. 모든 코드가 시뮬레이션 전제 |
| P2 | 외부 연동 최소화 | Mock 모듈 구현 금지. 시드 데이터(정적)로 대체 |
| P3 | 단일 인증 | Admin PW + 이메일 인증만. JWT/RBAC 없음 |
| P4 | 단일 알림 | Email(Resend) 단일. Slack/KakaoTalk/SMS는 Phase-1+ |
| P5 | CRUD 중심 | Strategy/Adapter 패턴 없음. 직선적 CRUD |
| P6 | 바이브코딩 호환 | Route Handler 내에서 직접 Prisma 호출 허용(2계층). 공통 로직만 `lib/` 분리 |
| P7 | 단일 DB 환경 | 로컬·배포 모두 Supabase PostgreSQL 단일 사용 |

**Architecture (2계층):**

- Route Handler (`app/api/v1/**/route.ts`) → Prisma 직접 호출
- Shared Utilities (`lib/*.ts`) → 2개+ Route Handler에서 반복되는 로직만 분리
- Phase-1a에서 100줄 초과 또는 3개+ 반복 시 `lib/services/`로 추출

**Performance Standards (Phase-0 NFR):**

- 사기 조회 응답: p95 ≤ 2,000ms
- 리졸브 응답: p95 ≤ 500ms
- 등록 응답: p95 ≤ 3,000ms
- 가용성: ≥ 99.0%

**Development Priorities:**

1. Accuracy: 사기 DB 매칭·Safe-Name 리졸브 로직 정확성 최우선.
2. Simplicity: CRUD 중심, 2계층, 최소 의존성.
3. User Safety: 이메일 인증 기반 신고, Admin 인증 승인.
