# 🚀 AI-Powered Pharma Analytics Platform

### Transform Natural Language into Secure BigQuery Analytics

**Natural Language → SQL → BigQuery → AI Insights**

---

**A production-style natural-language analytics platform that lets non-technical pharma business users query a BigQuery warehouse in plain English — with AI-generated SQL, guardrails, and full-stack observability.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Frontend-black?logo=vercel)](https://staginganalyticschatbotfrontend.vercel.app)
[![API](https://img.shields.io/badge/API-Swagger%20Docs-009485?logo=fastapi)](https://analytics-chatbot-api-165509171640.us-central1.run.app/docs)
![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)
![BigQuery](https://img.shields.io/badge/BigQuery-Google%20Cloud-4285F4?logo=googlecloud)
![Groq](https://img.shields.io/badge/Groq-LLM-F55036)
![Cloud Run](https://img.shields.io/badge/Cloud%20Run-Deployed-4285F4?logo=googlecloud)
![New Relic](https://img.shields.io/badge/New%20Relic-Observability-1CE783?logo=newrelic)

![Ask your pharma data anything — home screen](assets/hero_home.png)

---

## 📖 The Problem

Pharma warehouse teams sit on huge volumes of structured data (medicines, clients, side effects, therapeutic classes) but rely on analysts to hand-write SQL for every question. That creates a bottleneck: business stakeholders wait on engineering for answers as simple as *"which client has the most habit-forming medicines?"*

## 💡 The Solution

This platform turns that bottleneck into a chat box. A user types a question in plain English, and the system:

1. **Understands the request** with a Groq-hosted LLM
2. **Generates BigQuery SQL** from the parsed intent
3. **Validates the SQL** against custom guardrails (including a dedicated PII-detection rule) before anything executes
4. **Runs the query** against Google BigQuery
5. **Summarizes the result** in plain language and renders an **interactive chart**
6. **Shows the generated SQL** for full transparency — nothing is a black box

> **Example:** *"Show medicine count by client"* → generates and runs a `JOIN` + `GROUP BY` query across the clients and medicines tables, returns a bar chart, a plain-English summary, and the exact SQL that ran.

![Query result: direct answer, key insight, and pipeline confirmation](assets/query_asked.png)

---

## 🌐 Live Demo

| | |
|---|---|
| **Frontend** | [staginganalyticschatbotfrontend.vercel.app](https://staginganalyticschatbotfrontend.vercel.app) |
| **Backend API** | [analytics-chatbot-api-...run.app](https://analytics-chatbot-api-165509171640.us-central1.run.app) |
| **API Docs (Swagger)** | [/docs](https://analytics-chatbot-api-165509171640.us-central1.run.app/docs) |

---

## 📊 Measured from production telemetry (New Relic)

These numbers come directly from the live AI Monitoring / AI Observability dashboards wired up for this project — not estimates.

| Metric | Value |
|---|---|
| Avg end-to-end response time (question → answer) | **~4.0s** (4.03k ms) |
| Avg LLM response latency | **654 ms** |
| Avg SQL generation latency | **465 ms** |
| Apdex score | **0.59** (0.5 threshold) |
| Error rate | **1.52%** avg |
| Guardrail / blocked-request events | **0** during monitored sessions |
| Custom NRQL alert conditions configured | **6** (failures, latency, guardrails, PII) |

*Captured over New Relic's 6-month monitoring window during development/testing — see [Monitoring & Observability](#-monitoring--observability) below.*

---

## ✨ Key Features

- 🧠 **Natural Language → SQL** — Groq LLM translates business questions into BigQuery SQL
- 🔒 **SQL Guardrails + PII Detection** — a dedicated alert condition flags any query that risks exposing PII before it runs
- 📊 **Interactive Visualizations** — auto-generated bar charts from query results (switchable chart types)
- 📋 **AI Business Summaries** — plain-English "Direct Answer" + "Key Insight" for every query
- 📜 **Full SQL Transparency** — every generated query is shown and copyable
- ☁️ **Cloud-Native Deployment** — Angular on Vercel, FastAPI on Cloud Run
- 📈 **Production-Grade Observability** — 3 New Relic dashboards, distributed tracing, 6 alert conditions, automated ServiceNow + email incident routing
- 💾 **Saved Reports & History** — users can save and revisit past analyses
- 📱 **Responsive UI**

---

## 🏗️ Architecture

```
User
 │
 ▼
Angular (Vercel)
 │  REST
 ▼
FastAPI (Google Cloud Run)
 │
 ▼
Groq LLM  ──▶  SQL Guardrails (incl. PII detection)
 │
 ▼
Google BigQuery
 │
 ▼
AI Summary + Chart + Generated SQL
 │
 ▼
Angular Dashboard
```

Every request is traced end-to-end through New Relic APM + distributed tracing, and every LLM/SQL-generation step is monitored separately for latency and failure rate.

![Generated SQL panel with full transparency](assets/generated_sql_full.png)

---

## 🎯 Engineering Decisions

| Technology | Why it was chosen |
|------------|-------------------|
| **Angular** | Enterprise-ready framework with reusable components, strong TypeScript support, and scalable architecture. |
| **FastAPI** | High-performance Python framework with automatic OpenAPI documentation and excellent AI integration support. |
| **Google BigQuery** | Serverless analytics engine capable of processing large pharmaceutical datasets efficiently. |
| **Groq** | Low-latency LLM inference for fast Natural Language → SQL generation. |
| **Google Cloud Run** | Fully managed deployment with automatic scaling and minimal infrastructure management. |
| **New Relic** | End-to-end observability using APM, distributed tracing, dashboards, alert policies, and workflows. |

## ⚠️ Engineering Challenges

**Safe AI-generated SQL** — Implemented SQL guardrails to allow only `SELECT` statements, validate datasets/tables, and perform BigQuery dry-run validation before execution.

**LLM hallucinations** — Prompt engineering and schema-aware instructions ensure generated SQL follows the warehouse schema and BigQuery Standard SQL.

**Production observability** — Integrated New Relic dashboards, distributed tracing, alert policies, and ServiceNow workflows to monitor every request through the AI pipeline.

**Business-friendly analytics** — Instead of returning raw tables, the platform generates AI summaries and automatically recommends chart visualizations.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Angular, TypeScript, Chart.js, ng2-charts |
| **Backend** | FastAPI, Python |
| **AI / LLM** | Groq |
| **Database** | Google BigQuery |
| **Cloud** | Google Cloud Run, Vercel |
| **Observability** | New Relic (APM, AI Monitoring, AI Observability, Distributed Tracing, Alerts, Workflows) |
| **Testing** | Playwright, Selenium, Postman, FastAPI Swagger |

---

## 📸 Product Walkthrough

<table>
<tr>
<td width="50%">

**Visualization**
![Bar chart visualization](assets/chart_viz.png)

</td>
<td width="50%">

**Data Preview**
![Data preview table](assets/data_preview_sql.png)

</td>
</tr>
</table>

---

## 📈 Monitoring & Observability

This is one of the most complete parts of the project: three custom New Relic dashboards track the AI pipeline in production, not just the web server.

**AI Monitoring Dashboard** — user query volume, response time trend, guardrail activity
![AI Monitoring Dashboard](assets/ai_monitoring_dashboard.png)

**AI Observability Dashboard** — LLM request distribution, AI response time trend, SQL-generation latency
![AI Observability Dashboard](assets/ai_observability_dashboard.png)

**Application Performance Monitoring (APM)** — web transaction time, Apdex, throughput, and slowest transactions for the FastAPI backend
![APM summary for pharma-analytics-backend](assets/apm_summary.png)

**Distributed Tracing** — full request traces across the `ask_question` endpoint
![Distributed tracing view](assets/distributed_tracing.png)

**Alerting & Incident Routing** — 6 NRQL-backed alert conditions (AI request failures, high guardrail activity, high LLM latency, high query response time, high SQL generation time, and PII request detection), routed through an automated workflow to ServiceNow and email
![Alert conditions configured in New Relic](assets/alert_conditions.png)
![Alert workflow routing to ServiceNow](assets/alert_workflows.png)

Tracked metrics across the stack:
- API response time & throughput
- SQL generation latency
- LLM latency
- Guardrail / PII-detection activity
- Query volume & error rate

---

## 🧪 Testing

| Layer | Tools |
|---|---|
| **Frontend** | Playwright, Selenium |
| **Backend** | Postman, Swagger, Health Endpoint |

---

## 📂 Project Structure

```
frontend/    # Angular application
backend/     # FastAPI service, SQL guardrails, LLM integration
tests/       # Playwright, Selenium, Postman collections
docs/        # Architecture notes, case study, screenshots
```

---

## 💬 Example Questions It Handles

- "Show medicine count by client"
- "Compare all clients by medicine records"
- "Show top side effects"
- "Compare habit-forming medicines"
- "Show medicines by chemical class"
- "List substitute medicines"

---

## 🚀 Roadmap

- [ ] Authentication
- [ ] Report export
- [ ] Conversational memory across turns
- [ ] Streaming responses
- [ ] Dashboard sharing
- [ ] Multi-turn analytics

---

## 👩‍💻 What This Project Demonstrates

- End-to-end full-stack ownership (Angular + FastAPI + BigQuery + Cloud Run)
- LLM integration and prompt engineering for a structured-output (NL → SQL) use case
- Designing and enforcing SQL guardrails and PII-safety checks around an LLM in a regulated (pharma) domain
- Standing up production-grade observability from scratch: custom New Relic dashboards, distributed tracing, NRQL-based alerting, and automated incident workflows
- Cloud-native deployment across two providers (GCP Cloud Run + Vercel)
- Cross-layer testing strategy (E2E, API, health checks)

📄 Read the full [portfolio case study](CASE_STUDY.md) for the engineering decisions and trade-offs behind this build.

---

## 💼 Skills Demonstrated

AI Engineering · Prompt Engineering · LLM Integration · Natural Language → SQL · SQL Guardrails · FastAPI · Angular · TypeScript · Google BigQuery · Google Cloud Run · New Relic APM · Distributed Tracing · Playwright · Selenium · Postman · Production Monitoring

---

## 📄 License

This repository is a portfolio project demonstrating production-style AI analytics architecture.
