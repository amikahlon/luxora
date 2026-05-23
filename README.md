## Development Approach

I started this project by planning the architecture before generating any code.

First, I designed the general system structure myself:

- frontend and backend separation
- database structure
- API flow
- project folders
- authentication flow
- checkout flow

During this process I also consulted with AI tools such as Claude to validate architecture decisions, think about scalability, and improve the overall generation workflow.

Technology choices like:

- TanStack Query
- Zustand
- Prisma ORM
- Tailwind CSS
- Framer Motion

were selected based on my own previous experience together with AI discussions about modern frontend/backend best practices.

After the architecture phase, I created the AI Blueprint files inside `ai-blueprint/`.

The goal of these files was to guide the AI agent step-by-step instead of generating the entire project in one uncontrolled prompt.

The workflow was split into phases:

1. Architecture & DB planning
2. Backend foundation
3. Authentication
4. Product catalog
5. Cart & checkout
6. Frontend integration
7. UI refinement

The AI was mainly used for implementation and iteration, while architecture decisions, reviews, corrections, and refinements remained manual.

Before continuing between phases, I reviewed the generated structure, validated the architecture, and adjusted areas where the AI output was not clean or maintainable enough.

---

## AI Blueprint

All AI guidance files are located inside `ai-blueprint/`.

- `architecture.md`
- `engineering-guidelines.md`
- `capability-definitions.md`
- `initial.md`
- `generation-phases.md`
- `ai-interactions.md`

`ai-interactions.md` contains the full AI workflow process, including prompts, architectural discussions, technology decisions, generation flow, model usage, and manual refinements made during the project.
