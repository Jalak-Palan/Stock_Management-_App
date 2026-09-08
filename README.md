# 📦 Stock Management App

A full-stack **Stock Management System** built with a **React Native (Expo)** mobile app and a **Node.js + Express** backend, designed to help businesses efficiently manage their inventory, sales, purchases, suppliers, customers, and more.

---

## 🚀 Live Build / Download

📲 **Android APK Build (via Expo EAS):**
> [https://expo.dev/accounts/jalakpalan/projects/stock-management-app/builds/0cb26023-a385-4aea-93bc-7e0c4ef4d4b8](https://expo.dev/accounts/jalakpalan/projects/stock-management-app/builds/0cb26023-a385-4aea-93bc-7e0c4ef4d4b8)

> Built with **Expo EAS (Expo Application Services)**. Scan or click the link above to download and install the APK directly on your Android device.

---

## 📁 Project Folder Structure

```text
Stock-management/
│
├── 📱 stock-management-app/        # React Native (Expo) Mobile App
│   └── src/
│       ├── components/             # Reusable UI components (UserAvatar, SectionHeader, etc.)
│       ├── screens/                # App screens (Dashboard, Products, Sales, etc.)
│       ├── context/                # Global state management (AuthContext, etc.)
│       ├── navigation/             # Stack, Tab & Drawer navigation setup
│       ├── theme/                  # App-wide colors, fonts, and styles
│       ├── utils/                  # Helper/utility functions
│       └── data/                   # Static/mock data
│
├── 🖥️ server/                      # Node.js + Express Backend
│   ├── models/                     # MongoDB Schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Supplier.js
│   │   ├── Customer.js
│   │   ├── Sale.js
│   │   ├── Purchase.js
│   │   └── Order.js
│   ├── routes/                     # API Endpoint definitions
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── suppliers.js
│   │   ├── customers.js
│   │   ├── sales.js
│   │   ├── purchases.js
│   │   └── orders.js
│   ├── middleware/                  # Auth and error handling middleware
│   ├── seedAdmin.js                # Admin seeder script
│   └── index.js                   # Server entry point
│
├── render.yaml                     # Render deployment config
└── README.md                       # Project Documentation
```

---

## 🎯 Project Purpose & Problem Statement

### ❌ The Problem
Small and medium businesses often struggle with:
- **Manual Inventory Tracking:** Paper-based or Excel-based stock records prone to errors.
- **No Real-Time Visibility:** Owners can't instantly see current stock levels or low-stock alerts.
- **Unorganized Sales & Purchases:** Difficulty tracking who bought what and when.
- **Supplier & Customer Chaos:** No centralized record of supplier contacts and customer history.
- **No Reports or Insights:** Zero business analytics to make informed decisions.

### ✅ The Solution
**Stock Management App** is a comprehensive mobile-first solution that gives businesses:
- A real-time **Dashboard** with stock, sales, and purchase summaries.
- Full **CRUD operations** on products, categories, suppliers, and customers.
- Complete **Sales & Purchase** tracking with invoice generation.
- **Reports & Analytics** for data-driven business decisions.
- Secure, **role-based access** for Admin and Staff users.

---

## ✨ Key Features

### 📊 Dashboard
- Live summary of total products, sales, purchases, and low-stock alerts.
- Quick-action cards for common tasks.

### 📦 Product Management
- Add, edit, delete products with category, price, quantity, and supplier info.
- Product detail view with full history.
- Low stock warning indicators.

### 🛒 Sales & Purchases
- Record new sales with customer selection and line-item detail.
- Record purchases from suppliers.
- Invoice preview and PDF sharing via `expo-print` & `expo-sharing`.

### 👥 Suppliers & Customers
- Manage full supplier and customer contact records.
- Link purchases to suppliers and sales to customers.

### 📂 Categories
- Organize products by customizable categories.

### 📈 Reports
- View sales and purchase reports with date filtering.

### 🔐 Authentication
- Secure login, registration, OTP verification, and password reset flows.
- JWT-based session management.
- Role-based access control (Admin / Staff).

### ⚙️ Settings & Profile
- Update user profile, avatar, and app preferences.
- Notification settings.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Mobile App** | React Native, Expo (~54) |
| **Navigation** | React Navigation (Stack, Tabs, Drawer) |
| **UI Library** | React Native Paper |
| **Forms** | React Hook Form |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express.js v5 |
| **Database** | MongoDB (Mongoose) |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **PDF/Sharing** | expo-print, expo-sharing |
| **Image Picker** | expo-image-picker |
| **Deployment** | Render (Backend) |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18.x or higher)
- MongoDB (Atlas or Local)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode (for emulator) or Expo Go app

---

### 1. 🖥️ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Seed the admin user:

```bash
node seedAdmin.js
```

Start the backend server:

```bash
npm start
```

---

### 2. 📱 Mobile App Setup

```bash
cd stock-management-app
npm install
```

Update the API base URL in your app's config/utils to point to your backend:

```js
// e.g., src/utils/api.js
const BASE_URL = 'http://<your-local-ip>:5000/api';
```

> ⚠️ Use your machine's **local IP address** (not `localhost`) when testing on a physical device or emulator.

Start the Expo app:

```bash
npm start
# or
npx expo start
```

Run on a specific platform:

```bash
npm run android   # Android emulator / device
npm run ios       # iOS simulator (macOS only)
npm run web       # Web browser
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Add a new product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |
| GET | `/api/categories` | Get all categories |
| GET | `/api/suppliers` | Get all suppliers |
| GET | `/api/customers` | Get all customers |
| GET | `/api/sales` | Get all sales records |
| POST | `/api/sales` | Record a new sale |
| GET | `/api/purchases` | Get all purchase records |
| POST | `/api/purchases` | Record a new purchase |
| GET | `/api/orders` | Get all orders |

---

## 📄 License

This project is licensed under the **MIT License**.

---

*Built with ❤️ for smarter business inventory management.*
