# Phase 1 Manual Smoke Test

Use this checklist after deployment.

## SMS Library
1. Open SMS Library.
2. Find New lead / Fast first touch.
3. Confirm the message matches Funnel `fresh-standard` SMS.
4. Change customer name and vehicle fields.
5. Confirm the canonical message updates with the new values.
6. Use Copy and confirm the copied text matches the visible message.

## Email Library
1. Open Email Library.
2. Find New lead / First intro.
3. Confirm subject and body match Funnel `fresh-standard`.
4. Confirm subject capitalization and emoji convention still apply.
5. Confirm Copy body, Copy all and Open in Outlook use the visible canonical text.

## Leads
1. Select Went to voicemail and confirm the first voicemail uses Funnel `fresh-standard`.
2. Select Email only, no phone and confirm the first email uses Funnel `fresh-email-only`.
3. Select Text is the only way in and confirm the first text uses Funnel `fresh-standard`.
4. Change DriveCentric video delivery between email and text.
5. Confirm the delivery heads-up switches between `video-email-notice` and `video-text-notice`.
6. Use Copy on every migrated output and confirm it copies the visible canonical text.

## Reconnect
1. Set a lead date within the last 30 days.
2. Select Saw numbers, then left and confirm VM/SMS/email use Funnel `left-with-numbers`.
3. Select We talked a few times, then went quiet and confirm VM/SMS/email use Funnel `ghost-after-visit`.
4. Set the lead date older than 30 days and confirm the page returns to its age-aware local wording.
5. Confirm the longer call coaching remains age-aware in every case.

## Regression
1. Confirm unmatched specialty SMS and email cards still render normally.
2. Confirm search and category filters still work.
3. Confirm the UP clock still runs.
4. Confirm Funnel itself is unchanged.
