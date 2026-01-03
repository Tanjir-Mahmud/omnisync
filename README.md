# OmniSync 

![OmniSync Pro Logo](./public/brand-logo.png)

## Overview
**OmniSync Pro** is a cutting-edge, cyber-futuristic Inventory Management System (IMS) designed for high-performance businesses. It enables real-time tracking of stock across multiple warehouse locations, automated order routing, and detailed sales analytics—wrapped in a premium Cyberpunk-themed user interface.

## Key Features

### 1. 📊 Interactive Dashboard
- **Real-Time Analytics**: View **Sales Revenue (24h)**, **Total Inventory Valuation**, **Low Stock Alerts**, and **Total Item Counts** at a glance.
- **Visual Trends**: Interactive charts showing inventory movement and sales trends over the last 6 months.
- **Activity Feed**: Live audit log of recent actions (Sales, Transfers, Updates) performed by the user.

### 2. 📦 Advanced Inventory Management
- **Multi-Location Support**: Manage stock levels across unlimited warehouses or store locations from a single grid.
- **Smart Operations**:
    - **Add/Edit/Delete**: Full control over product details (SKU, Price, Stock).
    - **Stock Transfers**: Seamlessly move inventory between locations (only visible when multiple locations exist).
    - **Low Stock Indicators**: Visual warnings when items dip below their minimum threshold.

### 3. 💸 Sales & Order Processing
- **Point of Sale (POS) Logic**: Record sales directly from the inventory grid using the "Sell" action.
- **Smart Order Routing**: The system automatically determines the best warehouse to fulfill an order from, based on stock availability and proximity rules.
- **Revenue Tracking**: Sales are instantly calculated and reflected in the dashboard revenue metrics.

### 4. 🔐 Secure Authentication & User Isolation
- **Firebase Authentication**: Robust security supporting Email/Password and **Google Sign-In**.
- **Data Privacy**: Complete user isolation—each user sees only their own inventory and data.
- **Session Management**: Persistent sessions with secure cookie handling.

### 5. ⚙️ Customization & Settings
- **Profile Management**: Update user profile details.
- **Data Control**: functionality to reset or delete all account data ("Delete All Data").
- **Cyberpunk UI**: A fully custom, dark-mode-first aesthetic with neon gradients, glassmorphism, and animated elements.

---

## Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Authentication**: [Firebase Auth](https://firebase.google.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Cyberpunk Theme
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/)

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Database Setup**:
    Ensure your `.env` contains a valid `DATABASE_URL` and run:
    ```bash
    npx prisma db push
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open App**:
    Visit [http://localhost:3000](http://localhost:3000)
