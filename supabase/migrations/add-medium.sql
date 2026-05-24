-- Migration: add medium field to workflows, clean up category to represent goal
-- Run this if you already have the schema + seed applied.

set search_path to minflow;

-- Add medium column
alter table workflows add column if not exists medium text;

-- Clean up category values to be goal-oriented
update workflows set category = 'Scripture Access' where category in ('Scripture', 'Publishing', 'Audio');
update workflows set category = 'Evangelism'       where category in ('Film', 'Outreach');
-- Follow-up and Discipleship stay as-is

-- Set medium values by slug
update workflows set medium = 'Text'    where slug = 'bible-translation';
update workflows set medium = 'Digital' where slug = 'bible-app-publishing';
update workflows set medium = 'Audio'   where slug = 'audio-bible-recording';
update workflows set medium = 'Film'    where slug = 'jesus-film-dubbing';
update workflows set medium = 'Digital' where slug = 'media-to-movements';
update workflows set medium = 'Digital' where slug = 'online-chat-followup';
update workflows set medium = 'Mixed'   where slug = 'discipleship-resources';
