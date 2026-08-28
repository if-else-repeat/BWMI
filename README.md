<div align="center">
  
# 🇮🇳 Build What Moves India
**Varun Mayya x OpenAI Hackathon Submission**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Dexie.js](https://img.shields.io/badge/IndexedDB-Dexie.js-FFA500?style=for-the-badge)](https://dexie.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Resilient Civic-Tech Architecture & Offline-First Citizen Portals**

</div>

<br />

## 🚀 Overview
India’s public digital infrastructure handles millions of concurrent users daily. However, legacy architectural choices—heavy reliance on centralized server state, synchronous API calls for form progression, and SMS-based OTPs—create fragile systems that fail during peak loads or low-bandwidth 3G network drops.

This project is a fundamental reimagining of Indian public-service digital infrastructure. We are moving from fragile, server-dependent web portals that crash on 3G network drops to an **offline-first, zero-data-loss browser architecture** powered by IndexedDB keystroke persistence and background sync.

---

## 🛑 The Problem: 3 Systemic Points of Failure

1. 💥 **Server Downtime & 504 Timeouts:** Citizens spend 15–20 minutes filling out complex, 20-field forms. A momentary 3G network drop or peak server bottleneck triggers a 504 Gateway Timeout. The page reloads blank, wiping all entered form data and forcing citizens to start from scratch.
2. 😵‍💫 **Cognitive Overload & Clutter:** Critical numerical identifiers (12-digit UAN, PAN, Challan numbers) get misread due to ambiguous proportional fonts. Essential action buttons are buried under bloated departmental banners and marquee notices.
3. 🔄 **The Authentication "Loop of Death":** Heavy reliance on centralized SMS OTP gateways creates bottlenecks during peak hours. SMS OTPs arrive after the timer expires, causing failed attempts and locking citizens out of their own accounts during critical emergencies.

---

## 💡 The Solution: Offline-First Architecture
Our architecture solves these issues entirely on the client side, requiring zero changes to the underlying government databases.

* 💾 **0ms Keystroke Data Persistence:** Every field input writes instantly to the browser's IndexedDB via `Dexie.js` at 0ms latency. Tab closures, network disconnects, or dead batteries cause 0% data loss.
* 📡 **Offline Sync Queueing:** If a submission occurs during a network drop or server timeout, the payload is caught in a local `SyncQueue` table. A local receipt is generated without crashing, and the data automatically syncs when the connection is restored.
* 🔐 **WebAuthn Passkeys:** By leveraging device hardware biometric checks (Touch ID / Face ID), we simulate instant authentication, bypassing congested SMS gateways completely.

---

## 🏗️ Prototypes Built
This repository contains two fully functional prototypes demonstrating the architecture:

### 🏛️ 1. Resilient EPFO Portal (`/prototype/epfo`)
A complete end-to-end replica of the official Employees' Provident Fund Organisation member portal. Features fully functional offline-first form filing, WebAuthn passkey login, and multi-user synthetic data simulation.

### 🌐 2. Unified Public Gateway (`/prototype/gateway`)
Demonstrates visual and technical scalability across multiple government departments. A central citizen dashboard showcasing Income Tax, Parivahan (Driving License), and e-SHRAM integrations using our standardized resilient architecture.

---

## 🎨 Design System: Civic Neo-Brutalism
We have replaced cluttered, generic UI with a highly intentional, accessible design system:
* 🔲 **High-Contrast Neo-Brutalism**: Solid borders, stark contrast, and zero low-opacity gradients to guarantee maximum legibility under bright outdoor sunlight on low-cost mobile screens.
* 🔢 **Space Mono for Data**: Monospace typography isolates critical identifiers to prevent citizens from misreading '0' for 'O' or '1' for 'I'.
* 🎯 **Cognitive Focus Workflow**: Elimination of bloated marquee notices. Standardized 3-step wizards ensure one task per screen.
* 🇮🇳 **Native Bilingual Support**: Every interface element instantly toggles between English and Hindi locally, without requiring a full page reload or server roundtrip.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/your-username/bwmi-epfo-resilience.git
cd bwmi-epfo-resilience
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the provided localhost URL (typically `http://localhost:5173` or `http://localhost:3000`).

---

<div align="center">
  <i>Developed for the Build What Moves India (Varun Mayya x OpenAI) Hackathon.</i>
</div>
