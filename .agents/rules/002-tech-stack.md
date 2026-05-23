---
description: Phase-0 MVP technical stack — Next.js fullstack monolith
alwaysApply: true
---
# Technical Stack (Phase-0 MVP)

## Fullstack (Next.js 단일 풀스택 모노리스)
- Language: TypeScript (strict mode)
- Framework: Next.js 15 App Router
- ORM: Prisma
- Database: Supabase PostgreSQL (로컬·배포 단일 환경. Free Tier 500MB)
- UI: Tailwind CSS + shadcn/ui
- Email: Resend API (Free: 100통/일, 3,000통/월)
- Deploy: Vercel (Git Push 자동 배포, CI/CD 설정 불요)
- Testing: Phase-0 수동 테스트 체크리스트. Phase-1a+ Playwright E2E

## Phase-0 미사용 (향후 Phase)
- AI/LLM: Vercel AI SDK + Google Gemini (Phase-3)
- Blockchain: ethers.js + Solidity + Hardhat (Phase-2+)
- External Sources: Etherscan Labels, MistTrack, OFAC SDN (Phase-1b)
- KYC: 외부 KYC Provider (Phase-2)
- Notification: Slack(Phase-1a), KakaoTalk(Phase-1b), SMS(Phase-1b)
- Monitoring: PagerDuty (Phase-1b)
- RPC: Alchemy (Phase-2)

## Phase-0 명시적 배제
- Java, Spring Boot, Python, FastAPI — 사용하지 않음
- MySQL, SQLite — 사용하지 않음 (PostgreSQL 단일)
- Docker, Redis, Kafka — 사용하지 않음
- OAuth2, JWT, RBAC — 사용하지 않음
- Micro-Service Architecture — 사용하지 않음

## See also:
- [003-development-guidelines.md](003-development-guidelines.md) for usage guidelines
