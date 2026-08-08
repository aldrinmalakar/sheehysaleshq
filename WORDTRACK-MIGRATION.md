# Canonical Wordtrack Migration

The Behavior Funnel is the canonical customer-response model for Sales HQ.

Customer-facing wordtracks that represent a specific customer behavior belong in Funnel data. Other pages should consume those scenarios rather than maintain a second version of the same call, voicemail, SMS, email or video script.

## Data layout

- `funnel-data.js` contains the core behavior funnel and shared lifecycle scenarios.
- `funnel-lead-data.js` extends that model with exact fresh-lead contact outcomes and Owner / Outbound scenarios.
- `funnel-lead-ops.js` contains operational UI only: lead timing, available-channel controls, DriveCentric delivery follow-up and attempt logging. It should not become another wordtrack library.
- `wordtracks.js` is the compatibility adapter for SMS Library, Email Library and Reconnect while those older surfaces still contain local templates.

## Phase 1

The first migration made Funnel authoritative for exact overlaps in the SMS Library and Email Library, including:

- Fresh lead
- Day-one no response
- Final no-response attempt
- Price-first shopper
- Payment / APR inquiry
- Trade-value inquiry
- Credit concern
- Family / decision maker
- Competitor shopping
- Appointment confirmation
- No-show
- Left with proposal
- Requested vehicle sold
- Post-sale check-in

Reconnect keeps its richer age-aware call coaching. The exact `Saw numbers, then left` overlap can use Funnel for the shorter channel messages on newer leads.

Generic test-drive follow-up stays local until the customer behavior is known. A customer who loved the drive, is unsure after the drive and rejected the vehicle are three different Funnel behaviors and should not be collapsed into one generic script.

## Phase 2: Leads merged into Funnel

The standalone Leads workflow has been retired. `leads.html` now redirects to Funnel so there is only one place to decide what to say next.

Lead-specific operational features were moved into Funnel rather than discarded:

- Lead-arrival timing and urgency cue
- Phone / email / text availability
- Exact first-contact outcomes
- DriveCentric video delivery and cross-channel heads-up
- Existing `shq_lead_log_v1` attempt history

Exact lead-contact wordtracks now live in `funnel-lead-data.js`:

- Text-only fresh lead
- First call went to voicemail
- First call had no voicemail available
- Bad number / wrong person

The same Funnel model now includes an `Owner / Outbound` stage for program-manifest work:

- First owner contact
- No answer
- Owner wants a real value
- Call later
- Not interested

The outbound manifest itself lives on Programs and hands the selected owner into Funnel instead of recreating a call workspace.

## Migration rule

Do not add a second customer-facing wordtrack when an exact behavior already exists in Funnel. Improve the canonical Funnel scenario and map the other surface to it.

Do not force a mapping merely because two scripts sound similar. A mapping is valid only when the customer behavior, sales objective and next move are materially the same.

Specialty templates can remain local until an exact Funnel behavior exists. This protects useful coverage while the refactor continues.
