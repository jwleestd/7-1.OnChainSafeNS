---
name: generate-tasks-from-srs
description: SRS(소프트웨어 요구사항 명세서)를 기반으로 구현 Task를 추출하고, 체계적인 작업 목록과 이슈 템플릿을 생성합니다.
disable-model-invocation: true
---
# SRS → Task 추출 절차

## Input
- SRS 문서: `docs/0.SRS_v1opus46_fn.md`
- 대상 Phase: Phase-0 (§4.1 Phase-0 Functional Requirements)

## Step 1: REQ 목록 추출
SRS §4.1에서 Phase-0 REQ를 전량 추출한다:
- REQ-P0-001 ~ REQ-P0-019 (19건)
- REQ-P0-NF-001 ~ REQ-P0-NF-010 (NFR 10건)

## Step 2: REQ → API 매핑
SRS §6.1 API Endpoint List (Phase-0 7개)와 REQ를 매핑한다:
| API | REQ |
|---|---|
| /api/v1/fraud/lookup | P0-001~002 |
| /api/v1/fraud/report | P0-003~005 |
| /api/v1/resolve | P0-008~010 |
| /api/v1/safename/register | P0-006~007 |
| /api/v1/transfer/demo | P0-016~019 |
| /api/v1/admin/approve | P0-011~013 |
| /api/v1/auth/verify-email | P0-014~015 |

## Step 3: Task 분해
각 API 매핑 단위로 구현 Task를 분해한다:
1. **Prisma 모델 정의** — schema.prisma에 해당 엔터티 추가
2. **Route Handler 구현** — app/api/v1/.../route.ts
3. **입력 검증** — validators.ts에 검증 로직 추가
4. **이메일 발송** — email.ts 템플릿 추가 (해당 시)
5. **UI 페이지 구현** — app/(public or admin)/.../page.tsx
6. **수동 테스트** — §6.9 체크리스트 해당 항목 검증

## Step 4: 이슈 템플릿 생성
각 Task를 아래 형식으로 GitHub Issue로 생성한다:
```markdown
## 📋 Task: [API명] 구현
**관련 REQ:** REQ-P0-XXX
**Priority:** Must
**Acceptance Criteria:**
- [ ] AC-1: (SRS에서 복사)
- [ ] AC-2: (SRS에서 복사)
**구현 범위:**
- [ ] Route Handler
- [ ] 입력 검증
- [ ] DB 연동
- [ ] Email 발송
- [ ] UI 페이지
- [ ] 수동 테스트 Pass
```

## Step 5: 우선순위 정렬
의존성 순서로 정렬:
1. Prisma 스키마 + 시드 (전체 기반)
2. 이메일 인증 (다른 API의 전제)
3. 사기 조회 (독립 기능)
4. Safe-Name 등록/리졸브 (독립 기능)
5. 사기 신고 (이메일 인증 의존)
6. 운영자 승인 (신고 의존)
7. 데모 이체 (리졸브 + 사기검증 의존)
