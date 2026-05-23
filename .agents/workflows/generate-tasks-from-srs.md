---
name: generate-tasks-from-srs
description: SRS(소프트웨어 요구사항 명세서)를 기반으로 개발 Task를 추출하고 이슈 템플릿을 생성하는 워크플로우
---

## 📝 개발 Task에 대한 간결한 Issue 템플릿 구조

```markdown
### Summary
- 기능명: [REQ-P0-001 사기 주소 조회]

### Description
- SRS 참조: docs/0.SRS_v1opus46_fn.md §4.1
- 시퀀스: docs/0.SRS_v1opus46_fn.md §3.6
- 데이터모델: docs/0.SRS_v1opus46_fn.md §6.2

### Acceptance Criteria (GWT)
- Given: 사기 DB에 등록된 주소 입력
- When: GET /api/v1/fraud/lookup 호출
- Then: risk_level, report_count 포함 응답 반환

### Non-Functional Constraints
- 응답시간 p95 ≤ 2,000ms
- 가용성 ≥ 99.0%

### Labels
- `feature`, `phase-0`, `priority:must`
```

## 📌 SRS → 개발 Task 체크리스트

| 단계 | 해야 할 일 | 결과물 |
| --- | --- | --- |
| 1 | 모든 요구사항 ID 정리 | REQ 리스트 |
| 2 | 각 요구사항을 입력/처리/출력/예외로 분해 | Task Tree (태스크 간의 선-후행, 참조 관계 등) |
| 3 | 각 요구사항의 AC를 DoD(Definition of Done)로 변환 | Task 완료 조건 |
| 4 | API 엔드포인트 기준으로 구현 단위 분해 | Route Handler / validators / email 템플릿 |
| 5 | 데이터 모델을 Prisma 스키마로 변환 | schema.prisma / seed.ts |
| 6 | NFR을 테스트·운영 Task로 변환 | 수동 테스트 체크리스트 / 성능 측정 |

---

## 📘 **SRS → 개발 Task 추출의 핵심 원리 3가지**

### **1) SRS의 구조가 Task의 구조**

- Functional → **모듈 개발 Task**
- Non-Functional → **성능 측정·테스트 Task**
- Interface(Endpoints) → **Route Handler / 입력검증 / 에러응답 Task**
- Data Model → **Prisma Schema / Migration / Seed Task**

### **2) SRS 요구사항 1개는 개발 Task 여러 개가 될 수 있음**

SRS는 "테스트 가능하고 모호하지 않은 요구사항" 단위,
개발 Task는 "구현 단위(코드·설정·테스트)"로 쪼개야 함.

> ex) REQ-P0-016 (데모 이체) 하나에서
>     → Route Handler, 리졸브 로직, 사기검증 로직, Email 발송, UI 페이지, 수동 테스트로 분해

### **3) Acceptance Criteria(AC)는 Task의 "완료 조건(Definition of Done)"**

AC 각 항목이 **별도의 개발 작업** 또는 **테스트 작업**으로 분리되어야 함.

---

## 🧩 **SRS → 개발 Task 추출 절차(6단계)**

### **1단계. SRS의 REQ 목록을 수집**

Phase-0 대상: `docs/0.SRS_v1opus46_fn.md` §4.1

| Requirement ID | Title | Type |
| --- | --- | --- |
| REQ-P0-001~002 | 사기 주소 조회 | Functional |
| REQ-P0-003~005 | 사기 주소 신고 | Functional |
| REQ-P0-006~007 | Safe-Name 등록 | Functional |
| REQ-P0-008~010 | Safe-Name 리졸브 | Functional |
| REQ-P0-011~013 | 운영자 승인 | Functional |
| REQ-P0-014~015 | 이메일 인증 | Functional |
| REQ-P0-016~019 | 데모 이체 시뮬레이션 | Functional |
| REQ-P0-NF-001~010 | Phase-0 NFR | Non-Functional |

### **2단계. 각 REQ의 "행위(Behavior)"를 기준으로 Sub-Task를 분해**

분해 원칙(항목):
- 입력(Input) — Request 파라미터/Body 정의
- 처리(Process) — 비즈니스 로직 (Prisma 직접 호출)
- 출력(Output) — Response 포맷 (success/error)
- 예외(Exception) — 에러 코드 및 한국어 메시지
- 테스트(Test) — §6.9 수동 테스트 체크리스트 해당 항목

예시) REQ-P0-016~019: "데모 이체 시뮬레이션" 분해:

| Sub-Task | 설명 |
| --- | --- |
| Route Handler 구현 | `app/api/v1/transfer/demo/route.ts` |
| 리졸브 로직 | recipient_name → SAFE_NAME 조회 |
| 사기검증 로직 | resolved_address → FRAUD_ADDRESS 교차 |
| DB 저장 | TRANSFER_DEMO 레코드 생성 |
| Email 발송 | 완료/차단 결과 통지 (Resend) |
| UI 페이지 | `app/(public)/safe-name/page.tsx` 이체 탭 |
| 수동 테스트 | §6.9 #17~19 Pass |

### **3단계. AC를 Task의 완료 조건으로 변환**

```markdown
Task: 데모 이체 Route Handler (DoD):
- [ ] 정상 이체: kim.safe + 0.5 → 완료 + Email 발송
- [ ] 사기 차단: evil.safe → 차단 + Email 발송
- [ ] 미등록 이름: unknown.safe → name_not_found
- [ ] 미인증 유저: 401 Unauthorized
```

### **4단계. API 엔드포인트 → 구현 Task로 변환**

SRS §6.1 Phase-0 API 7개:

| Task | Phase-0 구현 |
| --- | --- |
| Route Handler 구현 | `app/api/v1/**/route.ts` (GET/POST) |
| 입력 검증 | `lib/validators.ts` |
| 에러 응답 | NextResponse.json() + 에러 코드 표준 |
| Email 발송 | `lib/email.ts` (Resend) |
| UI 페이지 | `app/(public|admin)/**/page.tsx` |
| 수동 테스트 | §6.9 체크리스트 해당 항목 |

### **5단계. 데이터 모델 → Prisma 스키마로 변환**

SRS §6.2 Phase-0 엔터티 6종:
- `prisma/schema.prisma` — 6 모델 정의
- `prisma/seed.ts` — 30+10+5+1건 시드 (faker 활용)
- `npx prisma db push` — Supabase 동기화
- `npx prisma generate` — Client 재생성

### **6단계. NFR을 테스트·운영 Task로 변환**

```markdown
Phase-0 검증 Task:
- 수동 테스트 체크리스트 (§6.9) 19개 시나리오 전체 Pass
- p95 응답 시간 측정 (사기 조회 ≤ 2,000ms, 리졸브 ≤ 500ms)
- 월 비용 확인 (≤ $22)
- 유저 피드백 10건+ 수집
```

---

### 📦 각 단계별 결과물 추출 경로

| 단계 | 추출 산출물 | 경로 |
| ---- | ---- | ---- |
| 1단계 | 요구사항 목록(REQ) | `/docs/0.SRS_v1opus46_fn.md` §4.1 |
| 2단계 | Task Tree | GitHub Issues |
| 3단계 | DoD/AC Mapping | Issue Acceptance Criteria |
| 4단계 | Route Handler 설계 | `app/api/v1/` |
| 5단계 | Prisma 스키마·시드 | `prisma/schema.prisma`, `prisma/seed.ts` |
| 6단계 | 테스트 체크리스트 | `docs/0.SRS_v1opus46_fn.md` §6.9 |
