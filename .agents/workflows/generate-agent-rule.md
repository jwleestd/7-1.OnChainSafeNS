---
name: generate-agent-rule
description: Antigravity 및 Gemini CLI 환경에서 동작하기 위한 .md 룰 파일을 생성하는 표준 가이드 (On-Chain Fraud Shield Platform)
---

# Agent Rule 생성 가이드

## 📋 개요
이 문서는 Antigravity 및 Gemini CLI 환경에서 동작하기 위한 `.md` 룰 파일을 생성하는 표준 가이드를 정의합니다.
모든 새로운 룰은 `.agents/rules/` 디렉토리 내에 생성되어야 하며, 다음 표준을 따라야 합니다.

---

## 🎯 룰 파일 작성 표준

### 1. 파일 명명 규칙 (File Naming)
파일 이름은 `NNN-name.md` 형식을 따릅니다. (NNN = 001–399)

| 번호 범위 | 카테고리 | 현재 파일 |
|:---:|:---:|---|
| **001–099** | Core/Project-wide | 001-project-overview, 002-tech-stack, 003-development-guidelines, 004-phase0-constraints, 005-data-model |
| **100–199** | Workflow & Integration | (향후 추가) |
| **200–299** | Pattern & Style | (향후 추가) |
| **300–399** | Technology-specific | (향후 추가 — Next.js, Prisma, shadcn/ui 등) |

### 2. 작성 원칙
- **단일 책임 원칙 (SRP)**: 각 룰은 하나의 논리적 목적만 가져야 합니다.
- **간결성**: 본문은 가능한 25줄 이내로 작성하여 핵심만 전달합니다.
- **기술 스택 일치**: Phase-0 MVP 기술 스택(Next.js, TypeScript, Prisma, Supabase PostgreSQL, Tailwind CSS + shadcn/ui)에 부합해야 합니다.
- **Phase-0 제약 준수**: 004-phase0-constraints.md의 C-P0 정책을 위반하지 않아야 합니다.

### 3. 메타데이터 설정 (YAML Frontmatter)
파일 상단에 반드시 다음과 같은 YAML 블록을 설정해야 에이전트가 룰의 발동 조건을 인지합니다:
- **description**: 룰이 적용되는 상황 설명 (에이전트 검색용)
- **globs**: 룰이 적용될 파일 경로 패턴 (예: `**/*.ts`, `app/api/**/*.ts`)
- **alwaysApply**: `true`로 설정 시 문맥과 관계없이 항상 적용 (토큰 소모 주의)

---

## 📝 .md 파일 템플릿

```markdown
---
description: [이 룰이 적용되는 상황에 대한 간략한 설명 - 에이전트 판단용]
globs: [적용될 파일 패턴, 예: "app/api/**/*.ts"]
alwaysApply: [true|false]
---
# [룰 이름]

## Context
- [어떤 상황에서 이 룰을 따라야 하는지 설명]

## Rules
- [핵심 규칙 1]
- [핵심 규칙 2]
- [핵심 규칙 3]

## Examples
<example>
// 올바른 예시: Route Handler에서 Prisma 직접 호출
export async function GET(req: NextRequest) {
  const result = await prisma.fraudAddress.findFirst({ ... });
  return NextResponse.json({ success: true, data: result });
}
</example>

<bad-example>
// 잘못된 예시: Service 레이어 분리 (Phase-0에서 불필요)
const result = await fraudService.lookup(address);
</bad-example>
```

---

## 🚀 생성 프로세스
1. 룰의 목적과 범주(번호 대역)를 결정합니다.
2. `.agents/rules/` 디렉토리에 `NNN-kebab-case-name.md` 파일을 생성합니다.
3. 위 템플릿(YAML Frontmatter 포함)에 맞춰 내용을 작성합니다.
4. `.cursor/rules/`에도 동일 내용의 `.mdc` 파일을 생성합니다 (Cursor 호환).
5. 필요시 다른 문서에서 해당 룰을 `@NNN-kebab-case-name.md` 형태로 멘션하여 연결합니다.
