# 🫙 DreamJar — Gamified Saving Goal App with Virtual Pet


**DreamJar** is a full-stack saving goal tracker with gamification and a virtual pet system. Save money toward your dreams while keeping your adorable companion happy!

---

## ✨ Features

| Feature | Web | Mobile |
|---|---|---|
| JWT Authentication | ✅ | ✅ |
| Saving Goals (CRUD) | ✅ | ✅ |
| Add Saving Progress | ✅ | ✅ |
| Coins & XP Rewards | ✅ | ✅ |
| Virtual Pet (5 types) | ✅ | ✅ |
| Pet Interactions | ✅ | ✅ |
| Saving Challenges | ✅ | ✅ |
| Habit Sacrifice Analyzer | ✅ | — |
| Goal Archive & Achievements | ✅ | ✅ |
| Dashboard Overview | ✅ | ✅ |
| PWA / Offline Support | ✅ | — |
| Drag & Drop Image Upload | ✅ | — |
| Local Push Notifications | — | ✅ |
| Biometric Login Placeholder | — | ✅ |

---

## 🗂️ Project Structure

```
dreamjar/
├── backend/           # Node.js + Express API
├── frontend/          # React + Vite web app
├── mobile/            # React Native Expo app
└── database/          # MySQL schema
```

---

## 🚀 Quick Setup

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- Expo CLI (`npm install -g expo-cli`)
- npm or yarn

---

### 1️⃣ Database Setup

```bash
# Open MySQL and run:
mysql -u root -p < database/schema.sql
```

This creates the `dreamjar` database with all tables and seeds challenge data.

---

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dreamjar
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

```bash
# Create uploads directory
mkdir -p uploads

# Start development server
npm run dev

# Or production
npm start
```

Backend runs at: **http://localhost:5000**

---

### 3️⃣ Frontend (Web) Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

```bash
# Build for production
npm run build
```

---

### 4️⃣ Mobile (React Native) Setup

```bash
cd mobile

# Install dependencies
npm install

# Update API URL for your device
# Edit: src/utils/api.js
# Change: const API_URL = 'http://YOUR_LOCAL_IP:5000/api'
# (Use your machine's local IP, not localhost, for physical devices)
```

```bash
# Start Expo
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

> **Note:** For physical device testing, replace `localhost` in `mobile/src/utils/api.js` with your computer's local IP address (e.g., `192.168.1.10`).

---

## 🔑 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Goals
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/goals` | List goals (filter by ?status=) |
| POST | `/api/goals` | Create goal |
| GET | `/api/goals/:id` | Get single goal |
| PUT | `/api/goals/:id` | Update goal |
| DELETE | `/api/goals/:id` | Delete goal |
| POST | `/api/goals/:id/complete` | Mark completed |
| POST | `/api/goals/:id/missed` | Mark missed |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | List transactions |
| POST | `/api/transactions` | Add saving progress |
| DELETE | `/api/transactions/:id` | Delete transaction |

### Pet
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/pets` | Get pet |
| POST | `/api/pets/setup` | Setup/change pet |
| POST | `/api/pets/feed` | Feed pet (10 coins) |
| POST | `/api/pets/play` | Play with pet |
| POST | `/api/pets/sleep` | Put pet to sleep |
| GET | `/api/pets/inventory` | Get accessories |

### Challenges
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/challenges` | All challenges |
| GET | `/api/challenges/my` | User's challenges |
| POST | `/api/challenges/join` | Join challenge |
| POST | `/api/challenges/complete` | Complete challenge |

### Habits
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/habits` | List habits |
| POST | `/api/habits` | Add habit |
| DELETE | `/api/habits/:id` | Delete habit |
| GET | `/api/habits/analyze` | Analyze habits |

### Archive
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/archives` | Goal history |
| GET | `/api/archives/achievements` | Achievements |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Full dashboard data |

---

## 🎮 Rewards System

| Action | Coins | XP |
|---|---|---|
| Add saving (per Rp1,000) | +1 | +2 |
| Add saving (base bonus) | +5 | +10 |
| Complete goal | +100 | +200 |
| Complete challenge | varies | varies |
| Feed pet | -10 | — |

---

## 🐾 Virtual Pet

- Choose from: 🐱 Cat, 🐰 Bunny, 🐹 Hamster, 🐼 Panda, 🦕 Dinosaur
- Pet stats: Hunger, Happiness, Energy
- Stats decay over time (hunger -2/hr, happiness -0.5/hr)
- Pet **never dies** — only gets sad
- Feed pet for 10 coins
- Play for free (uses energy)
- Sleep to restore energy
- Goals completed → pet gets happier + XP
- Goals missed → pet gets sad

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MySQL 8.0 |
| Auth | JWT + bcryptjs |
| Web Frontend | React 18, Vite, Tailwind CSS |
| Mobile | React Native, Expo |
| Notifications | Expo Notifications |
| PWA | vite-plugin-pwa |
| HTTP Client | Axios |

---

## 📱 Mobile Notifications

The mobile app schedules three recurring notifications:
- **Pet Hungry** — every 8 hours
- **Daily Saving Reminder** — 8:00 PM daily
- **Streak Reminder** — 9:00 AM daily

---

## 🔒 Security Notes

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens expire in 7 days
- All goal/pet routes protected via auth middleware
- CORS configured for frontend origin only

---

## 🎨 Design System

- **Primary**: Blue (#3B82F6)
- **Background**: Sky Blue (#F0F9FF)
- **Success**: Mint Green (#10B981)
- **Warning**: Yellow (#EAB308)
- **Error**: Red (#EF4444)
- **Font**: Nunito (body), Fredoka One (display)
- **Border Radius**: Rounded (xl/2xl/3xl)

---

## 📦 Production Deployment

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve /dist with nginx or any static server
```

### Mobile
```bash
cd mobile
expo build:android  # APK/AAB
expo build:ios      # IPA
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|---|---|
| DB connection failed | Check `.env` DB credentials |
| CORS error | Set `CLIENT_URL` in backend `.env` |
| Mobile can't reach API | Use your PC's local IP, not localhost |
| Notifications not working | Grant notification permission on device |
| Coins not updating | Refresh page or pull-to-refresh on mobile |

---

Made with 💙 — DreamJar Team
