# AI Integration Guide

## Introduction
GrowthMate AI operates on a multi-agent architectural layering model. This guide outlines how the AI APIs (like Groq) are used across the different services to power intelligent features for Small and Medium Enterprises.

## 1. Negotiation Simulation Agent
- **Purpose:** Conducts multi-turn conversational negotiation between a simulated buyer and the seller.
- **Integration:** Utilizes the LLM endpoints to parse user inputs, calculate concession matrices, and return AI-generated counter-offers or acceptance.
- **Prompt Engineering:** Prompts restrict the AI from dropping prices below the business's strictly set minimum profit margin. Structured state tracking ensures context is maintained.

## 2. Marketing Studio Agent
- **Purpose:** Generates comprehensive marketing strategies based on specific product lines.
- **Integration:** Sends one-shot generation requests using parameters like target demographic, tone, and budget.
- **Output Handling:** Parses output into JSON and standard text strings so the Next.js UI component can cleanly render social media captions, email drafts, and ad copy.

## 3. Pricing Intelligence & Customer Insights
- **Purpose:** Performs rapid data analysis to recommend the perfect market selling point.
- **Integration:** Structured outputs calculate dynamic pricing models based on cost price, competitor price, and demand level.

## Important AI Limitations & Error Handling
- **Rate Limits:** Be mindful of API rate limitations. GrowthMate AI implements fallback responses if the AI endpoints timeout to avoid crashing the user dashboard.
- **Structured Formatting:** Instructions to the AI strictly enforce responding in valid formats ensuring that frontend dashboard variables parse the data effectively without errors.
