/**
 * List all dev docs in public/dev/.
 * Usage: npx tsx scripts/sync-dev.ts
 */
import { join } from 'path'
import { scanHtmlDir } from '../lib/html-meta'

const docs = scanHtmlDir(join(process.cwd(), 'public', 'dev'))

if (docs.length === 0) {
  console.log('No HTML files found in public/dev/')
} else {
  console.log(`Found ${docs.length} doc(s) in public/dev/:\n`)
  for (const doc of docs) {
    console.log(`  ${doc.filename}`)
    console.log(`    Title: ${doc.title}`)
    if (doc.description) console.log(`    Description: ${doc.description}`)
    if (doc.tags.length) console.log(`    Tags: ${doc.tags.join(', ')}`)
    console.log()
  }
}
