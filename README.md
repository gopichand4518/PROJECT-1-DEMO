# Social Media Community Portal

A modern web application for managing online communities, built using a type-safe architecture with **React**, **TypeScript**, **Supabase**, and **TanStack Query**.

---

## 🚀 Key Technologies & Architecture

* **Supabase (Backend-as-a-Service):** Uses a PostgreSQL database to manage data persistence. Data insertions are executed directly through the secure client API without traditional backend API endpoints.
* **TanStack Query (Server Cache):** Manages remote data syncing and caching. It automatically triggers background cache invalidations (`queryClient.invalidateQueries`) to refresh the UI immediately after new data is added.
* **TypeScript (Type-Safety):** Enforces strict structural data contracts (like the `CommunityInput` interface) to catch errors during development and prevent runtime crashes.
* **React Router:** Handles seamless, zero-reload page navigation across the portal.

---

## 📂 Core Folder Structure

* **`/components`**: Reusable UI parts (e.g., `CreateCommunity.tsx`, `CommunityList.tsx`, `Navbar.tsx`).
* **`/pages`**: Full-page layouts mapped directly to active website routes (e.g., `HomePage.tsx`).
* **`/context`**: Global states handling session lifetimes and user logins (`AuthContext.tsx`).
* **`supabase-client.ts`**: Initializer script establishing connection vectors to the cloud database.

---

## 💻 Quick Start Guide

Run these commands in your terminal to get the project running locally:

```bash
# Clone the repository
git clone https://github.com

# Move into the project directory
cd PROJECT-1-DEMO/react-app/social-media

# Install requirements and run the local development server
npm install
npm run dev
```
