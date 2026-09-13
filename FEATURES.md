# Hyperlocal Multi-Vendor Marketplace — Platform Features Documentation

A modern, high-performance **Hyperlocal Multi-Vendor Marketplace** architecture built with a separated **Master Admin (Executive Controller)** and **Operations Admin (Dispatch, Merchant & Catalog Controller)**.

---

## 🏛️ System Roles & Architecture

| Role | Responsibility | Access Level |
| :--- | :--- | :--- |
| **MASTER_ADMIN** | Platform owner, financial audit, feature flags, global settings & admin management | Complete platform governance & policy control |
| **ADMIN** (Operations) | Daily operations, shop registration, catalog management, dispatch oversight, disputes | Operational control & merchant enablement |
| **SHOP_OWNER** | Shop inventory, order fulfillment, menu/catalog, revenue settlement | Store-level operations |
| **DELIVERY_PARTNER**| Field delivery, rider acceptance, route navigation, earnings wallet | Rider mobile/web dispatch |
| **CUSTOMER** | Location-based browsing, cart, checkout, live tracking, order history | Consumer shopping portal |

---

## 👑 1. Master Admin Portal Features

The Master Admin portal is designed for high-level executive oversight, platform governance, policy enforcement, and financial analytics.

### 1.1 Executive Telemetry Dashboard
- **Financial & Operations KPIs**:
  - Gross Merchandise Value (GMV), Platform Commission Revenue, Shop Settlements, Delivery Fees, and Refunds.
  - Total Orders, Active Orders, Completed Orders, and Cancellation rate.
  - Active & Registered Merchant count.
  - Live On-Field Riders & KYC verification queue.
  - Total registered customers & spend metrics.
- **Interactive Revenue & Order Charts**: Visual time-series analytics (Today, 7 Days, 30 Days, 90 Days, or Custom Date Range).
- **Actor Status Strip**: Quick health monitoring of Riders, Merchants, and Admins.

### 1.2 Global Orders Monitoring
- Centralized real-time order feed across all registered shops.
- Filter orders by status: **Pending** (*Placed, Confirmed, Preparing*), **In-Progress** (*Assigned, Picked Up, Out for Delivery*), and **Completed** (*Delivered, Cancelled*).
- Complete order breakdown: Customer details, Shop details, Line items, Delivery partner tracking, Commission cut, and Payment status.

### 1.3 Platform Merchant Oversight
- View all marketplace shops with overall ratings, total sales volume, order counts, and live status (*Active, Temporarily Closed, Inactive*).
- Search and filter by category, merchant name, or owner contact.

### 1.4 Delivery Partner Fleet Management
- Rider fleet status: Online vs. Offline riders, Active delivery assignments.
- **Rider Verification Pipeline**: Inspect submitted KYC documents (Driving License, RC Book, Aadhaar) and verify/reject applications.
- Performance tracking: Acceptance rate, On-time delivery rate, Rating, and Total earnings.

### 1.5 Customer Directory & Telemetry
- Central customer registry with order history, address books, contact details, total platform spend, and activity status (*Active, High Activity, Inactive*).

### 1.6 Financial & Revenue Analytics
- Detailed settlement breakdowns: Shop Payouts vs. Platform Commission vs. Rider Earnings.
- Date range filtering and trend analysis.

### 1.7 Audit & Security Activity Logs
- Comprehensive audit trail recording every administrative event:
  - Actor ID, Name, Role, IP Address, Timestamp, Action type, and Affected Resource.

### 1.8 Dynamic Feature Flags (Toggle without Code Deployment)
- Real-time marketplace toggles:
  - `INSTANT_DELIVERY`: Enable/disable 15-30 min hyper-fast delivery mode.
  - `SURGE_PRICING`: Peak hour delivery surge algorithms.
  - `CASH_ON_DELIVERY`: Enable/disable COD payment methods.
  - `WALLET_PAYMENTS`: In-app customer and rider wallet features.
  - `CUSTOMER_REVIEWS`: Public ratings and product reviews.
  - `PROMO_CAMPAIGNS`: Discount codes and banner campaigns.

### 1.9 Global Marketplace Settings
- Commission percentage (default platform cut per order).
- Maximum delivery radius (in km).
- Minimum order value threshold.
- Auto-assign nearest delivery partner policy.
- Standard operating hours.

### 1.10 Operations Admin Account Management
- Create, supervise, and deactivate Operations Admin accounts.
- Reset admin passwords and assign permission profiles (`OPERATIONS_ALL`, `ORDERS_READ`, `DISPUTES_WRITE`, etc.).

### 1.11 Broadcast & Push Notifications
- Create platform-wide announcements targeting: **All Users**, **Customers Only**, **Merchants Only**, or **Delivery Partners Only**.

### 1.12 Platform Appearance Customizer
- Customize Platform Branding Name.
- Set primary and secondary theme palette colors (HSL / HEX).
- Dark Mode / Light Mode defaults.

---

## 🛡️ 2. Operations Admin Portal Features

The Operations Admin portal is tailored for day-to-day marketplace execution, merchant onboarding, catalog structuring, and dispatch resolution.

### 2.1 Operations Control Center
- Live dispatch metrics: Active pipeline orders, Online riders, Pending KYC queues, and Unresolved dispute claims.
- Quick navigation hubs for instant dispatch routing.

### 2.2 Shop Creation & Automated Credential Provisioning
- **Dedicated "Shops" Management Tab**:
  - View all registered stores in responsive Grid & List views with operating hours and sales summaries.
- **Add Shop Flow**:
  - Input: **Shop Name**, **Opening Time** (e.g., `07:00 AM`), **Ending Time** (e.g., `10:00 PM`), Contact Phone, Store Category.
  - **Automatic Credential Engine**:
    - Generates merchant email: `<slug>@marketplace.com`
    - Generates secure initial password: `<ShopName>@2026`
    - Automatically creates `User` account with `role: SHOP_OWNER`.
    - Automatically creates `Shop` record linked to the owner.
  - **1-Click Copy Credentials**: Instant copy button to share credentials directly with the shop owner.

### 2.3 Product Category Catalog (`Categories` Tab)
- Create and organize product taxonomies:
  - Category Name, Slug (auto-derived), Description, Custom Icon Picker (Apple, Milk, Coffee, Utensils, Cake, Fish, Sparkles, Boxes, etc.), Image Banner.
  - Active/Inactive visibility toggle.
  - **Preset Category Loader**: 1-click populate popular retail categories (*Beverages, Chocolates, Baby Care, Cleaning, Pet Care, Stationery*).
  - Edit and Delete category management.

### 2.4 Brand Management (`Brands` Tab)
- **Category-Linked Brand Taxonomy**:
  - Each brand is strictly associated with a parent product Category (*e.g., Amul $\rightarrow$ Dairy, Lay's $\rightarrow$ Snacks, Tata Sampann $\rightarrow$ Grocery, Himalaya $\rightarrow$ Wellness*).
  - Filter brands by category dropdown.
  - **Preset Brand Loader**: 1-click add top FMCG brands (*Amul, Nestlé, Britannia, Tata Sampann, Aashirvaad, Lay's, Coca-Cola, Organic Tattva, Himalaya*).
  - Full CRUD: Add Brand, Edit Brand, Delete Brand, and Active toggle.

### 2.5 Shop Product Catalog Management (Shop $\rightarrow$ Category $\rightarrow$ Brand $\rightarrow$ Product)
- Inside any Shop, clicking **"Manage Products"** opens the dedicated store inventory manager:
  - Telemetry: Total Listed Products, In-Stock Items, Category Coverage.
  - **"+ Add Product to Shop" Modal**:
    - **Step 1: Choose Category** (e.g., Dairy & Bakery, Fruits & Vegetables, Grocery).
    - **Step 2: Choose Brand** (dynamically filtered by the chosen category, with option for Store Brand / Generic).
    - **Step 3: Product Details**:
      - Product Name (e.g., *Amul Taaza Fresh Toned Milk*)
      - Selling Price (₹) & MRP (₹)
      - Unit / Package Size (e.g., *500 ml*, *1 kg*, *1 pc*, *1 box*)
      - Stock Quantity & In-Stock availability switch
      - Product Image URL & Description
  - In-place Stock Availability toggle (*In Stock* vs *Out of Stock*).
  - Edit Product modal & Delete Product confirmation.

### 2.6 Order Management & Pipeline Overrides
- Real-time order pipeline tracking:
  - Filter by tabs: **Pending**, **In-Progress**, and **Completed**.
  - Update order progress (*Placed $\rightarrow$ Accepted $\rightarrow$ Preparing $\rightarrow$ Ready for Pickup $\rightarrow$ Out for Delivery $\rightarrow$ Delivered*).
  - Cancel orders with cancellation reasons.

### 2.7 Order Dispute Resolution
- Review flagged orders and customer dispute claims.
- Execute resolution actions:
  - **REFUND**: Marks payment status as `REFUNDED`, cancels order, and logs refund metadata.
  - **REJECT**: Dismisses claim and records dispute rationale.

### 2.8 Customer Support & Communication
- Browse customer directory, contact info, and spend history for phone support.
- Broadcast announcements and notifications.

---

## 🔒 3. Security, Authentication & Role-Based Access Control (RBAC)

- **Two-Factor OTP Verification (2FA)**:
  - Admin login enforces a 2-step verification flow:
    - Step 1: Email + Password authentication.
    - Step 2: 6-digit one-time passcode (OTP) verification with 5-minute expiry.
- **JWT Session Security**: Secure token authorization attached to all protected API calls.
- **Role Isolation & Guards**:
  - `requireRole(ROLES.MASTER_ADMIN)` guards master control endpoints.
  - `requireRole(ROLES.ADMIN, ROLES.MASTER_ADMIN)` guards operational endpoints.
  - Non-admin users are prevented from administrative routes.
- **Audit Logging**: All database updates, status changes, credentials generation, and disputes are recorded with timestamps, actor IDs, and IP addresses.

---

## 💻 4. Technology Stack

- **Frontend**:
  - React 18, Vite
  - Vanilla CSS + Tailwind utility tokens
  - Lucide React Iconography
  - Custom responsive layout with Glassmorphism & Modern Theme Design System
- **Backend**:
  - Node.js & Express.js REST API
  - MongoDB with Mongoose ORM
  - JWT (JSON Web Tokens) & Bcrypt password hashing
  - Supertest & Jest (23 automated test cases)
- **Database Collections**:
  - `User`, `Shop`, `Category`, `Brand`, `Product`, `Order`, `DeliveryPartner`, `Customer`, `ActivityLog`, `FeatureFlag`, `AppearanceSetting`, `MarketplaceSetting`, `Notification`
