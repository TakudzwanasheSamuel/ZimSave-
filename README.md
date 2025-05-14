
# ZimSave+ Micro-Finance Platform

ZimSave+ is a Next.js web application designed to empower users in Zimbabwe, particularly vendors and small business owners, with tools for micro-savings, financial literacy, and basic health and insurance awareness. It leverages AI to provide personalized advice and summaries, aiming to be an accessible financial companion.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Key Concepts & Design Choices](#key-concepts--design-choices)
- [Future Enhancements](#future-enhancements)

## Overview

ZimSave+ aims to bridge the gap in financial services for individuals and micro-enterprises by providing a user-friendly platform for:

*   Managing personal and group savings (Mukando).
*   Accessing micro-insurance options.
*   Receiving AI-driven financial, health, and business advice.
*   Tracking personal finances and savings goals.

The application simulates these functionalities using browser `localStorage` for data persistence, making it suitable for demonstration and local development.

## Key Features

1.  **Authentication:**
    *   User signup and login (simulated, stores user details in `localStorage`).

2.  **Dashboard:**
    *   Centralized overview of wallet balance, active Mukando groups, and micro-insurance status.
    *   Quick action links to major app sections.

3.  **Mukando (Group Savings) Management:**
    *   **Create & Manage Groups:** Users can create new Mukando groups with details like name, contribution amount/frequency, description, and upcoming needs.
    *   **Track Contributions:** Simulate tracking contributions to group pools.
    *   **View Group Details:** Dedicated page for each group showing financials, membership info, target progress, and needs.
    *   **AI-Powered Summary:** Generate a concise AI summary for each group's status, including savings, contributions, and upcoming needs.
    *   **Borrow from Group Pool:** Users can request and receive (simulated) loans from their Mukando group's collective pool, with funds transferred to their personal wallet.

4.  **Wallet Management:**
    *   **View Balance:** Displays current USD wallet balance.
    *   **Add & Transfer Funds:** Simulate adding funds to the wallet and transferring funds for various purposes (e.g., peer transfer, Mukando contribution).
    *   **Transaction History:** Lists all wallet transactions with type, amount, description, and date.
    *   **Savings Goals:**
        *   Create personalized savings goals (e.g., "Emergency Fund," "New Equipment") with target amounts and emojis.
        *   Allocate funds from the main wallet to specific goals.
        *   Track progress visually towards each goal.

5.  **Micro-Insurance Marketplace:**
    *   **Browse Policies:** View a list of available micro-health insurance policies with details like premium, coverage highlights, and annual limits (all in USD).
    *   **Invest in Policy:** Simulate investing in a selected policy. The active policy is stored in `localStorage`.
    *   **View Active Policy:** Displays the user's currently active insurance plan.

6.  **AI Chatbot:**
    *   **Multilingual Support:** Provides advice in English, Shona, or Ndebele.
    *   **Expertise Areas:** Offers guidance on:
        *   Financial literacy (budgeting, saving, debt).
        *   Health and wellness tips.
        *   Mukando/Round group savings information.
        *   Micro-business advice (inventory, marketing, pricing, record-keeping) tailored for vendors and small business owners in Zimbabwe.

7.  **Notifications:**
    *   Simulated notification system for important alerts and updates (e.g., group invites, contribution confirmations).

8.  **Responsive Design:**
    *   Desktop navigation via a collapsible sidebar.
    *   Mobile navigation via a bottom navigation bar.

## Tech Stack

*   **Frontend Framework:** [Next.js](https://nextjs.org/) (with App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **State Management (Simulated Backend):**
    *   React Context API (for Authentication state via `useAuth` hook).
    *   React `useState`, `useEffect` with browser `localStorage` (for Wallet, Mukando groups, Insurance policies, Savings Goals).
*   **AI Integration:** [Genkit (by Google)](https://firebase.google.com/docs/genkit)
    *   Model: Gemini (via `@genkit-ai/googleai`)
*   **Forms:** React Hook Form (implicitly via ShadCN UI form components)
*   **Icons:** [Lucide React](https://lucide.dev/)

## Project Structure

A brief overview of the main directories:

```
.
├── public/                  # Static assets
├── src/
│   ├── ai/                  # Genkit AI flows and configuration
│   │   ├── flows/           # Specific AI flow implementations
│   │   └── genkit.ts        # Genkit global instance
│   ├── app/                 # Next.js App Router (pages, layouts)
│   │   ├── (auth)/          # Auth routes (e.g., login page)
│   │   └── dashboard/       # Authenticated dashboard routes and sub-pages
│   ├── components/          # Reusable React components
│   │   ├── auth/
│   │   ├── chatbot/
│   │   ├── insurance/
│   │   ├── layout/
│   │   ├── mukando/
│   │   ├── notifications/
│   │   ├── shared/
│   │   ├── ui/              # ShadCN UI components
│   │   └── wallet/
│   ├── hooks/               # Custom React hooks (e.g., useAuth, useToast)
│   ├── lib/                 # Utility functions (e.g., cn for classnames)
│   ├── types/               # TypeScript type definitions (e.g., Wallet, Insurance)
├── .env                     # Environment variables (primarily for Genkit API Key)
├── next.config.ts           # Next.js configuration
├── package.json             # Project dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository (if applicable) or download the code files.**
2.  **Navigate to the project directory:**
    ```bash
    cd path/to/ZimSave-
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables

The application uses Genkit for AI features, which typically requires an API key for the underlying AI model provider (e.g., Google AI Studio for Gemini).

1.  Create a `.env` file in the root of the project:
    ```bash
    touch .env
    ```
2.  Add your Google AI API key to the `.env` file:
    ```
    GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY
    ```
    You can obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

    _Note: The `src/ai/genkit.ts` file is configured to use `googleai/gemini-2.0-flash` by default. Ensure your API key has access to this model or adjust the model in the configuration._

### Running the Application

The application consists of two main parts that need to be run: the Next.js frontend and the Genkit development server for AI flows.

1.  **Start the Next.js development server:**
    Open a terminal and run:
    ```bash
    npm run dev
    ```
    This will typically start the Next.js app on `http://localhost:9002`.

2.  **Start the Genkit development server:**
    Open a *separate* terminal and run:
    ```bash
    npm run genkit:dev
    # or for auto-reloading on changes to AI flows:
    npm run genkit:watch
    ```
    This will start the Genkit server, usually on `http://localhost:4000` (for the Genkit Developer UI) and expose the flows for the Next.js app to call.

You should now be able to access the ZimSave+ application in your browser at the Next.js development server URL.

## Key Concepts & Design Choices

*   **Micro-Finance Focus:** All monetary values and features are designed around small, accessible amounts, reflecting the "micro" nature of the platform's target users.
*   **USD Currency:** The application exclusively uses USD for all financial transactions and displays to maintain consistency and align with common usage in the target region for such platforms.
*   **`localStorage` for Data Persistence:** To enable a functional prototype without a full backend, user data, Mukando group details, wallet balances, transactions, insurance policy status, and savings goals are stored in the browser's `localStorage`. This means data is local to the user's browser.
*   **AI-Driven Assistance:** Genkit is integrated to provide:
    *   Multilingual financial, health, and business advice through a chatbot.
    *   Summaries of Mukando group savings.
*   **Responsive UI:** The application adapts to different screen sizes, using a collapsible sidebar for desktop and a bottom navigation bar for mobile devices, built with ShadCN UI components and Tailwind CSS.
*   **Component-Based Architecture:** The UI is built using reusable React components, promoting modularity and maintainability.

## Future Enhancements

While the current application provides a solid foundation, potential future enhancements include:

*   **Real Backend Integration:** Replace `localStorage` with a robust backend solution (e.g., Firebase Firestore, Supabase) for persistent, secure, and multi-user data storage.
*   **Full P2P Lending Functionality:** Implement interest calculations, loan repayment schedules, and potentially a simple loan approval workflow within Mukando groups.
*   **Agent Cash-Out/Cash-In:** Develop features to simulate or integrate with local agent networks for cashing out funds from the wallet.
*   **Enhanced AI Features:**
    *   Personalized financial planning advice.
    *   Proactive alerts and tips based on user activity.
    *   More sophisticated business analytics for vendors.
*   **Transaction Categorization and Budgeting:** Allow users to categorize transactions and set budgets.
*   **Security Enhancements:** Implement proper authentication, data encryption, and security best practices if moving to a production environment.
*   **Offline Support:** Improve PWA capabilities for better offline access to certain features.
*   **Loan Repayment Tracking:** UI and logic for members to repay loans taken from Mukando groups.
*   **Formal Loan Agreements:** If implementing more formal lending.
*   **User Profile Management:** Allow users to update their profile information.
```