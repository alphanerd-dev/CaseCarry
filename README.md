# CaseCarry

> **Don't tell your story again.**
>
> A citizen-controlled continuity layer for unresolved cases.

[![Hackathon](https://img.shields.io/badge/OSF%20%C3%97%20Andela-Hackathon%202026-2457C5)](https://github.com/alphanerd-dev/CaseCarry)
[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Built with AI](https://img.shields.io/badge/AI-Gemini%20%7C%20OpenAI%20%7C%20Grok-18794E)](#ai-architecture)

**Live prototype:** https://casecarry.ai.studio  
**Repository:** https://github.com/alphanerd-dev/CaseCarry

---

## The problem

When a citizen reports a problem and the first legitimate pathway does not resolve it, the case often becomes fragmented across emails, screenshots, bills, receipts, reference numbers, letters and personal recollection.

Moving to the next legitimate pathway can mean starting the story again:

- What happened?
- When did it happen?
- Who was contacted?
- What did they say?
- What evidence supports that?
- What has already been tried?
- What exactly remains unresolved?

This creates a **continuity gap** between civic systems.

CaseCarry focuses on that moment:

> **"I already tried to get help. It didn't resolve the issue. I need to carry the record forward."**

CaseCarry is therefore **not another complaint portal**. It is a carry-forward layer designed to turn fragmented evidence from an unresolved case into a structured, user-reviewed record that can be understood by another legitimate recipient.

---

## What CaseCarry does

CaseCarry guides a citizen through an eight-stage workflow:

1. **Context** — describe what happened after the first report.
2. **Evidence** — add documents, screenshots, receipts, PDFs, images or pasted messages.
3. **Reconstruction** — use AI to build a draft chronology from the available evidence.
4. **Verification** — review dates, claims, sources and provenance.
5. **Unresolved issue** — define what remains unresolved and what remedy is being sought.
6. **Pathways** — identify potentially relevant next pathways using the case facts, jurisdiction and available pathway information.
7. **Privacy** — decide what is included or kept private.
8. **Carry-forward bundle** — produce a structured case record that can be exported and used outside CaseCarry.

The prototype deliberately keeps the citizen in control. AI produces a draft and analysis; the underlying evidence remains the authority.

---

## Core innovation

The key mechanism is the combination of:

**Continuity + provenance + gap detection + pathway intelligence + portability**

Rather than asking a citizen to submit another complaint, CaseCarry reconstructs the history of what has already happened.

### Provenance-aware records

Important case information is separated into categories such as:

- **Source-backed** — supported by an uploaded document or record.
- **Citizen-stated** — supplied by the user but not independently supported by an uploaded source.
- **CaseCarry inferred** — an interpretation derived from the available evidence.
- **Needs review** — ambiguous or incomplete information.
- **Sources conflict** — two or more records do not agree.

The system is designed so that AI interpretation does not silently become fact.

### Gap and contradiction detection

CaseCarry can surface issues such as:

- missing complaint references;
- missing institutional responses;
- conflicting dates;
- an institution stating that a matter was resolved while the available evidence does not establish the resolution;
- missing documents needed for a potential next pathway.

### Dynamic pathway discovery

The prototype can analyse the case context, evidence, institution, sector, jurisdiction, previous outcome and unresolved issue to identify potentially relevant pathways.

Pathway records include:

- jurisdiction;
- organisation/authority;
- why the pathway may be relevant;
- supporting case facts;
- eligibility information;
- required documents;
- suggested procedural steps;
- official source;
- source-check date;
- uncertainties and warnings;
- confidence and status.

Pathway guidance is deliberately presented as **potentially relevant information, not binding legal advice**. Users remain responsible for reviewing the pathway and deciding whether to proceed.

### Portable output

The resulting record is designed to remain useful without requiring the receiving organisation to have a CaseCarry account.

The export can contain:

- case summary;
- unresolved problem;
- prior steps;
- chronology;
- evidence index;
- contradictions;
- missing information;
- selected pathways;
- user-approved supporting material.

---

## Prototype scenario

The included fictional demonstration uses an **Ogun State electricity-service dispute**.

The demonstration case shows how a citizen's scattered records can be turned into:

**Scattered evidence → reconstructed chronology → provenance review → unresolved gap → potential pathway → carry-forward record**

The demonstration data is fictional and is intended only to show the workflow.

---

## Trust, verification and safety

Trust is a core product requirement, not a cosmetic feature.

### Source-first design

CaseCarry preserves the distinction between the original source material and AI-generated interpretation.

Important reconstructed events contain source references and, where available, source excerpts.

### User verification

The reconstruction is a draft.

Before the carry-forward record is created, the citizen can:

- confirm an event;
- edit an event;
- delete an event;
- dispute an event;
- add missing context;
- inspect the supporting source.

### Contradictions are surfaced

CaseCarry does not intentionally resolve conflicting records by guessing.

Where sources disagree, the system can mark the conflict for review.

### No automatic submission

CaseCarry does not automatically send a complaint, petition or case bundle to an institution.

The user decides what to export and share.

### Privacy controls

Evidence can be marked private so it remains excluded from the carry-forward bundle.

The prototype also includes local redaction utilities for common sensitive fields such as:

- phone numbers;
- email addresses;
- account/meter identifiers;
- physical addresses.

### Safety-sensitive cases

The system contains safety indicators for potentially high-risk situations. CaseCarry is not an emergency-response service and should not be treated as a substitute for emergency or professional support.

---

## Designed for African operating conditions

The prototype was designed around the operating constraints in the hackathon brief.

### Low bandwidth

A **Low-Bandwidth Mode** is available. It reduces rich visual effects and prioritises lightweight representations.

### Basic/mobile devices

The workflow is responsive and supports mobile evidence collection, including camera capture for photographing paper documents.

### Accessibility

The interface uses:

- clear step-based navigation;
- readable labels;
- explicit provenance text rather than relying only on colour;
- simple action-oriented language;
- progressive disclosure of detailed evidence;
- keyboard/button-based interaction patterns.

### Multilingual access

The prototype currently includes interface translations for:

- English
- Yoruba
- Hausa
- Igbo
- Nigerian Pidgin

The architecture is designed so additional languages can be added through the translation layer.

### Local relevance

Pathway information is associated with jurisdiction and case context rather than treating civic procedures as universal.

The prototype includes Nigeria-focused pathway records and selected comparative pathway examples.

### Clear next steps

The pathway stage explains:

- why a pathway may be relevant;
- what information supports the match;
- what documents may be required;
- what uncertainties remain;
- where the procedural source came from;
- when that source was checked.

---

## AI architecture

CaseCarry uses a provider abstraction so the application does not depend entirely on one AI model.

### Provider order

The default reconstruction failover order is:

1. **Google Gemini**
2. **OpenAI**
3. **xAI Grok**
4. **Deterministic baseline**

If a configured AI provider fails or is unavailable, the system can move to the next available provider.

The deterministic provider is an important safeguard: the prototype can still create a baseline reconstruction directly from the available case information instead of simply failing.

### Current provider configuration

| Provider | Primary model configured in prototype | Role |
|---|---|---|
| Google Gemini | `gemini-3.8-flash` | Primary reconstruction provider |
| OpenAI | `gpt-4o-mini` | First AI fallback |
| xAI Grok | `grok-2-latest` | Second AI fallback |
| Deterministic | `casecarry-deterministic-v1` | Baseline/final fallback |

Model names and provider availability may change over time; deployment configuration should be verified before production use.

### AI responsibilities

AI can assist with:

- extracting case facts;
- reconstructing chronology;
- identifying contradictions;
- identifying missing information;
- structuring unresolved issues;
- matching case facts to potentially relevant pathways;
- generating explanations for pathway relevance.

AI is **not** treated as the authoritative source of civic or legal truth.

---

## Pathway architecture

Pathway discovery follows a layered approach.

### 1. Extract case facts

The system extracts structured information such as:

- country;
- state/locality;
- institution;
- institution type;
- sector;
- issue type;
- previous reporting channel;
- previous response;
- response status;
- unresolved issue;
- requested remedy;
- available documents;
- urgency/safety indicators.

Each extracted fact can retain provenance back to the case evidence.

### 2. Identify potential pathways

AI can generate candidate pathways based on the structured case context.

### 3. Apply pathway records

The prototype also contains a verified pathway cache containing selected organisations and procedures, including Nigeria-focused examples such as:

- Ogun State Electricity Regulatory Commission;
- Nigerian Electricity Regulatory Commission;
- Federal Competition and Consumer Protection Commission;
- Central Bank of Nigeria consumer protection;
- Nigerian Communications Commission;
- Public Complaints Commission.

### 4. Explain uncertainty

Each pathway can carry:

- confidence;
- source;
- source-check date;
- uncertainties;
- warnings;
- eligibility assumptions.

This is intentionally different from presenting an AI-generated answer as an unquestionable "correct legal route."

---

## Data and privacy model

The prototype is designed around citizen control.

Case drafts can be saved locally in the browser using **IndexedDB**.

The interface describes local cases as:

> Stored privately in this browser. Never sent to cloud accounts.

Users can choose whether evidence is included in the carry-forward bundle or retained privately on the device.

For the hackathon demonstration, fictional/synthetic case material is preferred over collecting highly sensitive real-world cases.

### Important prototype limitation

The application is a proof of concept, not a production-grade secure civic records system.

Before deployment with sensitive cases, it would require a full security review covering:

- encryption;
- server-side storage;
- authentication;
- access control;
- audit logs;
- key management;
- retention/deletion policies;
- secure AI-provider handling;
- data residency;
- threat modelling;
- safeguarding procedures.

---

## Technology stack

- **Next.js 15**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Google GenAI SDK**
- **Lucide React**
- **Motion**
- **IndexedDB/local browser storage**
- AI provider abstraction for Gemini, OpenAI and Grok

---

## Project structure

A simplified view of the main architecture:

```text
CaseCarry/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   └── pathways/
│   └── page.tsx
│
├── components/
│   ├── LandingView.tsx
│   ├── CaseEntryView.tsx
│   ├── EvidenceCollectionView.tsx
│   ├── ReconstructionView.tsx
│   ├── VerificationView.tsx
│   ├── UnresolvedIssueView.tsx
│   ├── PathwayGuidanceView.tsx
│   ├── PrivacyReviewView.tsx
│   ├── CarryForwardBundleView.tsx
│   └── ExportView.tsx
│
├── lib/
│   ├── ai/
│   │   ├── config.ts
│   │   ├── service.ts
│   │   └── providers/
│   ├── pathways/
│   │   ├── discoveryEngine.ts
│   │   ├── factExtractor.ts
│   │   └── cache.ts
│   ├── demoData.ts
│   ├── i18n.ts
│   ├── storage.ts
│   └── pdfExtract.ts
│
└── types/
    └── case.ts
```

---

## Run locally

### Requirements

- Node.js
- npm

### Install

```bash
git clone https://github.com/alphanerd-dev/CaseCarry.git
cd CaseCarry
npm install
```

### Environment variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=
OPENAI_API_KEY=
XAI_API_KEY=
APP_URL=
```

Only configure the providers you intend to use. The deterministic baseline does not require an API key.

**Never commit API keys or other secrets to GitHub.**

### Development

```bash
npm run dev
```

The development server runs on port 3000.

### Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## How to test the prototype

### Option 1 — Explore the fictional demo

Open CaseCarry and choose:

**Explore fictional demo case**

The prototype loads a fictional Ogun electricity dispute with sample evidence and allows the complete workflow to be demonstrated without entering sensitive information.

### Option 2 — Start a fresh case

Choose:

**Start a case now**

Then:

1. Select what happened after the previous report.
2. Enter the institution/provider.
3. Add the reference number if available.
4. Describe the unresolved problem.
5. Add evidence.
6. Run reconstruction.
7. Review and verify the timeline.
8. Define what remains unresolved.
9. Explore potential pathways.
10. Review privacy settings.
11. Generate the carry-forward record.
12. Export the result.

---

## What this prototype does not claim

CaseCarry is intentionally bounded.

It is **not**:

- a government complaint portal;
- a replacement for an institution's case-management system;
- an emergency-response service;
- a legal representative;
- a court or tribunal;
- an authority that determines legal rights;
- an autonomous escalation agent;
- a guarantee that an institution will resolve a case;
- a substitute for professional legal, medical or safety advice.

The prototype helps organise and carry forward information. The user decides what to do with the resulting record.

---

## Hackathon alignment

CaseCarry was developed for the **OSF × Andela hackathon: Information You Can Trust**.

### Primary track

**Transparency & Accountability**

The concept addresses the gap between reporting a problem and being able to carry credible information forward when the first institutional pathway does not resolve it.

### Why it fits the challenge

The hackathon brief asks for technology that makes reliable information about civic life visible, accessible and actionable, and specifically asks projects to consider trust, verification, low bandwidth, accessibility, privacy, multilingual access, local relevance and clear next steps.

CaseCarry addresses these through:

| Challenge requirement | CaseCarry approach |
|---|---|
| Trust & verification | Source-linked claims, provenance labels, user verification |
| Changing information | Pathway source + last-checked date + uncertainty |
| Low bandwidth | Low-Bandwidth Mode |
| Basic devices | Responsive UI + camera capture |
| Accessibility | Explicit labels and step-based workflow |
| Privacy | Local storage + evidence inclusion controls + redaction |
| Multilingual access | English, Yoruba, Hausa, Igbo and Nigerian Pidgin |
| Local relevance | Jurisdiction-aware pathway information |
| Clear next steps | Evidence-aware pathway discovery and handoff bundle |

The hackathon also evaluates **uniqueness, scalability, AI coding usage and presentation**. CaseCarry is designed around a mechanism that can be demonstrated in a small proof of concept while potentially extending across different civic and public-service contexts.

---

## Why this can scale

The underlying problem is not limited to electricity disputes.

The same continuity pattern can occur when a person moves between:

- utility/service complaints;
- banking and financial complaints;
- telecommunications complaints;
- public-service grievances;
- administrative complaints;
- consumer disputes;
- ombudsman processes;
- legal-aid or civic-support organisations.

The case model separates the **continuity mechanism** from the **pathway catalogue**.

That means the reconstruction and provenance workflow can remain largely consistent while pathway information changes by:

**country → state/locality → sector → institution → issue → procedural stage**

The prototype therefore treats jurisdiction-specific pathway knowledge as data rather than hard-coding the entire product around one institution.

---

## Future development

If the prototype proves useful, future versions could explore:

- stronger OCR and document understanding;
- secure encrypted storage;
- voice input and multilingual speech;
- more African languages;
- WhatsApp/SMS-friendly workflows;
- verified pathway-source monitoring;
- structured integrations with legitimate caseworkers;
- recipient-side intake formats;
- stronger redaction and sensitive-evidence handling;
- independent evaluation with civic organisations and legal-aid providers;
- interoperability standards for portable case records.

These are future directions, not claims about the current prototype.

---

## AI-assisted development

CaseCarry was developed using AI software-development tools as part of the hackathon's invention-sprint workflow.

AI assistance was used to accelerate:

- application architecture;
- UI implementation;
- TypeScript development;
- workflow components;
- AI-provider abstraction;
- provenance and verification logic;
- pathway-discovery architecture;
- multilingual interface implementation;
- privacy utilities;
- prototype iteration and debugging.

The product concept, problem framing, research direction and final design decisions were developed as part of the project process rather than treating an AI model's output as the invention itself.

---

## Demo

**Live prototype:** https://casecarry.ai.studio

For the strongest demonstration, use the fictional Ogun electricity case and show:

```text
Scattered evidence
       ↓
Case reconstruction
       ↓
Source / provenance review
       ↓
Contradiction + gap detection
       ↓
Potential next pathway
       ↓
Privacy review
       ↓
Carry-forward case bundle
```

### The core demonstration

> **A citizen should not have to start their story from zero every time the first legitimate pathway fails.**

---

## Status

**Hackathon proof of concept — September 2026**

CaseCarry is experimental software created to demonstrate the continuity mechanism and gather evidence about whether the approach is worth developing further.

---

## License

This repository is a hackathon prototype. Licensing and production-use terms should be established before external deployment or redistribution.
