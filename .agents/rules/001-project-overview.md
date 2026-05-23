---
description: On-Chain Fraud Shield Platform — Phase-0 MVP project overview
globs: ["**/*"]
alwaysApply: true
---
# PROJECT OVERVIEW: On-Chain Fraud Shield Platform

## Vision
수만 건의 오송금 민원과 오탐지를 해결하고, 사람이 읽을 수 있는 이름 기반 안전 거래와 실시간 사기 주소 필터링을 보장하는 온체인 사기 방지 플랫폼.

## Core Features (Phase-0 MVP — 7건 19 REQ)
- P0-1: 사기 주소 조회 — 주소+체인 입력 → 사기 DB 매칭·위험 등급·건수 조회
- P0-2: 사기 주소 신고 — 이메일 인증 유저의 주소·피해내역 제출 → 접수 ID 반환
- P0-3: Safe-Name 등록 — 이름(.safe) + 지갑주소 + 체인 → 오프체인 등록
- P0-4: Safe-Name 리졸브 — 이름 → 매핑 주소 반환 + 사기 DB 교차 검증
- P0-5: 운영자 승인 대시보드 — 대기 신고 목록 조회·승인/거부·Email 통지
- P0-6: 데모 이체 시뮬레이션 — 이름+금액 → 사기 검증 → 완료/차단 → Email 통지
- P0-F6: 이메일 인증 — 6자리 코드 발송, 10분 유효

## Target Audience
- Primary: 일반 유저(C2) — 사기 조회, Safe-Name 등록·리졸브, 신고
- Secondary: 운영자(O1) — 신고 승인, 시스템 관리

## Phase-0 Goals
- 19개 REQ 수동 테스트 100% Pass
- 월 비용 ≤ $22 (Vercel + Supabase + Resend + 도메인)
- 유저 피드백 10건+, 치명 블로커 0건

## Success Metrics
- 데모 이체 시뮬레이션 이해도 ≥ 90%, 가치 인식 ≥ 4.0/5
- Safe-Name 등록 유저 리졸브 사용률 ≥ 50%
- 주간 신고 ≥ 20건, 승인율 ≥ 60%

## Phase-0 설계 원칙
- P1: 항상 Simulation — `if (simulationMode)` 분기 금지
- P2: Mock 모듈 금지 — 시드 데이터(정적)로 대체
- P3: Admin PW + 이메일 인증만 — JWT/RBAC 없음
- P4: Email(Resend) 단일 알림
- P5: CRUD 중심 — Strategy/Adapter 패턴 없음
- P6: 바이브코딩 호환 — Route Handler 내 직접 Prisma 호출(2계층)
- P7: 단일 DB — 로컬·배포 모두 Supabase PostgreSQL

## See also:
- [002-tech-stack.md](002-tech-stack.md) for implementation details
- [003-development-guidelines.md](003-development-guidelines.md) for development standards
- [004-phase0-constraints.md](004-phase0-constraints.md) for Phase-0 constraints
- [005-data-model.md](005-data-model.md) for data model
