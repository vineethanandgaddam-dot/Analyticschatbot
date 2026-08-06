# Case Study: AI-Powered Pharma Analytics Platform

*How I designed and shipped a natural-language analytics tool for pharma warehouse data — with LLM guardrails and production-grade observability built in from day one.*

---

## Problem

Pharma operations and client-success teams needed answers from a large BigQuery warehouse (medicines, clients, side effects, therapeutic classes) on a daily basis — things like *"how many habit-forming medicines does each client have?"* or *"compare medicine counts across clients."* Every one of those questions required an analyst to write and run SQL by hand. That's slow, doesn't scale across clients, and creates a single point of failure when the analyst is unavailable.

The goal: let business users ask questions in plain English and get a trustworthy, auditable answer back in seconds — without exposing the warehouse to unsafe or unauthorized queries.

## Solution

I built a full-stack NL-to-SQL analytics assistant:

- **Angular** frontend for the chat-style query interface, saved reports, and history
- **FastAPI** backend that orchestrates the pipeline
- **Groq-hosted LLM** to translate the user's question into intent, then into SQL
- **Custom SQL guardrails**, including a dedicated rule to detect and block queries that risk exposing PII, before any SQL touches BigQuery
- **Google BigQuery** as the warehouse
- Every response returns three things together: a plain-English answer, a chart, and the exact SQL that ran — so the result is never a black box

## Key Engineering Decisions

**Why guardrails before execution, not after.** Because the LLM generates arbitrary SQL, I didn't want to trust its output directly against a production warehouse. Every generated query passes through validation — including a PII-detection check — before execution. This is enforced as its own layer, not baked into the prompt, so it can't be bypassed by prompt injection alone.

**Why separate the LLM step from the SQL-generation step in monitoring.** Early on, "slow responses" was too vague a signal to debug. I split New Relic tracking into distinct AI Monitoring and AI Observability dashboards so I could see, independently, whether latency was coming from the LLM call (avg **654 ms**) or from SQL generation (avg **465 ms**) — versus the end-to-end pipeline (avg **~4.0s**). That split turned "the app feels slow" into an answerable engineering question.

**Why full SQL transparency in the UI.** For a regulated domain like pharma, "trust the AI" isn't good enough. Showing the generated SQL alongside every answer means a data-literate user can verify the query logic themselves, and it made debugging incorrect answers dramatically faster during development.

**Why invest in observability before scale, not after.** Rather than bolting on monitoring later, I stood up three New Relic dashboards (AI Monitoring, AI Observability, and standard APM) plus distributed tracing and six NRQL-backed alert conditions — covering AI request failures, high guardrail activity, high LLM latency, high query response time, high SQL generation time, and PII request detection — routed through an automated workflow to ServiceNow and email. This mirrors how I'd want a production AI feature instrumented from day one, not retrofitted after an incident.

## Architecture

```
User → Angular (Vercel) → FastAPI (Cloud Run) → Groq LLM → SQL Guardrails → BigQuery
                                                                    │
                                                    AI Summary + Chart + SQL → back to user
```

Deployment is intentionally split across two clouds: Vercel for the frontend (fast static/edge delivery) and Google Cloud Run for the backend (serverless, scales to zero, colocated with BigQuery).

## Results (from New Relic telemetry)

| Metric | Value |
|---|---|
| Avg end-to-end response time | ~4.0s |
| Avg LLM latency | 654 ms |
| Avg SQL generation latency | 465 ms |
| Apdex score | 0.59 (0.5 threshold) |
| Error rate | 1.52% avg |
| Guardrail/blocked events | 0 during monitored sessions |
| Alert conditions configured | 6 |

*These figures come from development/testing sessions captured through New Relic, not large-scale production traffic — the instrumentation itself is the point: the pipeline is fully observable end-to-end, ready to scale with real usage.*

## Lessons Learned

- **Splitting latency by pipeline stage early saves debugging time later.** If I'd only tracked total response time, I wouldn't have known whether to optimize the prompt, the model choice, or the SQL-generation logic.
- **Guardrails are a design decision, not an afterthought.** Deciding *before* writing the LLM integration that generated SQL would never touch BigQuery unvalidated shaped the whole backend structure.
- **Observability is cheap to build in early and expensive to retrofit.** Standing up dashboards and alerts alongside the feature — not after a production incident — meant I could already see (and demonstrate) system health from day one.

## What I'd Do Next

See the [Roadmap](README.md#-roadmap) in the README — authentication, streaming responses, and multi-turn conversational memory are the next priorities, since the current version treats each question independently.
