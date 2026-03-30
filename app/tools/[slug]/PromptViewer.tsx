'use client'

import { useRef, useState } from 'react'

const CHAR_LIMIT_WARNING = 180000

export default function PromptViewer({ promptText }: { promptText: string }) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const charCount = promptText.length

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(promptText)
      setCopied(true)
      setCopyFailed(false)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyFailed(true)
    }
  }

  function handleSelectAll() {
    if (!preRef.current) return
    const range = document.createRange()
    range.selectNodeContents(preRef.current)
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleCopy}
          className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium bg-black text-white shadow hover:bg-gray-800 dark:border dark:border-input dark:bg-background dark:text-foreground dark:shadow-sm dark:hover:bg-accent dark:hover:text-accent-foreground transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        {copyFailed && (
          <button
            onClick={handleSelectAll}
            className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Select All
          </button>
        )}
        <span className="text-xs text-muted-foreground">
          {charCount.toLocaleString()} characters
        </span>
      </div>

      {charCount > CHAR_LIMIT_WARNING && (
        <div className="rounded-md bg-[var(--bb-4)]/10 border border-[var(--bb-4)]/30 p-3 text-sm text-[var(--bb-4)]">
          This prompt is long. Verify it fits in your Claude Project Instructions before use.
        </div>
      )}

      <pre
        ref={preRef}
        className="w-full overflow-x-auto rounded-md border bg-muted/50 p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap break-words"
      >
        {promptText}
      </pre>
    </div>
  )
}
