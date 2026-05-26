# GrowthMate AI
**A Multi-Agent Business Growth Copilot for SMEs**

## Overview
GrowthMate AI is a comprehensive SaaS platform built to empower Small and Medium Enterprises (SMEs) with intelligent, multi-agent tools. Leveraging Next.js for a robust frontend, Supabase for scalable database and authentication handling, and multiple AI agents powered by the Groq API, GrowthMate AI serves as your dedicated business copilot.

## Core Features
- **Pricing Intelligence:** Computes optimal pricing strategies based on cost, competitors, and market demand.
- **Negotiation Simulator:** Simulates interactive buyer-seller negotiations to finalize optimal agreements.
- **Marketing Studio:** Generates dynamic marketing campaigns and social media captions automatically.
- **Customer Insights:** Analyzes purchasing metrics to identify robust target demographics.

## Tech Stack
- **Frontend/Backend:** Next.js, React, Tailwind CSS
- **Database & Auth:** Supabase
- **AI Capabilities:** Python Agent Engine APIs / Groq API

## Getting Started

1. **Clone and Install:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Configure your `.env.local` to include your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GROQ_API_KEY`.

3. **Run the Server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the SaaS dashboard in the browser.
