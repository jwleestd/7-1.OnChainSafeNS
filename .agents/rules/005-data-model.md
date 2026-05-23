---
description: Phase-0 Prisma data model (6 entities) and seed data specification
globs: ["prisma/**/*"]
alwaysApply: false
---
# Phase-0 Data Model (Prisma — 6종)

## Prisma 설정
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

## Entity Summary

| 엔터티 | PK | 주요 필드 | 관계 |
|---|---|---|---|
| USER | user_id (uuid) | email, email_verified, verification_code | 1→* FRAUD_REPORT, SAFE_NAME, TRANSFER_DEMO |
| SAFE_NAME | name_id (uuid) | human_name (unique), chain, wallet_address, status | owner_id → USER |
| FRAUD_ADDRESS | fraud_id (uuid) | chain, address, risk_level, report_count, source_type | — |
| FRAUD_REPORT | report_id (uuid) | reported_address, chain, description, status | reporter_id → USER |
| OPERATOR | operator_id (uuid) | name, email (unique), role | 1→* FRAUD_REPORT (reviews) |
| TRANSFER_DEMO | transfer_id (uuid) | recipient_name, resolved_address, amount, transfer_status | sender_id → USER |

## 필드 규칙
- PK: `@id @default(uuid())` — UUID v4
- DateTime: `@default(now())`
- 상태값: String (Prisma enum 사용 가능)
- JSON 데이터: PostgreSQL 네이티브 `Json` 타입

## Seed Data (30+10+5+1건)

### FRAUD_ADDRESS (30건)
- chain 분포: ethereum 15, polygon 8, bsc 4, solana 3
- risk_level 분포: critical 5, high 10, medium 10, low 5
- source_type: 전량 'seed'
- 생성: faker.finance.ethereumAddress() 27건 + 수동 3건 (SAFE_NAME 교차용)

### SAFE_NAME (10건)
- 정상 주소 7건: alice.safe, bob.safe, kim.safe 등
- 사기 교차 2건: evil.safe (critical), risky.safe (high)
- 만료 테스트 1건: expired-name.safe (status='expired')

### USER (5건)
- email_verified=true 4건, false 1건 (401 테스트)
- report_restriction 테스트 1건 (429 테스트)

### OPERATOR (1건)
- Admin 운영자

## 시드 구현 가이드
```bash
npm install -D @faker-js/faker
```
- `prisma/seed.ts`에서 faker로 FRAUD_ADDRESS 자동 생성
- 수동 3건은 SAFE_NAME의 wallet_address와 일치시켜 사기 교차 테스트 보장
