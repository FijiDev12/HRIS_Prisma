# CHSI Backend Application

This project is a backend service for an CHSI system built using:

- Node.js + Express
- Prisma ORM
- MySQL
- TypeScript

---

## 📦 Prerequisites

Make sure you have the following installed:

- Node.js (v18+ recommended)
- npm or yarn
- MySQL
- Prisma CLI
- Git

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <project-folder>

### 2. Install dependencies
```bash
npm install

### 3. Setup Prisma
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

### 4. Install/Run the application (Redis)
```bash
For Window:
1. Download Memurai
Go to:
👉 https://www.memurai.com
Download Memurai Developer Edition (free).
2. Install it (Next → Next → Finish)
During install:
✅ It automatically installs as a Windows Service
✅ Starts Redis on:

For Mac
1. Install Redis
brew install redis
2. Start Redis
brew services start redis
3. Test Redis
redis-cli ping
4. Start Redis
brew services stop redis

### 5. Run the application (Development)
```bash
npm run dev