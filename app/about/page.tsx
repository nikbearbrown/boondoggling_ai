import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About - Boondoggling.ai',
  description: 'About Boondoggling.ai — AI tools, content, and resources from Bear Brown & Company.',
}

export default function AboutPage() {
  return (
    <div className="container px-4 md:px-6 mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter mb-8">About</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <p>
              Boondoggling.ai is an open-source platform from Bear Brown &amp; Company.
              It serves as a hub for AI tools, educational content, dev documentation,
              and curated resources — built with Next.js, Neon, and a philosophy of
              transparent, human-centered design.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Author</h2>
            <p>
              <strong>Nik Bear Brown</strong>, Bear Brown &amp; Company.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">What You&apos;ll Find Here</h2>
            <ul>
              <li>
                <Link href="/tools" className="text-primary hover:underline">Tools</Link> — Interactive AI artifacts and curated tool links
              </li>
              <li>
                <Link href="/blog" className="text-primary hover:underline">Blog</Link> — Articles on AI, education, and technology
              </li>
              <li>
                <Link href="/books" className="text-primary hover:underline">Books</Link> — Open-access book chapters and course materials
              </li>
              <li>
                <Link href="/notes" className="text-primary hover:underline">Notes</Link> — Research notes and documentation
              </li>
              <li>
                <Link href="/dev" className="text-primary hover:underline">Dev Docs</Link> — Technical documentation and guides
              </li>
              <li>
                <Link href="/videos" className="text-primary hover:underline">Videos</Link> — Video tutorials and educational content
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact</h2>
            <p>
              Enquiries may be directed to{' '}
              <a href="mailto:bear@bearbrown.co" className="text-primary hover:underline">bear@bearbrown.co</a>.
            </p>
            <p className="mt-2 text-muted-foreground">
              Bear Brown &amp; Company
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
