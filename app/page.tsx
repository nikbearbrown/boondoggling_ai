import Link from 'next/link'

const buttonStyles =
  'inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-black text-white shadow hover:bg-gray-800 dark:border dark:border-input dark:bg-background dark:text-foreground dark:shadow-sm dark:hover:bg-accent dark:hover:text-accent-foreground'

const buttonOutline =
  'inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'

const SECTIONS = [
  {
    title: 'TOOLS',
    description:
      'Interactive AI artifacts and curated tool links. Explore prompt engineering aids, visualization generators, and educational utilities — all runnable in your browser.',
    link: 'Browse Tools',
    href: '/tools',
  },
  {
    title: 'BLOG',
    description:
      'Articles on AI, education, technology, and the intersection of human judgment with machine capability. Written by practitioners, for practitioners.',
    link: 'Read the Blog',
    href: '/blog',
  },
  {
    title: 'BOOKS',
    description:
      'Open-access book chapters and course materials. Browse structured curricula with full table-of-contents navigation and in-browser reading.',
    link: 'Explore Books',
    href: '/books',
  },
  {
    title: 'NOTES',
    description:
      'Research notes, workshop materials, and working documents organized by topic. A living reference for ongoing projects and curriculum development.',
    link: 'Browse Notes',
    href: '/notes',
  },
  {
    title: 'DEV DOCS',
    description:
      'Technical documentation, architecture guides, and developer references. Searchable, tag-filtered, and designed for quick lookup.',
    link: 'Read Dev Docs',
    href: '/dev',
  },
  {
    title: 'VIDEOS',
    description:
      'Video tutorials, feature demos, and educational content. Curated playlists organized by topic with tag-based filtering.',
    link: 'Watch Videos',
    href: '/videos',
  },
]

const AUDIENCES = [
  {
    heading: 'FOR DEVELOPERS',
    items: [
      'AI-tool-capable but need structured references and docs',
      'Building systems that require human judgment at the boundary',
      'Looking for open-source templates and patterns',
      'Want practical tools, not just theory',
    ],
  },
  {
    heading: 'FOR EDUCATORS',
    items: [
      'Deploying AI in classroom and workshop settings',
      'Need curriculum materials and course content',
      'Designing learning experiences that develop human skills',
      'Looking for open educational resources',
    ],
  },
  {
    heading: 'FOR CREATORS',
    items: [
      'Using AI tools in creative and editorial workflows',
      'Need judgment frameworks for AI-assisted work',
      'Building content pipelines with human oversight',
      'Looking for inspiration and practical examples',
    ],
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col justify-center space-y-6 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Boondoggling.ai
            </h1>
            <p className="text-lg text-muted-foreground">
              AI tools, content, and resources — open source
            </p>
            <p className="max-w-[540px] text-lg leading-relaxed">
              A platform for interactive AI tools, educational content, dev documentation,
              and curated resources. Built with Next.js and designed for practitioners
              who work with AI every day.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/tools" className={buttonStyles}>
                Explore Tools
              </Link>
              <Link href="/about" className={buttonOutline}>
                About
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="w-full py-16 md:py-24 bg-muted/40">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              The Platform
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Six content systems, each serving a different need. Browse tools,
              read long-form content, reference documentation, or watch tutorials.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {SECTIONS.map((section) => (
              <div
                key={section.title}
                className="rounded-lg border bg-card p-8 shadow-sm flex flex-col"
              >
                <h3 className="text-lg font-bold tracking-wide mb-3">
                  {section.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  {section.description}
                </p>
                <Link
                  href={section.href}
                  className="mt-6 text-sm font-medium text-foreground hover:underline"
                >
                  {section.link} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="w-full py-16 md:py-24 bg-foreground text-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-background/60 mb-3">
              Who This Is For
            </h2>
            <p className="text-lg text-background/70 max-w-2xl mx-auto">
              Built for practitioners who use AI daily and need structured resources,
              not just hype.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {AUDIENCES.map((audience) => (
              <div
                key={audience.heading}
                className="rounded-lg border border-background/10 bg-background/5 p-8"
              >
                <h3 className="text-lg font-bold tracking-wide mb-4">
                  {audience.heading}
                </h3>
                <ul className="space-y-3">
                  {audience.items.map((item) => (
                    <li
                      key={item}
                      className="text-background/80 text-sm leading-relaxed flex gap-2"
                    >
                      <span className="text-background/40 shrink-0">&mdash;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 bg-[var(--bb-2)] text-white">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-white/60 mb-3">
            Get Started
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            Start with the tools — interactive AI artifacts you can run in your browser.
            Then explore the blog, books, and documentation for deeper dives.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tools"
              className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-bold tracking-wide transition-colors bg-white text-[var(--bb-2)] shadow hover:bg-white/90"
            >
              BROWSE TOOLS
            </Link>
            <Link
              href="/blog"
              className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-bold tracking-wide transition-colors border border-white/30 text-white hover:bg-white/10"
            >
              READ THE BLOG
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-16 md:py-24 bg-foreground text-background">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
            Bear Brown &amp; Company
          </h2>
          <p className="max-w-[600px] mx-auto text-background/70 text-lg mb-8">
            Boondoggling.ai is a production of Bear Brown &amp; Company.
            For questions, reach out directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:bear@bearbrown.co"
              className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors border border-background/30 text-background hover:bg-background/10"
            >
              bear@bearbrown.co
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
