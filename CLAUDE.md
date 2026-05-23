# Project

이 문서는 Claude Code가 작업 시작 시 자동으로 로드하는 프로젝트 컨텍스트입니다.

---

## 1. Project Overview

### Vision
온체인 사기 방지 플랫폼 (On-Chain Fraud Shield Platform) — 사람이 읽을 수 있는 이름 기반 안전 거래와 실시간 사기 주소 필터링을 제공하는 플랫폼.

### Core Features (Phase-0 MVP)
- 사기 주소 조회: 주소+체인 → 사기 DB 매칭·위험 등급·건수 조회
- 사기 주소 신고: 이메일 인증 유저가 주소·피해내역 제출 → 운영자 승인
- Safe-Name 등록: 이름(.safe) + 지갑주소 + 체인 → 오프체인 등록
- Safe-Name 리졸브: 이름 → 매핑 주소 반환 + 사기 DB 교차 검증
- 운영자 승인 대시보드: 대기 신고 목록 조회·승인/거부·Email 통지
- 데모 이체 시뮬레이션: 이름+금액 → 사기 검증 → 완료/차단 → Email 통지

### Target Audience
- Primary: 일반 유저(C2) — 사기 조회, Safe-Name 등록·리졸브, 신고
- Secondary: 운영자(O1) — 신고 승인, 시스템 관리

### Project Philosophy
- Phase-0 MVP: 2~4주, 월 비용 ≤ $22
- CRUD 중심 + 2계층 아키텍처 (Route Handler → Prisma 직접)
- 바이브코딩 호환 — AI가 생성하는 코드 구조와 일치
- 시드 데이터 기반 시뮬레이션 (Mock 모듈 금지)

---

## 2. Tech Stack

### Fullstack (Next.js 단일)
- Framework: Next.js 15 App Router (TypeScript strict)
- ORM: Prisma
- Database: Supabase PostgreSQL (로컬·배포 단일)
- UI: Tailwind CSS + shadcn/ui
- Email: Resend API
- Deploy: Vercel (Git Push 자동 배포)

### Phase-0 미사용
- AI/LLM, Blockchain, KYC, OAuth2, Redis, Kafka — 모두 Phase-1+ 이후

---

## 3. Development Guidelines

### Architecture (2계층)
- Route Handler (`app/api/v1/**/route.ts`): HTTP 파싱 + 비즈니스 로직 + DB 호출 + 응답 (통합)
- Shared Utilities (`lib/*.ts`): email.ts, prisma.ts, validators.ts, constants.ts
- Phase-1a 리팩터링: 100줄 초과 또는 3개+ 반복 시 `lib/services/`로 추출

### Phase-0 설계 원칙
- P1: 항상 Simulation — `if (simulationMode)` 분기 금지
- P2: Mock 모듈 금지 — 시드 데이터(정적)로 대체
- P3: Admin PW + 이메일 인증만 — JWT/RBAC 없음
- P4: Email(Resend) 단일 알림 — Slack/KakaoTalk은 Phase-1+
- P5: CRUD 중심 — Strategy/Adapter 패턴 없음
- P6: 2계층 — Route Handler에서 직접 Prisma 호출 허용
- P7: 단일 DB — 로컬·배포 모두 Supabase PostgreSQL

### Code Comments
- 의미 있는 주석만 작성한다 (WHY 중심, WHAT는 코드로 표현).
- 사용되지 않거나 쓸모없어진 주석은 즉시 제거한다.

### Problem Solving
- 에러/예외 처리가 필요하면 7단계 구조화 진단을 수행한다.

---

## 4. 참고

- PRD: `docs/0.PRD_v1_opus46_fn.md`
- SRS: `docs/0.SRS_v1opus46_fn.md`
- 새 규칙을 추가할 때: 항상 적용은 이 파일, 도메인 지식은 서브에이전트, 절차·프로세스는 슬래시 커맨드에 작성합니다.
