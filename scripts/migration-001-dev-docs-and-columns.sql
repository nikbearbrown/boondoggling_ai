-- =============================================================================
-- Migration 001: dev_docs table, tools columns, videos constraints, RLS
-- Project: boondoggling.ai
-- Date: 2026-03-30
--
-- ORDER MATTERS:
-- 1. Create dev_docs table first (no dependencies)
-- 2. Alter tools table (adds columns to existing table)
-- 3. Alter videos table (add blob_url column before CHECK constraint)
-- 4. Add CHECK constraint on videos (depends on blob_url existing)
-- 5. Backfill tools data (depends on new columns existing)
-- 6. Enable RLS + policies on dev_docs (depends on table existing)
-- 7. Enable RLS + policies on videos (can run independently but grouped last)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1: Create the dev_docs table
-- Why first: No dependencies. Other steps don't depend on this, but creating
-- tables before altering existing ones keeps the script predictable.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dev_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  blob_url TEXT NOT NULL,
  build_url TEXT,
  quality_signal TEXT DEFAULT 'community',
  category TEXT,
  methodology TEXT,
  submitted_by TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- STEP 2: Alter the existing tools table — add four new columns
-- Why second: Must happen before the backfill in step 5, which sets values
-- on these columns. Uses DO blocks for IF NOT EXISTS semantics on columns
-- (ALTER TABLE ADD COLUMN IF NOT EXISTS requires PostgreSQL 9.6+).
-- -----------------------------------------------------------------------------
ALTER TABLE tools ADD COLUMN IF NOT EXISTS prompt_text TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS quality_signal TEXT DEFAULT 'community';
ALTER TABLE tools ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0';
ALTER TABLE tools ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

-- -----------------------------------------------------------------------------
-- STEP 3: Alter the videos table — add blob_url column
-- Why third: The CHECK constraint in step 4 references blob_url, so this
-- column must exist first. Also relaxes the NOT NULL on youtube_id since
-- videos can now come from blob storage instead of YouTube.
-- -----------------------------------------------------------------------------
ALTER TABLE videos ADD COLUMN IF NOT EXISTS blob_url TEXT;
ALTER TABLE videos ALTER COLUMN youtube_id DROP NOT NULL;

-- -----------------------------------------------------------------------------
-- STEP 4: Add CHECK constraint on videos — at least one source required
-- Why fourth: Depends on blob_url column from step 3. Ensures every video
-- has either a YouTube ID or a blob URL (or both).
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'video_source_required'
  ) THEN
    ALTER TABLE videos ADD CONSTRAINT video_source_required
      CHECK (youtube_id IS NOT NULL OR blob_url IS NOT NULL);
  END IF;
END
$$;

-- -----------------------------------------------------------------------------
-- STEP 5: Backfill existing tools — mark all current tools as published/curated
-- Why fifth: Depends on the published and quality_signal columns from step 2.
-- All pre-existing tools were manually added and should be visible, so we
-- mark them as published=true and quality_signal='curated'.
-- -----------------------------------------------------------------------------
UPDATE tools
SET published = true, quality_signal = 'curated'
WHERE published IS NULL OR published = false;

-- -----------------------------------------------------------------------------
-- STEP 6: Enable RLS on dev_docs and add read/write policies
-- Why sixth: Depends on dev_docs table from step 1. RLS must be enabled
-- before policies are created.
-- -----------------------------------------------------------------------------
ALTER TABLE dev_docs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'public_read_dev_docs' AND tablename = 'dev_docs'
  ) THEN
    CREATE POLICY "public_read_dev_docs" ON dev_docs FOR SELECT USING (published = true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_role_dev_docs' AND tablename = 'dev_docs'
  ) THEN
    CREATE POLICY "service_role_dev_docs" ON dev_docs FOR ALL USING (true) WITH CHECK (true);
  END IF;
END
$$;

-- -----------------------------------------------------------------------------
-- STEP 7: Enable RLS on videos and add read/write policies
-- Why last: Independent of other steps but grouped with RLS work. Guards
-- against re-running by checking for existing policies.
-- -----------------------------------------------------------------------------
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'public_read_videos' AND tablename = 'videos'
  ) THEN
    CREATE POLICY "public_read_videos" ON videos FOR SELECT USING (published = true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_role_videos' AND tablename = 'videos'
  ) THEN
    CREATE POLICY "service_role_videos" ON videos FOR ALL USING (true) WITH CHECK (true);
  END IF;
END
$$;

-- =============================================================================
-- Migration complete.
--
-- Summary of changes:
--   - New table: dev_docs (with RLS)
--   - tools: +prompt_text, +quality_signal, +version, +published columns
--   - tools: existing rows backfilled to published=true, quality_signal='curated'
--   - videos: +blob_url column, youtube_id no longer NOT NULL
--   - videos: CHECK constraint ensuring at least one source (youtube_id or blob_url)
--   - videos: RLS enabled with public read (published only) + service role full access
-- =============================================================================
