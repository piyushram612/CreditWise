# CreditWise 💳
### Every rupee, maximized.

CreditWise is an AI-powered credit card rewards optimizer for Indian users. It helps you get maximum value from your existing credit cards by telling you exactly which card to swipe for every purchase — and giving you the intelligence to manage your entire card portfolio in one place.

Built independently as a personal project in mid-2025, before the concept gained mainstream visibility in India.

**Live app:** [creditwise-omega.vercel.app](https://creditwise-omega.vercel.app)

---

## The Problem

Most Indian credit card holders own 2–5 cards but use only one by default — leaving thousands of rupees in unclaimed rewards, missed milestones, and underutilized benefits on the table every month. Knowing which card to use for groceries vs. flights vs. fuel vs. Amazon requires either memorizing complex reward structures or just guessing.

CreditWise eliminates that guesswork entirely.

---

## Features

### 💡 Spend Optimizer
The core feature. Enter a spend amount, category, and optional vendor — CreditWise instantly ranks your cards by effective reward rate for that specific transaction and recommends the best card to use. Powered by a curated database of 40+ Indian credit cards covering reward rates, category multipliers, caps, and partner benefits, with inputs optimized to prevent accidental scroll-wheel changes.

### 🔥 Smart Tips
Personalized, AI-generated insights based on your actual card portfolio. Covers:
- Credit utilization warnings and optimization advice
- Underutilized card benefits and milestone tracking
- Ecosystem multiplier strategies (Tata, HDFC SmartBuy, Axis EDGE etc.)
- Card rotation strategies for quarterly bonus categories
- Limited-time offers and partnership opportunities

Tips are categorized by type (Miles & Points, Milestones, Cashback, Partnerships) and tagged by priority so you always know what to act on first.

### 🤖 AI Card Advisor
A full conversational AI interface powered by the Google Gemini API. Ask anything about your cards in natural language:
- *"Which of my cards is best for international travel?"*
- *"Explain the milestone benefits on my Amex Platinum Travel"*
- *"How do I maximize my HDFC SmartBuy points this month?"*
- *"What's the best card to use on Swiggy?"*

The advisor is completely context-aware — it knows exactly which cards are in your wallet, initializes with a personalized welcome listing your active portfolio, and uses dynamic text parsing (`getCalculatedOutcome`) to scan responses and render interactive visual outcome badges displaying exact calculated points and reward percentages.

### 🗂️ Card Wallet (Collapsible & Privacy Protected)
Add any of the 40+ supported Indian credit cards to your personal wallet. 
- **Bank-Segregated Selection**: Redesigned card selector with category pills (`HDFC`, `SBI`, `ICICI`, `AXIS`, `AMEX`, `Others`) and visually interactive card lists for single-click creation.
- **Privacy Protection**: Protects card details with privacy mask dots (`•••• •••• •••• ••••`).
- **Collapsible Layout**: Automatically collapses on mobile/tablet viewports to maximize workspace, expandable with a double chevron pull-tab.

### 📱 Responsive Mobile Drawer Navigation
- Features an elegant mobile sidebar drawer that slides in smoothly from the left with a blurred backdrop overlay.
- Includes quick-toggle hamburger headers and close buttons tailored for touch targets.
- Features a premium **Edit Profile Card** linking directly to Supabase Auth metadata so users can customize their display name and profile avatar dynamically.

---

## Card Database

CreditWise includes structured data for 40+ Indian credit cards across all major issuers:

**Issuers covered:** HDFC Bank, Axis Bank, SBI Card, ICICI Bank, American Express, IDFC FIRST Bank, IndusInd Bank, Kotak Mahindra Bank, RBL Bank, Standard Chartered, Tata/HDFC (Neu Infinity)

**Data points per card:** Card name, issuer, network, annual fee, joining fee, fee waiver conditions, reward rates by category (with caps and notes), welcome benefits, milestone benefits, lounge access (domestic + international), other benefits, and suitability summary.

Notable cards in the database include HDFC Infinia Metal, Axis Magnus, HDFC Diners Club Black (original and Metal Edition), Amex Platinum Charge, Amex Platinum Travel, Axis Atlas, ICICI Emeralde Private Metal, IndusInd Legend, HDFC Regalia Gold, Tata Neu Infinity, SBI Cashback, Axis ACE, and many more.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| AI Integration | Google Gemini API (gemini-flash-latest) |
| Mobile | Capacitor (PWA + native wrapper) |
| Deployment | Vercel |

---

## Architecture

```
creditwise/
├── app/
│   ├── page.tsx              # Landing page (with theme toggling & auth triggers)
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard page (fetches SSR cards & hands to client)
│   ├── api/
│   │   ├── optimize/         # API route for Spend Optimizer logic
│   │   └── chat/             # API route for context-aware Gemini chat
│   └── globals.css           # Global CSS and custom scrollbar rules
├── app/components/
│   ├── dashboard/
│   │   ├── DashboardClient.tsx # Client router managing active panels & modals
│   │   ├── Sidebar.tsx         # Responsive sliding navigation drawer
│   │   ├── CardList.tsx        # Wallet cards panel (visual creators, edit/delete)
│   │   ├── SpendOptimizer.tsx  # Interactive spend optimizer form + rankings
│   │   ├── AiCardAdvisor.tsx   # Conversational chatbot with dynamic outcome badges
│   │   └── Settings.tsx        # Profile configuration and custom theme inputs
│   ├── insights/
│   │   └── SmartTipsView.tsx   # Financial optimization tips dashboard
│   └── shared/
│       └── Icons.tsx           # Premium visual primitives and SVG helpers
├── lib/
│   ├── supabase/             # Client + server Supabase SDK connection instances
│   ├── database.types.ts     # Supabase auto-generated PostgreSQL types
│   └── types.ts              # Core CreditWise interface definitions
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- A Google Gemini API key

### Installation

```bash
git clone https://github.com/your-username/creditwise
cd creditwise
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

*Note: The `GEMINI_API_KEY` is maintained strictly server-side inside secure API handlers to prevent exposure.*

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo Mode

Don't want to sign up? Click **"Try demo →"** on the landing page to explore the app with a preloaded sample wallet — no account required. The demo bypasses server-side Supabase authentication and loads HDFC Infinia, SBI Cashback, and Axis Magnus dynamically so you can test the Spend Optimizer and AI Card Advisor immediately.

---

## Roadmap

- [ ] Voice Conversion Optimization (speak into the app like *"I want to spend ₹2000 on groceries at Big Basket"* and get instant, automatic card suggestions via the Spend Optimizer)
- [ ] Live card data sync (replace static DB with issuer API feeds)
- [ ] Reward points expiry tracker and alerts
- [ ] Monthly spend analytics and category breakdown
- [ ] Card recommendation engine (suggest new cards based on spend patterns)
- [ ] UPI integration for automatic transaction categorization
- [ ] Mobile app release on Play Store (Capacitor build)
- [ ] Bill payment reminders and due date tracking

---

## Background

CreditWise was built in July 2025 as a personal project to solve a problem I kept running into — owning multiple credit cards but never being sure which one to use. The idea was to build a tool I'd actually use daily, not just a portfolio project.

The app is live, functional, and actively used. The card database, AI advisor, and spend optimizer are all working in production.

---

## Built By

**Piyush** — Flutter & full-stack developer, final-year CS student at GITAM University, Hyderabad.

Also building **TallyTap** — a frictionless expense logger for Android that lets you log spends instantly by triple-tapping the back of your phone.

[LinkedIn](https://linkedin.com/in/your-profile) · [GitHub](https://github.com/your-username)

---

*CreditWise is an independent project and is not affiliated with any bank, card issuer, or financial institution. Card data is sourced from public information and may not reflect the latest issuer terms.*
