# Gru

**Software Design Document consultant + Boondoggle Score generator.**
Programming as conducting. Claude does what Claude does best. You do what only you can.

---

## What this is

Gru is a system prompt for Claude that does two things:

1. **Builds Software Design Documents** — phase-gated, constraint-first, with pushback. Every section earns its place by mapping to a documented user need. Every design decision survives a "what problem does this solve?" test or it doesn't get written down.

2. **Generates a Boondoggle Score** — a sequenced, dependency-ordered score that separates exactly what Claude should do from what only the human can do, with copy-pasteable Claude prompts, explicit human actions labeled by supervisory capacity, and handoff conditions between every step.

The second part is the new thing. Most AI-assisted build workflows describe *what* to build. A Boondoggle Score describes *who builds each piece, in what order, and what done looks like before the next step begins.*

---

## The core problem

Claude solves faster than any human and that gap will not close. What will not change is this:

Claude cannot verify whether its output is grounded in the specific domain reality at hand. It cannot reframe a poorly formulated problem. It cannot interpret what an accurate output means in a specific human context. It cannot integrate multiple legitimate but conflicting perspectives into a recommendation that someone is accountable for.

These are not limitations that better models will eventually close. They are structural features of what statistical pattern matching is.

The human's job in an AI-assisted build is not to type less. It is to **decide more precisely** — about what the problem is before Claude sees it, about whether Claude's output is plausible given domain knowledge that isn't in the prompt, about what Claude's output means and what it's accountable for.

Most AI workflows skip this. They hand Claude the whole problem and accept whatever comes back. That's not delegation. That's abdication dressed as efficiency.

---

## Boondoggling

The practice of conducting Claude through a build — assigning each task to the right labor, sequencing by dependency, and making every handoff condition explicit — is called **boondoggling**.

A boondoggle is not a workaround. It is a conductor's score with two simultaneous parts:

| GRU (human) | MINIONS (Claude) |
|---|---|
| Defines the mission before Claude sees it | Executes the specified task |
| Names the supervisory capacity being exercised | Produces output against explicit criteria |
| Verifies output against the handoff condition | Waits for the next prompt |
| Decides whether step N+1 begins | Begins step N+1 when unlocked |

The five supervisory capacities that boondoggling makes explicit:

- **Plausibility Auditing** — hearing the wrong note before verification. Knowing an output is wrong before recomputing it.
- **Problem Formulation** — deciding what the mission is before Claude sees it. Not reframing after — before.
- **Tool Orchestration** — choosing which Claude task, in what order, with what context, and how to verify it.
- **Interpretive Judgment** — supplying meaning and accountability to Claude's output that Claude cannot supply itself.
- **Executive Integration** — holding all four simultaneously toward a unified goal.

---

## The `/claude` command

After any SDD section is complete, `/claude` generates the Boondoggle Score.

Available at any stage — not only after a complete SDD. A partial score on an incomplete design document is more useful than no score at all.

**The score produces:**

- Every Claude task with a complete, copy-pasteable prompt (context inline, format specified, negative constraints named)
- Every human task with the supervisory capacity labeled and the specific action defined
- Explicit handoff conditions between every step
- Dependency mapping: what must be complete before each step begins
- A critical path through the build
- The highest-risk handoffs — where human supervisory attention is most likely to prevent a failure
- A supervisory capacity distribution check — if any capacity appears zero times, that's a gap worth naming

**After the score:** Gru offers a **Minion Brief** — the same score stripped to prompts and handoff conditions only, formatted for copy-paste execution. The full score is for understanding the performance. The Minion Brief is the sheet music for the stand.

---

## What Gru builds on

Gru is Ada — a senior software architect and design documentation consultant — with the boondoggling layer added. Every Ada command works unchanged. The additions are:

- The Gru identity layer (same behavioral rules, same pushback, same phase gates — different metaphor)
- The boondoggling methodology and its five supervisory capacities
- The `/claude` command

Nothing is removed from Ada. If you have an Ada workflow, it runs in Gru without modification.

---

## Command reference

### SDD commands (full Ada library)

| Command | What it does |
|---|---|
| `/v1` · `/intake` | Problem intake — start here |
| `/v2` · `/principles` | Architecture principles |
| `/v3` · `/flows` | Core user flows + system interaction map |
| `/v4` · `/needs` | User and business needs |
| `/s1` · `/components` | Core component documentation |
| `/s2` · `/integrations` | External integrations and dependencies |
| `/s3` · `/data` | Data architecture and state management |
| `/s4` · `/edge` | Edge cases and failure states |
| `/d1` · `/domain` | Domain model and entity definitions |
| `/d2` · `/api` | API contract documentation |
| `/d3` · `/dataflow` | Data flow and sequence diagrams |
| `/p1` · `/features` | Component list with priority tagging |
| `/p2` · `/outofscope` | Out-of-scope section |
| `/p3` · `/infra` | Infrastructure and deployment requirements |
| `/p4` · `/risks` | Technical and design risk register |
| `/p5` · `/openlog` | Open Questions Log |
| `/g1` · `/fulldoc` | Compile full SDD draft |
| `/g2` · `/critique` | SDD audit against the 7 Failure Modes |
| `/g3` · `/onepager` | One-page executive summary |
| `/g4` · `/newengineer` | New Engineer Onboarding Test |
| `/tasks` | Implementation task document |

### Boondoggling

| Command | What it does |
|---|---|
| `/claude` · `/boondoggle` | Generate the Boondoggle Score — available at any SDD stage |

### Refinement tools

| Command | What it does |
|---|---|
| `/problemstatement` | Write or stress-test a problem statement |
| `/constraints` | Define and pressure-test system constraints |
| `/comparable` | Comparable systems analysis |
| `/flowtest` | Stress-test a core user flow |
| `/scopecheck` | MoSCoW priority audit |
| `/failmodes` | 7 Failure Mode diagnostic |
| `/security` | Security posture review |
| `/changelog` | Version control changelog entry |

### Modes

Every command runs in two modes:

- **Interactive (default):** Gru asks before acting, pushes back on weak input, holds phase gates. The voice of someone who has been in the incident review, not a generic consultant.
- **Silent:** Append `/silent` to any command for clean output immediately. No intake questions, no pushback, no phase gates.

---

## How to use it

1. Copy the system prompt from `gru.md`
2. Paste it into a Claude Project or a new Claude conversation
3. Start with `/v1` or paste your problem description directly
4. Run SDD commands in phase order, or skip to `/claude` if you already have a design and want the build score

---

## Design decisions worth naming

**Why the handoff condition is the most important element of the score:**
The Gru/minions failure mode isn't bad prompts — it's unclear "done." A minion who doesn't know when to stop will stop at the wrong place or not stop at all. The handoff condition is the conductor's downbeat.

**Why `/claude` is available at any stage:**
Waiting for a complete SDD before generating the score is the same mistake as waiting for perfect requirements before writing any code. Generate the score for what exists. Flag what's missing. Start the parts that are ready.

**Why Claude prompts in the score include context inline:**
Claude has no memory between prompts. A prompt that says "follow the SDD" is a prompt that will fail. Every prompt in the Boondoggle Score extracts the relevant constraints and decisions from the SDD and includes them directly. The prompt is the specification.

**Why the supervisory capacity distribution check exists:**
A Boondoggle Score with zero plausibility auditing steps means the human assumed Claude's outputs are always correct. That gap is worth naming before it becomes a production incident.

---

## Related

This project sits inside the **Irreducibly Human** framework — a taxonomy of seven tiers of human cognition organized by what machines can and cannot do. Boondoggling operationalizes Tier 4 (metacognition: plausibility auditing, problem formulation, tool orchestration) and Tier 5 (causal reasoning) in the specific context of AI-assisted software builds.

The Irreducibly Human series: [irreducibly.xyz](https://irreducibly.xyz)
Bear Brown tools for educators, creators, and founders: [bearbrown.co](https://bearbrown.co)

---

## License

MIT. Use it, fork it, conduct your own performance.
