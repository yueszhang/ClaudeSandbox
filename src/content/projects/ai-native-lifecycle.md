---
title: 'An Agent-Driven Delivery Lifecycle'
tagline: 'Designing which stages agents own, where humans approve, and how the whole thing stays auditable under regulated change control.'
company: 'Deloitte Digital'
role: 'AI-Native Delivery Lead'
client: 'A financial services firm'
industry: 'Financial Services'
period: '2025 — Present'
sortDate: '2025-08-03'
teamSize: 'Six agent roles across the lifecycle'
summary: 'Designed an agent-driven software delivery lifecycle for a financial services client: which stages agents own, where humans must approve, and how it stays auditable under a regulated change-control regime.'
themes:
  - 'AI-Native Delivery'
  - 'AI Enablement'
skills:
  - 'Agent architecture'
  - 'Control design'
  - 'Regulated change control'
  - 'Toolchain strategy'
metrics:
  - value: '6'
    label: 'Agent roles across the lifecycle'
  - value: '~15'
    label: 'Control objectives mapped'
  - value: '12 wk'
    label: 'Foundation plan across 7 phases'
featured: true
---

I designed an agent-driven software delivery lifecycle for a financial services
client. Six agent roles spanning plan, develop, architect, test, deploy and
monitor, with named human approval gates at every stage boundary.

The hard part was not deciding what agents could do. It was proving the result
would survive an audit.

## The constraint

Regulated change control assumes a human is accountable for every change, and
that you can reconstruct after the fact who approved what and on what basis. An
agent that writes and merges its own code satisfies neither.

So the design question inverted. Rather than asking how much of the lifecycle
agents could take, we asked what evidence a change-board would need in order to
accept work an agent had touched, then built backwards from that.

## The principles

Nine of them governed the architecture. The ones that did the most work:

- **Loosely coupled agents with event-based handoffs**, so no agent depends on
  another's internals
- **Single-responsibility scoping** for each agent, which keeps failures
  diagnosable
- **Mandatory human-in-the-loop approval gates**, not advisory ones
- **Per-agent auditable identity** and least-privilege access, so every action
  traces to a specific actor
- **Model-agnostic workflow logic**, kept portable rather than bound to one
  vendor's API

That last one was a deliberate bet. Binding the orchestration to a single
provider's API would have been faster to build and would have made the whole
thing a migration project the first time pricing or capability shifted.

We also chose to extend the existing toolchain instead of replacing it. A
parallel toolchain means parallel audit surface, and the client already had
change control that worked.

## Human gates

Five stages, each with a named human approval: architect approve, peer review,
test lead approve, change-board approve.

Naming the approver by role rather than by step is what makes this auditable. "A
human reviewed it" is not a control. "The test lead approved it, here is the
artifact" is.

Underneath sits a control matrix of roughly **15 control objectives**, each
mapped to a risk, a control activity, a frequency, an owner, and an evidence
artifact. That mapping is the document that gets handed to an auditor.

## Prompts as production code

Agent instruction files and prompts are version-controlled and reviewed like any
other production artifact.

This sounds procedural and it settles a real argument. If a prompt changes
behavior in a regulated system, then an unreviewed prompt edit is an unreviewed
change to a production system. Treating them as config rather than code is how
teams end up unable to explain why last month's output differed from this
month's.

## Where it stands

A 12-week foundation plan across seven phases, sequenced before any of the
lifecycle goes live.

> **Draft note — did any of it ship?** This is the significant gap on this page.
> The source material has design substance and no outcome metrics of any kind.
> Is this design-stage, in pilot, or running? A reader will assume the least
> flattering answer if the page doesn't say.

> **Draft note — same client or different?** I've labeled this a financial
> services firm and kept it separate from both the investment-management
> enablement program and the earlier trading platform work. Confirm these are
> three separate clients, and tell me if any two should be merged.

## What I'd do differently

I would have taken the control matrix to the change board earlier. We designed
the architecture and then mapped controls onto it, which is the natural order
and the wrong one. The controls are the binding constraint in a regulated
environment, so they should shape the architecture rather than document it
afterward.
