-- Migration: add tags array to workflows
-- Run in Supabase SQL editor

set search_path to minflow;

alter table workflows add column if not exists tags text[] default '{}';
