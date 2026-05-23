---
name: git-commit-pr
description: Git 커밋 메시지 작성, 브랜치 전략, PR 생성 절차를 안내합니다. Conventional Commits 및 Atomic Commit 원칙을 적용합니다.
---
# Git Commit & PR Procedure

## Commit Message Convention (Conventional Commits)
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types
| Type | 용도 |
|---|---|
| `feat` | 새로운 기능 (예: feat(fraud): add lookup API) |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `style` | 코드 포맷팅 (로직 변경 없음) |
| `refactor` | 리팩터링 |
| `test` | 테스트 추가/수정 |
| `chore` | 빌드, 설정 파일 수정 |
| `ci` | CI/CD 설정 변경 |

### Scope (Phase-0)
- `fraud`: 사기 조회/신고
- `safename`: Safe-Name 등록/리졸브
- `transfer`: 데모 이체 시뮬레이션
- `admin`: 운영자 승인 대시보드
- `auth`: 이메일 인증
- `prisma`: DB 스키마/시드
- `ui`: 공통 UI 컴포넌트

## Branch Strategy (Git Flow Lite)
- `main`: 배포 브랜치 (Vercel 자동 배포)
- `develop`: 개발 통합 브랜치
- `feature/<scope>-<description>`: 기능 브랜치 (예: `feature/fraud-lookup-api`)
- `fix/<description>`: 버그 수정

## PR Checklist
- [ ] Conventional Commits 형식 준수
- [ ] 관련 REQ ID 명시 (예: REQ-P0-001)
- [ ] 수동 테스트 체크리스트 해당 항목 Pass 확인
- [ ] TypeScript 빌드 에러 없음 (`npm run build`)
- [ ] 환경변수 추가 시 `.env.example` 업데이트
- [ ] Prisma 스키마 변경 시 `db push` 완료

## Atomic Commit 원칙
- 하나의 커밋 = 하나의 논리적 변경
- 빌드가 깨지는 중간 상태로 커밋하지 않는다
- 파일 변경과 로직 변경을 분리한다
