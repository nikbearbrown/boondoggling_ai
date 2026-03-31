'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 md:px-6 mx-auto py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Bear Brown, LLC</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>30 N Gould St Ste N</p>
              <p>Sheridan, WY 82801</p>
              <p>
                <a href="mailto:bear@bearbrown.co" className="hover:text-foreground transition-colors">
                  bear@bearbrown.co
                </a>
              </p>

            </div>
          </div>

          {/* Placeholder column for future content */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Platform</h3>
            <div className="flex flex-col gap-2">
              <Link href="/boondoggling" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Boondoggling
              </Link>
              <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Tools
              </Link>
              <Link href="/dev" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dev
              </Link>
              <Link href="/videos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Videos
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Connect</h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/nikbearbrown/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.skepticism.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Substack
              </a>
              <a
                href="https://www.bearbrown.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Bear Brown &amp; Co
              </a>
              <a
                href="https://www.youtube.com/@Musinique"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Legal</h3>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/privacy/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p className="italic text-foreground/70 mb-2">Anyone can use Claude Code. Boondogglers conduct it.</p>
          <p>&copy; {currentYear} Bear Brown, LLC. All rights reserved.</p>
          <p className="mt-2">
            Boondoggling.ai is open source (MIT License) · Built by{' '}
            <a href="https://www.bearbrown.co/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Nik Bear Brown</a>
            {' · '}
            <a href="https://www.bearbrown.co/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">bearbrown.co</a>
            {' · '}
            <a href="https://www.skepticism.ai/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">The Skepticism AI Substack</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
