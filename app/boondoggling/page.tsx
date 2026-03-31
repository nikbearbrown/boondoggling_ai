import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Boondoggling — The Art of Conducting Claude',
  description: 'Anyone can use Claude Code. Boondogglers conduct it. The methodology, vocabulary, and practice behind boondoggling.ai.',
}

export default function BoondogglingPage() {
  return (
    <div className="container px-4 md:px-6 mx-auto py-16">
      <article className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:tracking-tighter prose-headings:text-[var(--bb-2)] prose-p:text-[var(--bb-1)] prose-strong:text-[var(--bb-1)] prose-blockquote:border-[var(--bb-4)]">

        <h1>Boondoggling</h1>
        <h2 className="!mt-0">The Art of Conducting Claude</h2>

        <blockquote>
          <p><em>Anyone can use Claude Code. Boondogglers conduct it.</em></p>
        </blockquote>

        <hr />

        <h2>What Just Happened</h2>

        <p>
          A moderately complex website — six routes, a hybrid filesystem/database architecture, an admin
          dashboard, a community upload pipeline, a sandboxed iframe viewer, and a full prompt library — went
          from idea to live in roughly three hours.
        </p>

        <p>Two hours of conversation with <Link href="/tools/gru-tool" className="underline">Gru</Link>. One hour with Claude Code.</p>

        <p>
          Nearly all the time was spent talking. Not coding. Not debugging. Not googling. Talking — precisely,
          in the right order, about what the site was, who it was for, what it would and wouldn&rsquo;t do, and
          what each piece needed to be true before the next piece began.
        </p>

        <p>
          Every prompt worked. Not because the prompts were magic. Because the conversation that produced them
          was structured.
        </p>

        <p>That is boondoggling.</p>

        <hr />

        <h2>Gru and the Minions</h2>

        <p>
          The mental model comes from the movie. <Link href="/tools/gru-tool" className="underline">Gru</Link> does not build the rocket. <Link href="/tools/gru-tool" className="underline">Gru</Link> designs the mission,
          assigns the minions, checks their work, decides what the mission IS, and takes responsibility for
          the outcome.
        </p>

        <p>
          The minions are excellent. They are enthusiastic. They will execute exactly what they understood you
          to mean.
        </p>

        <p>
          That gap — between what you meant and what they understood — is where all the damage lives.
        </p>

        <p>
          Claude is the minions. Fast, capable, tireless, and completely dependent on the quality of the
          instruction they receive. Give them a vague prompt and they will produce a confident, plausible,
          wrong answer. Give them a complete specification — with context inline, output format named, negative
          constraints stated, and a testable handoff condition — and they will produce exactly what you needed.
        </p>

        <p>Your job is not to type less. Your job is to be <Link href="/tools/gru-tool" className="underline">Gru</Link>.</p>

        <hr />

        <h2>The Vocabulary of Waiting</h2>

        <p>
          Anthropic&rsquo;s Claude interface has a gift for anyone who works with AI: a collection of words
          for what Claude is doing while it thinks.
        </p>

        <p>They are not progress indicators. They are tiny moments of delight.</p>

        <p>
          <strong>Frick-fracking</strong> — the iterative work. Claude Code running, making changes, testing,
          adjusting. The thing that happens while you are doing something else. Frick-fracking is productive
          and it does not require your attention. This is where the actual build lives — iterative refinement,
          the real world testing the app, things needing to change, Claude making them change. Fast. Without drama.
        </p>

        <p>
          <strong>Perambulating</strong> — wandering through the problem space. What Claude does when it is
          exploring before it commits.
        </p>

        <p>
          <strong>Discombobulating</strong> — the moment before clarity. Useful to name. It means something
          real is being worked out.
        </p>

        <p>
          <strong>Confabulating</strong> — the danger word. When Claude is producing plausible output that is
          not grounded in reality. This is why the human supervisory capacities exist. Confabulation sounds
          correct. It often reads correctly. Only domain knowledge catches it.
        </p>

        <p>
          <strong>Ruminating</strong> — turning something over. Slow and deliberate. Good for complex
          reasoning steps.
        </p>

        <p>
          <strong>Cogitating</strong> — working it out. Formal, a little stiff, which makes it funnier.
        </p>

        <p>
          <strong>Noodling</strong> — dreaming. The lightest touch. This is where new features come from — not
          a spec, not a requirement, just a thought that something could be interesting. Noodling is the
          beginning of the next build.
        </p>

        <p>
          <strong>Pontificating</strong> — holding forth at length. Occasionally useful. Occasionally what
          Claude does when a shorter answer would have served.
        </p>

        <p>
          <strong>Gallivanting</strong> — going off in a direction that was not requested. A risk. Also
          occasionally where the best ideas come from.
        </p>

        <p>
          Whoever picked those words at Anthropic has good taste. They turn &ldquo;waiting for AI to
          think&rdquo; from an annoyance into a small moment of delight. And naming a platform after one of
          them — <strong>boondoggling</strong>, the productive messing-around that happens when you are
          learning to conduct AI properly — is exactly right.
        </p>

        <hr />

        <h2>The Five Things Only You Can Do</h2>

        <p>
          Boondoggling makes five supervisory capacities explicit. These are not skills you develop. They are
          roles you exercise at specific moments in a build.
        </p>

        <p>
          <strong>[PA] Plausibility Auditing</strong><br />
          Hearing the wrong note before you recompute it. Knowing an output is wrong because of what you know
          about the domain — not because you checked. This is the capacity that catches confabulation. Claude
          cannot do this for itself. It does not know what it does not know.
        </p>

        <p>
          <strong>[PF] Problem Formulation</strong><br />
          Deciding what the mission is before Claude sees it. Not reframing after — before. The quality of the
          output is determined here, before any prompt is written. A poorly formulated problem produces a
          confidently wrong solution.
        </p>

        <p>
          <strong>[TO] Tool Orchestration</strong><br />
          Choosing which Claude task, in what order, with what context, and how to verify it. Deciding when to
          trust the output and when to run another check. This is the capacity that turns a collection of
          prompts into a build sequence.
        </p>

        <p>
          <strong>[IJ] Interpretive Judgment</strong><br />
          Supplying meaning, accountability, and domain reality to Claude&rsquo;s output. Deciding which of
          Claude&rsquo;s variations is correct for this context. Signing your name to the decision. Claude
          cannot be accountable for what it produces. You can.
        </p>

        <p>
          <strong>[EI] Executive Integration</strong><br />
          Holding all four simultaneously toward a unified goal. Recognizing when one Claude output requires
          another task to re-engage. Knowing when the build is done.
        </p>

        <p>
          None of these are things a better model will eventually do. They are structural features of what
          statistical pattern matching is. The gap between what Claude produces and what is true in your
          specific domain will not close. Your job is to stand in that gap with judgment.
        </p>

        <hr />

        <h2>The Boondoggle Score</h2>

        <p>
          After a Software Design Document is complete, <code>/claude</code> generates the Boondoggle Score.
        </p>

        <p>
          It is a conductor&rsquo;s score with two simultaneous parts: the Minion Part (exact prompts for
          Claude, in dependency order) and the <Link href="/tools/gru-tool" className="underline">Gru</Link> Part (precise human actions, labeled by supervisory
          capacity, in the same dependency order).
        </p>

        <p>Every Claude task has:</p>
        <ul>
          <li>Context required (what Claude needs in its window for the prompt to work)</li>
          <li>A complete, copy-pasteable prompt (context inline, format specified, negative constraints named)</li>
          <li>An expected output (specific enough to know whether you got it)</li>
          <li>A handoff condition (exactly what must be true before the next step begins)</li>
        </ul>

        <p>Every human task has:</p>
        <ul>
          <li>A supervisory capacity label</li>
          <li>A specific action (not &ldquo;review the output&rdquo; but &ldquo;verify that every entity in the schema maps to a documented need and flag any that exists only to serve another entity&rdquo;)</li>
        </ul>

        <p>
          The score is ordered by dependency, not by phase. A Claude task with no upstream dependencies can
          begin immediately. A human task that requires multiple inputs does not begin until all inputs are
          confirmed.
        </p>

        <p>
          The handoff condition is the most important element. A minion who does not know when to stop will
          stop at the wrong place or not stop at all. The handoff condition is the conductor&rsquo;s downbeat.
        </p>

        <hr />

        <h2>What Comes Next: Frick-Fracking</h2>

        <p>The site is live. That is version one.</p>

        <p>Version one is not the product. Version one is the thing you learn from.</p>

        <p>
          The real world will test the site. Users will find paths you did not design for. Features will feel
          different in production than they did in the SDD. Something will be missing that nobody thought to
          specify.
        </p>

        <p>This is where <strong>frick-fracking</strong> becomes the primary mode.</p>

        <p>
          Frick-fracking is iterative refinement. Claude Code running while you are doing something else —
          boondoggling, in the original sense. Small changes, fast. A layout that needs adjusting. An edge
          case that surfaced. A feature that was IMPORTANT that is now clearly MUST-HAVE because three people
          asked for it in the same week.
        </p>

        <p>The process for frick-fracking is lighter than the full SDD build. It is:</p>
        <ol>
          <li>Name what needs to change and why (one sentence)</li>
          <li>Check whether the change contradicts anything in the SDD (one minute)</li>
          <li>Write the prompt (precise, context inline, handoff condition named)</li>
          <li>Verify the output</li>
          <li>Ship</li>
        </ol>

        <p>
          The SDD is what makes frick-fracking safe. Because the architecture is documented, small changes do
          not accidentally become large ones. Because the principles are locked, feature creep has a name and a
          date when it is caught. Because the domain model has a ubiquitous language, every prompt uses the
          same terms and every output is legible.
        </p>

        <hr />

        <h2>What Comes After That: Noodling</h2>

        <p>
          <strong>Noodling</strong> is dreaming. It has no deliverable. It is the lightest touch — a thought
          that something could be interesting, a feature that might exist, a direction the platform could go.
        </p>

        <p>Noodling is where the next SDD begins.</p>

        <p>
          The discipline is knowing which noodle is worth developing and which is a gallivant — an appealing
          direction that does not serve the person the site is built for. The SDD&rsquo;s problem statement is
          the filter. Every noodle that survives the &ldquo;what problem does this solve for whom?&rdquo; test
          becomes a candidate for the next build cycle.
        </p>

        <p>The ones that don&rsquo;t survive get written in P2 with a date on them.</p>

        <hr />

        <h2>The Practice</h2>

        <p>Boondoggling is not a tool. It is a practice.</p>

        <p>
          The practice is this: before Claude sees the problem, you decide what the problem is. Before Claude
          produces output, you specify what done looks like. After Claude produces output, you verify it
          against domain reality before the next step begins.
        </p>

        <p>
          You are not saving time by skipping those steps. You are borrowing it, at interest, from the moment
          when the wrong thing ships and has to be unwound.
        </p>

        <p>The minions are excellent. The mission is yours.</p>

        <hr />

        <p className="text-center italic">
          Anyone can use Claude Code. Boondogglers conduct it.
        </p>

        <p className="text-center text-sm text-muted-foreground">
          Built with <Link href="/tools/gru-tool" className="underline">Gru</Link>. Documented with the methodology it teaches.<br />
          boondoggling.ai
        </p>

      </article>
    </div>
  )
}
