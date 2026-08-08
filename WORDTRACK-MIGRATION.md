# Canonical Wordtrack Migration

`funnel-data.js` is the canonical source for customer-facing wordtracks that have been migrated.

`wordtracks.js` is the compatibility adapter. It lets the existing Leads, SMS Library, Email Library and Reconnect pages consume Funnel scenarios without rewriting those pages all at once.

## Phase 1

### SMS Library
The following existing cards now render their customer-facing copy from Funnel:

- New lead / Fast first touch -> `fresh-standard`
- No reply / Day one nudge -> `no-response-day1`
- No reply / Last touch, 1 or 2 -> `final-nudge`
- Price shopper / Real number, not a guess -> `price-first`
- Payment focused / No guessing on payment -> `payment-apr`
- Trade interest / Appraise it properly -> `trade-value`
- Credit rebuild / No judgment -> `credit-concern`
- Family decision / Bring everyone -> `decision-maker`
- Competitor compare / Straight comparison -> `competitor-shop`
- Appt confirm / You are set -> `booked`
- No-show / No worries, reschedule -> `no-show`
- Left with proposals / Same-day recap -> `left-with-numbers`
- Sold or swap / It sold, here is close -> `unit-gone`
- Post-sale / Thank you -> `sold-thankyou`

### Email Library
The equivalent core cards for new lead, no reply, price, payment, trade, credit, family decision, competitor comparison, appointment confirmation, no-show, left with proposal, sold unit and post-sale now render from the same Funnel scenarios.

Generic test-drive follow-up stays local for now because the existing library card does not establish whether the customer loved the vehicle, was unsure or decided it was the wrong fit. Those behaviors have separate Funnel scenarios and should not be collapsed.

### Leads
The first migrated direct-channel outputs are:

- Fresh-lead voicemail -> `fresh-standard`
- Email-only first email -> `fresh-email-only`
- Text-only first text -> `fresh-standard`
- DriveCentric video email notice -> `video-email-notice`
- DriveCentric video text notice -> `video-text-notice`

The Leads page keeps its multi-step coaching flow and attempt logging.

### Reconnect
Reconnect keeps its richer age-aware call coaching. For leads up to 30 days old, the duplicated quick voicemail, SMS and email outputs for "Saw numbers, then left" now come from `left-with-numbers`.

Other reconnect situations remain local until the Funnel model has an exact behavior match and, where needed, age-specific variants. In particular, "we talked, then went quiet" is not automatically treated as an in-store ghost.

## Migration rule

Do not add a second copy of a wordtrack that already exists in Funnel. Add or improve the Funnel scenario, then map the legacy surface to it in `wordtracks.js`.

Specialty templates that do not yet have a Funnel scenario remain local until they are deliberately migrated. This avoids deleting useful coverage during the refactor.
