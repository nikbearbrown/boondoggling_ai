import Link from 'next/link'

const CAPACITIES = [
  {
    code: 'PA',
    name: 'Plausibility Auditing',
    description:
      'Hear the wrong note before you recompute it. Claude produces fluent output that may be structurally unsound — you catch what passes every syntax check.',
  },
  {
    code: 'PF',
    name: 'Problem Formulation',
    description:
      'Rewrite the question so the answer becomes findable. Claude optimises within the frame you give it — you decide whether the frame is the right one.',
  },
  {
    code: 'TO',
    name: 'Tool Orchestration',
    description:
      'Choose which tool runs, in what order, with what constraints. Claude executes a single turn — you sequence the pipeline across turns, tools, and contexts.',
  },
  {
    code: 'IJ',
    name: 'Interpretive Judgment',
    description:
      'Decide what the output means for this situation, this user, this deadline. Claude returns text — you supply the judgment that text alone cannot carry.',
  },
  {
    code: 'EI',
    name: 'Executive Integration',
    description:
      'Hold the whole build in your head. Claude sees one prompt at a time — you hold the architecture, the tradeoffs, and the accountability across all of them.',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Beat 1 — What is boondoggling? */}
      <section className="w-full py-24 bg-[var(--bb-8)]">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-[var(--bb-2)] mb-8">
            Anyone can use Claude Code. Boondogglers conduct it.
          </h1>
          <div className="space-y-4 text-lg leading-relaxed text-[var(--bb-1)]">
            <p>
              Claude solves faster than any human. That gap will not close — it will
              widen. What will not change: Claude cannot verify its output against domain
              reality, cannot reframe a poorly formulated problem, cannot supply
              accountability when the build ships.
            </p>
            <p>
              The human&rsquo;s job is not to type less. It is to decide more precisely —
              what to build, in what order, and what counts as done. That is conducting.
              Boondoggling is the practice of learning how.
            </p>
          </div>
        </div>
      </section>

      {/* Beat 2 — Why does it matter? */}
      <section className="w-full py-24 bg-white dark:bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-[var(--bb-2)] mb-12">
            The five things only you can do.
          </h2>
          <div className="space-y-8">
            {CAPACITIES.map((cap) => (
              <div key={cap.code} className="flex gap-4">
                <div className="shrink-0 w-12 pt-1">
                  <span className="font-mono text-sm font-bold text-[var(--bb-5)]">
                    [{cap.code}]
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--bb-2)] mb-1">
                    {cap.name}
                  </h3>
                  <p className="text-[var(--bb-1)] leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beat 3 — How does it work? */}
      <section className="w-full py-24 bg-[var(--bb-8)]">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-[var(--bb-2)] mb-8">
            Meet Gru.
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-[var(--bb-1)]">
            <p>
              Gru is a system prompt for Claude that builds Software Design Documents
              and generates a Boondoggle Score — a sequenced, dependency-ordered plan
              that separates what Claude builds from what you build.
            </p>
            <p>
              You run it in your own Claude Project. No account on this site, no API key,
              no paywall. The videos show you how.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/videos"
              className="text-[var(--bb-2)] font-medium hover:underline"
            >
              Watch how it works &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Beat 4 — Get the tool */}
      <section className="w-full py-24 bg-white dark:bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-[var(--bb-2)] mb-8">
            Copy Gru. Paste it into a Claude Project. Start building.
          </h2>
          <div className="space-y-6 text-lg text-[var(--bb-1)]">
            <div className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--bb-7)] text-[var(--bb-1)] flex items-center justify-center text-sm font-bold">
                1
              </span>
              <p className="leading-relaxed pt-1">
                Go to <Link href="/tools" className="font-medium underline hover:text-[var(--bb-2)]">/tools</Link> and
                copy the Gru system prompt.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--bb-7)] text-[var(--bb-1)] flex items-center justify-center text-sm font-bold">
                2
              </span>
              <p className="leading-relaxed pt-1">
                Open claude.ai &rarr; create a new Project &rarr; paste into Project Instructions.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--bb-7)] text-[var(--bb-1)] flex items-center justify-center text-sm font-bold">
                3
              </span>
              <p className="leading-relaxed pt-1">
                Type <code className="bg-[var(--bb-8)] px-1.5 py-0.5 rounded text-sm font-mono">/help</code> to start.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <Link
              href="/tools"
              className="inline-flex h-11 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors bg-[var(--bb-2)] text-white shadow hover:bg-[var(--bb-1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Get Gru &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Beat 5 — See it in action */}
      <section className="w-full py-24 bg-[var(--bb-8)]">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-[var(--bb-2)] mb-8">
            Real builds. Real SDDs. Real Boondoggle Scores.
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-[var(--bb-1)]">
            <p>
              Every doc in <Link href="/dev" className="font-medium underline hover:text-[var(--bb-2)]">/dev</Link> is
              a real build produced using Gru. Browse by category — websites, agents, games.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/dev"
              className="text-[var(--bb-2)] font-medium hover:underline"
            >
              Browse worked examples &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
