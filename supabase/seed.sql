-- Set search path so all inserts go into minflow schema
set search_path to minflow;

-- UUID key:
--   tools      aa000001-... through aa000025-...
--   workflows  bb000001-... through bb000007-...
--   steps      cc000001-... through cc000035-...

-- ============================================================
-- TOOLS
-- ============================================================
insert into tools (id, name, slug, description, url, category, cost_level, difficulty_level, offline_capable, notes) values
  ('aa000001-0000-0000-0000-000000000000', 'Paratext', 'paratext', 'Bible translation software used by translators worldwide. Tracks progress, supports checking, and connects teams.', 'https://paratext.org', 'Translation', 'free', 'intermediate', true, 'Requires training. Used by UBS and SIL translation teams globally.'),
  ('aa000002-0000-0000-0000-000000000000', 'Scripture App Builder', 'scripture-app-builder', 'Build Scripture apps for Android and iOS without coding. Supports audio, text, and study helps.', 'https://software.sil.org/scriptureappbuilder', 'Publishing', 'free', 'beginner', true, 'Made by SIL. Widely used for minority language Scripture distribution.'),
  ('aa000003-0000-0000-0000-000000000000', 'Digital Bible Platform', 'digital-bible-platform', 'API-based platform for distributing Bible text and audio. Powers many Bible apps.', 'https://www.digitalbibleplatform.com', 'Publishing', 'free', 'advanced', false, 'Used by faith.com / American Bible Society ecosystem.'),
  ('aa000004-0000-0000-0000-000000000000', 'YouVersion / Bible.com', 'youversion', 'World''s most widely used Bible app. Submit a translation for global reach.', 'https://www.youversion.com/the-bible-app/partners', 'Publishing', 'free', 'beginner', false, 'Submission requires approval and rights clearance.'),
  ('aa000005-0000-0000-0000-000000000000', 'FCBH / Faith Comes By Hearing', 'faith-comes-by-hearing', 'Organization that records oral Bible audio and distributes via Proclaimer devices and apps.', 'https://www.faithcomesbyhearing.com', 'Audio', 'free', 'beginner', true, 'Works with translation teams globally for free audio recording.'),
  ('aa000006-0000-0000-0000-000000000000', 'Audacity', 'audacity', 'Free open-source audio recording and editing software.', 'https://www.audacityteam.org', 'Audio', 'free', 'beginner', true, 'Good for simple recording. Export to MP3/WAV for distribution.'),
  ('aa000007-0000-0000-0000-000000000000', 'Adobe Audition', 'adobe-audition', 'Professional audio editing software for mastering and mixing.', 'https://www.adobe.com/products/audition.html', 'Audio', 'paid', 'advanced', false, 'Used by professional recording studios.'),
  ('aa000008-0000-0000-0000-000000000000', 'Jesus Film Project', 'jesus-film-project', 'Provides the Jesus Film in 2000+ languages. Also supports dubbing new languages.', 'https://www.jesusfilm.org', 'Film', 'free', 'beginner', true, 'Contact JFP for dubbing partnerships.'),
  ('aa000009-0000-0000-0000-000000000000', 'LUMO Project', 'lumo-project', 'High-definition Gospel films (Matthew, Mark, Luke, John) available for dubbing.', 'https://www.lumoproject.com', 'Film', 'free', 'intermediate', true, 'More cinematic quality than Jesus Film. Growing language catalog.'),
  ('aa000010-0000-0000-0000-000000000000', 'Meta Ads Manager', 'meta-ads-manager', 'Run targeted ad campaigns on Facebook and Instagram for seeker outreach.', 'https://www.facebook.com/business/tools/ads-manager', 'Outreach', 'paid', 'intermediate', false, 'Good for media-to-movements (M2M) campaigns. Requires ad budget.'),
  ('aa000011-0000-0000-0000-000000000000', 'Google Ads', 'google-ads', 'Search and display advertising for reaching seekers on Google.', 'https://ads.google.com', 'Outreach', 'paid', 'intermediate', false, 'Google Grants available for nonprofits — up to $10k/month free.'),
  ('aa000012-0000-0000-0000-000000000000', 'WhatsApp Business', 'whatsapp-business', 'Messaging app for follow-up with seekers and discipleship groups. Widely used in Global South.', 'https://business.whatsapp.com', 'Follow-up', 'free', 'beginner', false, 'Critical for many M2M follow-up chains. Works on low-data connections.'),
  ('aa000013-0000-0000-0000-000000000000', 'Telegram', 'telegram', 'Encrypted messaging app useful for sensitive follow-up contexts and group discipleship.', 'https://telegram.org', 'Follow-up', 'free', 'beginner', false, 'Good for security-sensitive regions.'),
  ('aa000014-0000-0000-0000-000000000000', 'ChurchSuite', 'churchsuite', 'Church management software for tracking disciples, groups, and follow-up.', 'https://churchsuite.com', 'Discipleship', 'paid', 'beginner', false, 'Used by many churches for managing new believer follow-up.'),
  ('aa000015-0000-0000-0000-000000000000', 'Discipleship.org Resources', 'discipleship-org', 'Free discipleship tools, training materials, and curriculum.', 'https://discipleship.org', 'Discipleship', 'free', 'beginner', false, 'Good starting point for new believer resources.'),
  ('aa000016-0000-0000-0000-000000000000', 'Bloom', 'bloom', 'Create and distribute illustrated books and materials in local languages. Made by SIL.', 'https://bloomlibrary.org', 'Publishing', 'free', 'beginner', true, 'Used for literacy and Bible story materials.'),
  ('aa000017-0000-0000-0000-000000000000', 'GodTools', 'godtools', 'Mobile app for sharing faith conversations and Gospel presentations.', 'https://www.godtoolsapp.com', 'Outreach', 'free', 'beginner', false, 'From Cru. Supports many languages.'),
  ('aa000018-0000-0000-0000-000000000000', 'Typeform / Tally', 'typeform-tally', 'Form builders for collecting seeker responses from ads or landing pages.', 'https://tally.so', 'Follow-up', 'freemium', 'beginner', false, 'Use to route seekers to follow-up teams.'),
  ('aa000019-0000-0000-0000-000000000000', 'CapCut / DaVinci Resolve', 'video-editing', 'Video editing tools for creating social media clips from film content.', 'https://www.capcut.com', 'Media', 'freemium', 'beginner', false, 'CapCut is mobile-friendly. DaVinci is professional desktop tool.'),
  ('aa000020-0000-0000-0000-000000000000', 'Canva', 'canva', 'Design tool for creating social media graphics and campaign materials.', 'https://www.canva.com', 'Media', 'freemium', 'beginner', false, 'Easy to use. Many mission orgs use for outreach content.'),
  ('aa000021-0000-0000-0000-000000000000', 'SIL Language Technology Tools', 'sil-tools', 'Suite of language tools including FLEx (FieldWorks), Keyman, and others.', 'https://software.sil.org', 'Translation', 'free', 'advanced', true, 'FLEx used for lexicography. Keyman for keyboard input.'),
  ('aa000022-0000-0000-0000-000000000000', 'Proclaimer Device', 'proclaimer', 'Solar-powered audio Bible player for low-literacy and offline communities.', 'https://www.faithcomesbyhearing.com/proclaimer', 'Audio', 'paid', 'beginner', true, 'Distributed by FCBH. Pre-loaded with audio Bible for specific language.'),
  ('aa000023-0000-0000-0000-000000000000', 'Radio Broadcast Platforms', 'radio-broadcast', 'Traditional and internet radio for broad Scripture audio distribution.', null, 'Distribution', 'paid', 'advanced', true, 'HCJB, TWR, and others partner for mission broadcasts.'),
  ('aa000024-0000-0000-0000-000000000000', 'Messenger Bot (ManyChat)', 'manychat', 'Automated chatbot flows for following up with ad respondents via Messenger.', 'https://manychat.com', 'Follow-up', 'freemium', 'intermediate', false, 'Popular in M2M campaigns for automated first response.'),
  ('aa000025-0000-0000-0000-000000000000', 'Biblica / American Bible Society', 'biblica-abs', 'Organizations providing licensed Scripture text for publishing.', 'https://www.biblica.com', 'Publishing', 'free', 'beginner', false, 'Contact for text licensing and translation rights.');


-- ============================================================
-- WORKFLOWS
-- ============================================================
insert into workflows (id, title, slug, description, category, medium, difficulty) values
  ('bb000001-0000-0000-0000-000000000000', 'Bible Translation', 'bible-translation',
   'The process of translating Scripture from original languages into a target language. Often the foundational step from which many other workflows flow. Involves drafting, checking, community review, and consultant approval.',
   'Scripture Access', 'Text', 'advanced'),

  ('bb000002-0000-0000-0000-000000000000', 'Bible App Publishing', 'bible-app-publishing',
   'Taking a completed or in-progress Bible translation and making it available on mobile apps and digital platforms. Enables Scripture access for smartphone users.',
   'Scripture Access', 'Digital', 'intermediate'),

  ('bb000003-0000-0000-0000-000000000000', 'Audio Bible Recording', 'audio-bible-recording',
   'Recording the Scripture text in audio form for communities with low literacy or oral learning preferences. Can be done professionally or with community readers.',
   'Scripture Access', 'Audio', 'beginner'),

  ('bb000004-0000-0000-0000-000000000000', 'Jesus Film / LUMO Dubbing', 'jesus-film-dubbing',
   'Dubbing the Jesus Film or LUMO Gospel films into a local language. Creates powerful evangelism media in the heart language of the community.',
   'Evangelism', 'Film', 'intermediate'),

  ('bb000005-0000-0000-0000-000000000000', 'Media to Movements Campaign', 'media-to-movements',
   'Using digital ads (Facebook, Instagram, Google) to reach seekers, collect responses, and hand off to follow-up teams. A common evangelism strategy in the digital age.',
   'Evangelism', 'Digital', 'intermediate'),

  ('bb000006-0000-0000-0000-000000000000', 'Online Chat Follow-up', 'online-chat-followup',
   'Following up with people who responded to Gospel content online. Uses chat apps like WhatsApp or Messenger to connect seekers with believers and begin discipleship.',
   'Follow-up', 'Digital', 'beginner'),

  ('bb000007-0000-0000-0000-000000000000', 'Discipleship Resource Distribution', 'discipleship-resources',
   'Creating and distributing discipleship materials to new believers. Includes digital apps, printed materials, audio content, and local church connections.',
   'Discipleship', 'Mixed', 'beginner');


-- ============================================================
-- WORKFLOW INPUTS
-- ============================================================
insert into workflow_inputs (workflow_id, title, description) values
  ('bb000001-0000-0000-0000-000000000000', 'Source text (Hebrew/Greek/gateway language)', 'Original language texts or approved gateway language translation'),
  ('bb000001-0000-0000-0000-000000000000', 'Mother tongue translators', 'Native speakers trained in translation principles'),
  ('bb000001-0000-0000-0000-000000000000', 'Translation consultant', 'Trained checker who reviews translation quality'),

  ('bb000002-0000-0000-0000-000000000000', 'Completed or draft translation text', 'Digital Scripture text in a supported format (USFM, USX, etc.)'),
  ('bb000002-0000-0000-0000-000000000000', 'Language code (ISO 639)', 'Standardized language identifier'),
  ('bb000002-0000-0000-0000-000000000000', 'Translation rights / license', 'Permission to publish the translation digitally'),

  ('bb000003-0000-0000-0000-000000000000', 'Approved translation text', 'Proofread and approved Scripture text to be recorded'),
  ('bb000003-0000-0000-0000-000000000000', 'Voice talent (community readers)', 'Native speakers to read the text'),
  ('bb000003-0000-0000-0000-000000000000', 'Recording space', 'Quiet room or professional studio'),

  ('bb000004-0000-0000-0000-000000000000', 'Existing film (Jesus Film or LUMO)', 'Master film files from JFP or LUMO Project'),
  ('bb000004-0000-0000-0000-000000000000', 'Dubbing script (translated)', 'Translated dialogue and script for lip-sync dubbing'),
  ('bb000004-0000-0000-0000-000000000000', 'Voice actors', 'Native speakers to record dubbed audio'),

  ('bb000005-0000-0000-0000-000000000000', 'Evangelism content (video, image, text)', 'Engaging Gospel content for ad targeting'),
  ('bb000005-0000-0000-0000-000000000000', 'Ad budget', 'Funding for digital advertising'),
  ('bb000005-0000-0000-0000-000000000000', 'Landing page or response form', 'Destination for ad clicks to collect seeker info'),
  ('bb000005-0000-0000-0000-000000000000', 'Follow-up team', 'People ready to respond to seeker inquiries'),

  ('bb000006-0000-0000-0000-000000000000', 'Seeker contacts from ads or events', 'List of people who expressed interest'),
  ('bb000006-0000-0000-0000-000000000000', 'Chat platform access (WhatsApp, Messenger, etc.)', 'Accounts set up to receive messages'),
  ('bb000006-0000-0000-0000-000000000000', 'Trained follow-up workers', 'People equipped to respond and disciple'),

  ('bb000007-0000-0000-0000-000000000000', 'New believer contacts', 'People who have made decisions and need follow-up'),
  ('bb000007-0000-0000-0000-000000000000', 'Discipleship materials', 'Written, audio, or video discipleship content'),
  ('bb000007-0000-0000-0000-000000000000', 'Local church or group', 'Community for ongoing discipleship');


-- ============================================================
-- WORKFLOW OUTPUTS
-- ============================================================
insert into workflow_outputs (workflow_id, title, description) values
  ('bb000001-0000-0000-0000-000000000000', 'Translated Scripture text', 'Complete or partial Scripture in target language'),
  ('bb000001-0000-0000-0000-000000000000', 'Translation files (USFM)', 'Digital files ready for publishing and distribution'),
  ('bb000001-0000-0000-0000-000000000000', 'Reviewed and consultant-checked text', 'Quality-assured translation ready for use'),

  ('bb000002-0000-0000-0000-000000000000', 'Bible app (Android/iOS)', 'Published app available for download'),
  ('bb000002-0000-0000-0000-000000000000', 'Scripture available on YouVersion', 'Translation accessible to billions globally'),
  ('bb000002-0000-0000-0000-000000000000', 'Offline Bible access', 'Downloaded Scripture for no-internet environments'),

  ('bb000003-0000-0000-0000-000000000000', 'Audio Bible recordings (MP3/WAV)', 'Complete audio Scripture files'),
  ('bb000003-0000-0000-0000-000000000000', 'Proclaimer-ready audio', 'Formatted audio for FCBH Proclaimer devices'),
  ('bb000003-0000-0000-0000-000000000000', 'Streaming audio content', 'Audio available for apps and online platforms'),

  ('bb000004-0000-0000-0000-000000000000', 'Dubbed film (MP4)', 'Completed film with local language audio track'),
  ('bb000004-0000-0000-0000-000000000000', 'Social media clips', 'Short clips from film for sharing online'),
  ('bb000004-0000-0000-0000-000000000000', 'Offline-shareable film', 'Film ready for USB/SD card distribution'),

  ('bb000005-0000-0000-0000-000000000000', 'Seeker contacts / leads', 'People who responded to Gospel content'),
  ('bb000005-0000-0000-0000-000000000000', 'Response data and analytics', 'Insights on what content resonates'),
  ('bb000005-0000-0000-0000-000000000000', 'Warm handoff to follow-up team', 'Contacts passed to trained workers'),

  ('bb000006-0000-0000-0000-000000000000', 'Engaged seekers', 'People in active conversation about faith'),
  ('bb000006-0000-0000-0000-000000000000', 'New believers', 'People who made decisions for Christ'),
  ('bb000006-0000-0000-0000-000000000000', 'Discipleship group connections', 'Seekers connected to ongoing community'),

  ('bb000007-0000-0000-0000-000000000000', 'Grounded disciples', 'New believers with Scripture and community'),
  ('bb000007-0000-0000-0000-000000000000', 'Reproducible disciple makers', 'Disciples who can train others'),
  ('bb000007-0000-0000-0000-000000000000', 'Local church members', 'People integrated into local faith community');


-- ============================================================
-- WORKFLOW STEPS
-- ============================================================
insert into workflow_steps (id, workflow_id, title, description, step_order) values
  -- Bible Translation
  ('cc000001-0000-0000-0000-000000000000', 'bb000001-0000-0000-0000-000000000000', 'Community preparation', 'Engage the language community, identify translators, and establish translation team.', 1),
  ('cc000002-0000-0000-0000-000000000000', 'bb000001-0000-0000-0000-000000000000', 'Translation drafting', 'Translators produce initial draft using source texts and translation tools.', 2),
  ('cc000003-0000-0000-0000-000000000000', 'bb000001-0000-0000-0000-000000000000', 'Community checking', 'Draft read back to community for comprehension and naturalness testing.', 3),
  ('cc000004-0000-0000-0000-000000000000', 'bb000001-0000-0000-0000-000000000000', 'Consultant checking', 'Trained consultant reviews translation for accuracy and faithfulness.', 4),
  ('cc000005-0000-0000-0000-000000000000', 'bb000001-0000-0000-0000-000000000000', 'Revision and finalization', 'Apply corrections, final proofreading, and approve for publication.', 5),

  -- Bible App Publishing
  ('cc000006-0000-0000-0000-000000000000', 'bb000002-0000-0000-0000-000000000000', 'Prepare digital text files', 'Format Scripture text in USFM or other supported digital formats.', 1),
  ('cc000007-0000-0000-0000-000000000000', 'bb000002-0000-0000-0000-000000000000', 'Configure app with Scripture App Builder', 'Set up app design, audio, study helps, and language settings.', 2),
  ('cc000008-0000-0000-0000-000000000000', 'bb000002-0000-0000-0000-000000000000', 'Test app on devices', 'Test on Android and iOS devices for display and functionality.', 3),
  ('cc000009-0000-0000-0000-000000000000', 'bb000002-0000-0000-0000-000000000000', 'Publish to app stores', 'Submit app to Google Play and Apple App Store.', 4),
  ('cc000010-0000-0000-0000-000000000000', 'bb000002-0000-0000-0000-000000000000', 'Submit to YouVersion / DBP', 'Submit translation to YouVersion and Digital Bible Platform for wider reach.', 5),

  -- Audio Bible Recording
  ('cc000011-0000-0000-0000-000000000000', 'bb000003-0000-0000-0000-000000000000', 'Recruit and train readers', 'Select clear-voiced native speakers and train for consistent reading pace.', 1),
  ('cc000012-0000-0000-0000-000000000000', 'bb000003-0000-0000-0000-000000000000', 'Set up recording space', 'Prepare quiet room or studio with basic acoustic treatment.', 2),
  ('cc000013-0000-0000-0000-000000000000', 'bb000003-0000-0000-0000-000000000000', 'Record chapters systematically', 'Record book-by-book with quality checks after each session.', 3),
  ('cc000014-0000-0000-0000-000000000000', 'bb000003-0000-0000-0000-000000000000', 'Edit and master audio', 'Clean up recordings, remove noise, and normalize audio levels.', 4),
  ('cc000015-0000-0000-0000-000000000000', 'bb000003-0000-0000-0000-000000000000', 'Export and distribute', 'Export to MP3/WAV and upload to FCBH, apps, or distribution platforms.', 5),

  -- Jesus Film Dubbing
  ('cc000016-0000-0000-0000-000000000000', 'bb000004-0000-0000-0000-000000000000', 'Partner with Jesus Film Project or LUMO', 'Contact JFP or LUMO to access master film files and dubbing resources.', 1),
  ('cc000017-0000-0000-0000-000000000000', 'bb000004-0000-0000-0000-000000000000', 'Translate dubbing script', 'Translate and adapt dialogue to fit lip movements and natural speech.', 2),
  ('cc000018-0000-0000-0000-000000000000', 'bb000004-0000-0000-0000-000000000000', 'Cast and prepare voice actors', 'Recruit native speakers for character voices. Train for film dubbing.', 3),
  ('cc000019-0000-0000-0000-000000000000', 'bb000004-0000-0000-0000-000000000000', 'Record dubbed audio', 'Record voice tracks synchronized to film dialogue timing.', 4),
  ('cc000020-0000-0000-0000-000000000000', 'bb000004-0000-0000-0000-000000000000', 'Mix and finalize film', 'Mix dubbed audio with original music and effects. Export final film.', 5),

  -- Media to Movements Campaign
  ('cc000021-0000-0000-0000-000000000000', 'bb000005-0000-0000-0000-000000000000', 'Define target audience', 'Identify people group, location, demographics, and spiritual interests.', 1),
  ('cc000022-0000-0000-0000-000000000000', 'bb000005-0000-0000-0000-000000000000', 'Create ad content', 'Develop engaging videos, images, and copy for Gospel outreach.', 2),
  ('cc000023-0000-0000-0000-000000000000', 'bb000005-0000-0000-0000-000000000000', 'Build landing page and response form', 'Create page where seekers can learn more and express interest.', 3),
  ('cc000024-0000-0000-0000-000000000000', 'bb000005-0000-0000-0000-000000000000', 'Launch ad campaigns', 'Run targeted ads on Facebook, Instagram, or Google.', 4),
  ('cc000025-0000-0000-0000-000000000000', 'bb000005-0000-0000-0000-000000000000', 'Route and hand off responses', 'Collect form responses and pass to trained follow-up workers.', 5),

  -- Online Chat Follow-up
  ('cc000026-0000-0000-0000-000000000000', 'bb000006-0000-0000-0000-000000000000', 'Receive seeker contacts', 'Get contact list from ad campaigns, events, or referrals.', 1),
  ('cc000027-0000-0000-0000-000000000000', 'bb000006-0000-0000-0000-000000000000', 'Initiate conversation', 'Send personalized first message introducing yourself and your interest in them.', 2),
  ('cc000028-0000-0000-0000-000000000000', 'bb000006-0000-0000-0000-000000000000', 'Share Scripture and Gospel', 'Send Bible verses, stories, and Gospel content naturally in conversation.', 3),
  ('cc000029-0000-0000-0000-000000000000', 'bb000006-0000-0000-0000-000000000000', 'Respond to questions and objections', 'Listen, answer questions, and address concerns about faith.', 4),
  ('cc000030-0000-0000-0000-000000000000', 'bb000006-0000-0000-0000-000000000000', 'Invite to decision and community', 'Invite to follow Christ and connect to a local group or church.', 5),

  -- Discipleship Resources
  ('cc000031-0000-0000-0000-000000000000', 'bb000007-0000-0000-0000-000000000000', 'Assess new believer needs', 'Understand language, literacy level, and access to technology.', 1),
  ('cc000032-0000-0000-0000-000000000000', 'bb000007-0000-0000-0000-000000000000', 'Select appropriate resources', 'Choose digital, audio, or print discipleship materials in local language.', 2),
  ('cc000033-0000-0000-0000-000000000000', 'bb000007-0000-0000-0000-000000000000', 'Distribute resources', 'Share via app, WhatsApp, SD card, or in person.', 3),
  ('cc000034-0000-0000-0000-000000000000', 'bb000007-0000-0000-0000-000000000000', 'Follow up and coach', 'Regular check-ins to answer questions and encourage growth.', 4),
  ('cc000035-0000-0000-0000-000000000000', 'bb000007-0000-0000-0000-000000000000', 'Connect to local church or group', 'Introduce new believer to ongoing community for long-term discipleship.', 5);


-- ============================================================
-- STEP TOOLS
-- ============================================================
insert into step_tools (step_id, tool_id, role, notes, recommended_level) values
  -- Bible Translation steps
  ('cc000002-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000000', 'Primary translation tool', 'Core tool for all translation work', 'recommended'),
  ('cc000002-0000-0000-0000-000000000000', 'aa000021-0000-0000-0000-000000000000', 'Language data and keyboard', 'FLEx for lexicography, Keyman for input', 'recommended'),
  ('cc000004-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000000', 'Checking and notes', 'Consultant uses Paratext for back-translation and notes', 'recommended'),
  ('cc000005-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000000', 'Final review and export', 'Export to USFM for publishing', 'recommended'),

  -- Bible App Publishing steps
  ('cc000006-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000000', 'Export translation files', 'Export USFM from Paratext', 'recommended'),
  ('cc000007-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000000', 'Primary app builder', 'Scripture App Builder is the main tool for this step', 'recommended'),
  ('cc000008-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000000', 'Testing features', 'Use SAB emulator for device testing', 'optional'),
  ('cc000009-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000000', 'Build and export', 'SAB handles APK and IPA generation', 'recommended'),
  ('cc000010-0000-0000-0000-000000000000', 'aa000003-0000-0000-0000-000000000000', 'API distribution', 'Submit to DBP for broad API access', 'optional'),
  ('cc000010-0000-0000-0000-000000000000', 'aa000004-0000-0000-0000-000000000000', 'YouVersion submission', 'Submit via YouVersion partner program', 'recommended'),
  ('cc000010-0000-0000-0000-000000000000', 'aa000025-0000-0000-0000-000000000000', 'Licensing support', 'Biblica/ABS for rights assistance', 'optional'),

  -- Audio Bible steps
  ('cc000012-0000-0000-0000-000000000000', 'aa000006-0000-0000-0000-000000000000', 'Recording software', 'Audacity for simple recording setups', 'recommended'),
  ('cc000013-0000-0000-0000-000000000000', 'aa000006-0000-0000-0000-000000000000', 'Recording and review', 'Record and immediately review each chapter', 'recommended'),
  ('cc000013-0000-0000-0000-000000000000', 'aa000007-0000-0000-0000-000000000000', 'Professional recording', 'Adobe Audition for professional studio quality', 'optional'),
  ('cc000014-0000-0000-0000-000000000000', 'aa000006-0000-0000-0000-000000000000', 'Basic editing', 'Noise removal and leveling in Audacity', 'recommended'),
  ('cc000014-0000-0000-0000-000000000000', 'aa000007-0000-0000-0000-000000000000', 'Professional mastering', 'Adobe Audition for broadcast-quality mastering', 'optional'),
  ('cc000015-0000-0000-0000-000000000000', 'aa000005-0000-0000-0000-000000000000', 'FCBH distribution', 'Submit to FCBH for global audio distribution', 'recommended'),
  ('cc000015-0000-0000-0000-000000000000', 'aa000022-0000-0000-0000-000000000000', 'Offline device loading', 'Proclaimer for oral communities without phones', 'optional'),
  ('cc000015-0000-0000-0000-000000000000', 'aa000023-0000-0000-0000-000000000000', 'Radio distribution', 'Partner with radio organizations for broadcast', 'optional'),

  -- Jesus Film steps
  ('cc000017-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000000', 'Script translation', 'Paratext if working from Scripture text for script', 'optional'),
  ('cc000019-0000-0000-0000-000000000000', 'aa000006-0000-0000-0000-000000000000', 'Audio recording', 'Audacity for recording voice tracks', 'recommended'),
  ('cc000019-0000-0000-0000-000000000000', 'aa000007-0000-0000-0000-000000000000', 'Professional recording', 'Adobe Audition for studio quality dubbing', 'optional'),
  ('cc000020-0000-0000-0000-000000000000', 'aa000007-0000-0000-0000-000000000000', 'Audio mixing', 'Adobe Audition for mixing dubbed audio with film', 'recommended'),
  ('cc000020-0000-0000-0000-000000000000', 'aa000019-0000-0000-0000-000000000000', 'Video editing', 'CapCut or DaVinci Resolve for final film assembly', 'optional'),

  -- M2M Campaign steps
  ('cc000022-0000-0000-0000-000000000000', 'aa000019-0000-0000-0000-000000000000', 'Video creation', 'Edit film clips or create video ads', 'recommended'),
  ('cc000022-0000-0000-0000-000000000000', 'aa000020-0000-0000-0000-000000000000', 'Graphic design', 'Create image ads and social graphics', 'recommended'),
  ('cc000023-0000-0000-0000-000000000000', 'aa000018-0000-0000-0000-000000000000', 'Response form', 'Tally or Typeform for collecting seeker info', 'recommended'),
  ('cc000024-0000-0000-0000-000000000000', 'aa000010-0000-0000-0000-000000000000', 'Facebook/Instagram ads', 'Meta Ads Manager for social media campaigns', 'recommended'),
  ('cc000024-0000-0000-0000-000000000000', 'aa000011-0000-0000-0000-000000000000', 'Google Ads', 'Google Search and Display for intent-based reach', 'optional'),
  ('cc000025-0000-0000-0000-000000000000', 'aa000018-0000-0000-0000-000000000000', 'Data collection', 'Forms collect and organize responses', 'recommended'),
  ('cc000025-0000-0000-0000-000000000000', 'aa000024-0000-0000-0000-000000000000', 'Automated first response', 'ManyChat bot for immediate Messenger follow-up', 'optional'),

  -- Chat follow-up steps
  ('cc000026-0000-0000-0000-000000000000', 'aa000012-0000-0000-0000-000000000000', 'Primary chat platform', 'WhatsApp for most Global South contexts', 'recommended'),
  ('cc000026-0000-0000-0000-000000000000', 'aa000013-0000-0000-0000-000000000000', 'Secure messaging', 'Telegram for sensitive or restricted contexts', 'optional'),
  ('cc000027-0000-0000-0000-000000000000', 'aa000012-0000-0000-0000-000000000000', 'Initiate chat', 'WhatsApp Business for organized outreach', 'recommended'),
  ('cc000028-0000-0000-0000-000000000000', 'aa000017-0000-0000-0000-000000000000', 'Gospel sharing tool', 'GodTools for structured Gospel presentations', 'recommended'),
  ('cc000030-0000-0000-0000-000000000000', 'aa000012-0000-0000-0000-000000000000', 'Ongoing connection', 'WhatsApp group for community connection', 'recommended'),

  -- Discipleship steps
  ('cc000032-0000-0000-0000-000000000000', 'aa000015-0000-0000-0000-000000000000', 'Free discipleship content', 'Discipleship.org for starter resources', 'recommended'),
  ('cc000032-0000-0000-0000-000000000000', 'aa000016-0000-0000-0000-000000000000', 'Illustrated books', 'Bloom for local language illustrated materials', 'optional'),
  ('cc000033-0000-0000-0000-000000000000', 'aa000012-0000-0000-0000-000000000000', 'WhatsApp distribution', 'Share PDFs and audio via WhatsApp', 'recommended'),
  ('cc000033-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000000', 'Scripture app', 'Scripture App Builder app for Bible access', 'recommended'),
  ('cc000034-0000-0000-0000-000000000000', 'aa000014-0000-0000-0000-000000000000', 'Disciple tracking', 'ChurchSuite for tracking follow-up and growth', 'optional'),
  ('cc000035-0000-0000-0000-000000000000', 'aa000014-0000-0000-0000-000000000000', 'Church management', 'ChurchSuite for connecting to local church', 'optional');


-- ============================================================
-- WORKFLOW LINKS (the graph edges)
-- ============================================================
insert into workflow_links (source_workflow_id, target_workflow_id, relationship_type, description) values
  -- Bible Translation feeds into many workflows
  ('bb000001-0000-0000-0000-000000000000', 'bb000002-0000-0000-0000-000000000000', 'feeds_into', 'Completed translation text is packaged into a Bible app'),
  ('bb000001-0000-0000-0000-000000000000', 'bb000003-0000-0000-0000-000000000000', 'feeds_into', 'Approved translation is recorded as audio Bible'),
  ('bb000001-0000-0000-0000-000000000000', 'bb000004-0000-0000-0000-000000000000', 'feeds_into', 'Translation provides dubbing script for Jesus Film/LUMO'),
  ('bb000001-0000-0000-0000-000000000000', 'bb000007-0000-0000-0000-000000000000', 'feeds_into', 'Translated Scripture becomes the basis for discipleship resources'),

  -- Bible App Publishing
  ('bb000002-0000-0000-0000-000000000000', 'bb000005-0000-0000-0000-000000000000', 'enables', 'Bible app content used in Media to Movements campaigns'),
  ('bb000002-0000-0000-0000-000000000000', 'bb000007-0000-0000-0000-000000000000', 'feeds_into', 'Bible app is a key discipleship resource'),

  -- Audio Bible
  ('bb000003-0000-0000-0000-000000000000', 'bb000002-0000-0000-0000-000000000000', 'feeds_into', 'Audio recordings added to Bible apps'),
  ('bb000003-0000-0000-0000-000000000000', 'bb000005-0000-0000-0000-000000000000', 'enables', 'Audio content used in ad campaigns and landing pages'),
  ('bb000003-0000-0000-0000-000000000000', 'bb000007-0000-0000-0000-000000000000', 'feeds_into', 'Audio Bible shared as discipleship resource'),

  -- Jesus Film Dubbing
  ('bb000004-0000-0000-0000-000000000000', 'bb000005-0000-0000-0000-000000000000', 'enables', 'Film clips become powerful ad content for M2M campaigns'),
  ('bb000004-0000-0000-0000-000000000000', 'bb000007-0000-0000-0000-000000000000', 'enables', 'Film used in discipleship settings and small groups'),
  ('bb000004-0000-0000-0000-000000000000', 'bb000006-0000-0000-0000-000000000000', 'feeds_into', 'Film viewers become seeker contacts for follow-up'),

  -- M2M Campaign
  ('bb000005-0000-0000-0000-000000000000', 'bb000006-0000-0000-0000-000000000000', 'feeds_into', 'Ad responders are handed to chat follow-up teams'),
  ('bb000005-0000-0000-0000-000000000000', 'bb000007-0000-0000-0000-000000000000', 'enables', 'Converts from campaigns need discipleship resources'),

  -- Chat Follow-up
  ('bb000006-0000-0000-0000-000000000000', 'bb000007-0000-0000-0000-000000000000', 'feeds_into', 'New believers from chat need discipleship resources and community'),

  -- Cross-connections
  ('bb000003-0000-0000-0000-000000000000', 'bb000004-0000-0000-0000-000000000000', 'alternative_to', 'Both produce heart-language audio content for communities'),
  ('bb000002-0000-0000-0000-000000000000', 'bb000003-0000-0000-0000-000000000000', 'enables', 'Bible app can host audio Bible recordings');
