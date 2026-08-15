# Canonical Wordtrack Migration

The Behavior Funnel is the canonical customer-response model for Sales HQ.

Customer-facing wordtracks that represent a specific customer behavior belong in the Funnel data stack. Other pages should consume those scenarios rather than maintain a second version of the same call, voicemail, SMS, email or video script.

## Data layout

- `funnel-data.js` contains the core behavior funnel and shared lifecycle scenarios.
- `funnel-lead-data.js` extends that model with exact fresh-lead contact outcomes and Owner / Outbound scenarios.
- `funnel-behavior-variants.js` adds channel-specific behavior variants, especially email-only handling.
- `funnel-confidence.js` is the canonical 2026 control layer. It tightens loaded Funnel scenarios around direct questions, objection isolation, choice closes and clear next-step control while preserving the verification/compliance boundaries in the base model.
- `funnel-context.js` applies the customer context model: Behavior + Channel + Distance + Interaction Style + Decision Structure + Buying Priority.
- `funnel-remote-numbers.js` handles long-distance remote-number workflows without guessing finance outcomes.
- `funnel-unavailable-options.js` handles verified replacement paths when the original vehicle is no longer available.
- `funnel-warm-confidence.js` is the final customer-facing Funnel voice layer. It adds human warmth to the existing control structure without weakening the close or changing factual/compliance boundaries.
- `funnel-lead-ops.js` contains operational UI only: lead timing, available-channel controls, DriveCentric delivery follow-up and attempt logging. It should not become another independent wordtrack library.
- `wordtracks.js` is the compatibility adapter for SMS Library, Email Library and Reconnect while those older surfaces still contain local templates.
- `sales-voice.js` applies the same warm-confidence standard to current specialty communication surfaces that still own local scripts, including objections, reconnect, after-sale, survey and sister-store messaging.

The Funnel load order matters: base data and extensions first, then confidence/context/remote/specialized behavior layers, then `funnel-warm-confidence.js` as the final voice pass. Consumers should read the final loaded `SHQFunnel` model rather than copy an earlier version of a script.

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

The same Funnel model includes an `Owner / Outbound` stage for program-manifest work:

- First owner contact
- No answer
- Owner wants a real value
- Call later
- Not interested

The outbound manifest itself lives on Programs and hands the selected owner into Funnel instead of recreating a call workspace.

## Warm-confidence language standard

The final customer-facing voice uses one consistent sequence:

**Warm human opening -> direct truth -> isolate the real issue -> prescribe the next step -> choice or commitment close -> stop.**

Warmth is not passivity. It means the customer feels heard, respected and protected from wasted time while the salesperson still leads the process.

Prefer language such as:

- `That makes sense.`
- `I appreciate you being straight with me.`
- `You are asking the right question.`
- `I want to make this easy.`
- `Let us get specific.`
- `Which one matters first?`
- `If I solve that one piece, are you ready to move forward?`

Avoid habitual filler and weak exits such as:

- `just checking in`
- `circling back`
- `if you want`
- `would you be open to`
- `let me know`
- repeated `fair?` / `sound good?`
- fake `no pressure` language used as a substitute for actually respecting the customer

Also avoid manufactured sales theater:

- fake urgency or scarcity
- unsupported `it will be gone` claims
- unverified `I can hold it` promises
- invented trade-market claims
- invented incentive or program claims
- fake `you are the first person I called` hooks

Confidence does not override accuracy. The model still must not invent inventory status, price, payment, APR, approval, incentives, transfer status or other deal-specific facts.

## Current-page voice rule

Funnel remains authoritative when a behavior is mapped. The SMS Library, Email Library and Reconnect should inherit the warmed canonical Funnel scenario rather than replace it locally.

Specialty templates that do not yet map to an exact Funnel behavior can remain local, but `sales-voice.js` keeps their current customer-facing language aligned with the same standard and removes unsupported market/urgency claims where they appear.

The retired legacy workspace is preserved as a historical/reference surface and is not a source of current customer-facing language.

## Migration rule

Do not add a second customer-facing wordtrack when an exact behavior already exists in Funnel. Improve the canonical Funnel scenario/layer and map the other surface to it.

Do not force a mapping merely because two scripts sound similar. A mapping is valid only when the customer behavior, sales objective and next move are materially the same.

Specialty templates can remain local until an exact Funnel behavior exists. This protects useful coverage while the refactor continues.
