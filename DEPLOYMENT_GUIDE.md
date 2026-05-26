# Deployment Guide

This guide covers everything required to take GrowthMate AI from a local development environment to a live, scalable production environment.

## 1. Preparing for Production
- Ensure all API keys currently situated in your local `.env.local` are safely preserved and omitted from public GitHub repositories (`.gitignore`).
- Run `npm run build` locally to catch any Next.js compiler errors, TypeScript issues, or failing tests prior to pushing code.

## 2. Deploying the Frontend and Backend APIs on Vercel
Vercel is the recommended hosting platform for Next.js applications due to its optimized serverless network.

1. Create a Vercel account and link it to your GitHub repository.
2. In the Vercel Dashboard, select **Add New Project** and import the GrowthMate AI repository.
3. Under the **Environment Variables** tab, add your production keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`
4. Click **Deploy**. Vercel will automatically build the repository and allocate hosting.

## 3. Configuring Production Supabase (Database & Auth)
1. Navigate to the Supabase UI and confirm your production Database project is active.
2. Synchronize the necessary schema tables (Sectors, Products, Revenue, Negotiation Logs) matching your local testing environment.
3. Crucial: Whitelist your new Vercel production domain under the **Authentication -> URL Configuration** settings in Supabase. This guarantees OAuth and Email log-ins will redirect successfully and securely.

## 4. Post-Deployment Sanity Checks
- Access the production URL and test the login functionality to ensure Supabase Auth handles active sessions effectively.
- Conduct a sample Negotiation flow on the production instance. This confirms that serverless functions have the necessary allocation timeout span to wait for the lengthy AI responses.
