-- ============================================
-- Vintrack — Migration 002: image_url & source_url
-- Adds image path and source URL (where item was bought)
-- to both articles and presets.
-- Run this in the Supabase SQL Editor.
-- ============================================

alter table articles add column if not exists image_url  text default '';
alter table articles add column if not exists source_url text default '';

alter table presets  add column if not exists image_url  text default '';
alter table presets  add column if not exists source_url text default '';
