# Hyperlocal Multi-Vendor Marketplace — Platform Features Documentation (`FEATURES.md`)

A modern, high-performance **Hyperlocal Multi-Vendor Marketplace** architecture built with a separated **Master Admin (Executive Controller)**, **Operations Admin (Dispatch, Merchant & Catalog Controller)**, **Shop Owner (Merchant Fulfillment)**, **Delivery Partner (Rider Dispatch)**, and **Customer (Consumer Shopping Portal)**.

---

## 🏛️ System Roles & Architecture

| Role | `isUser` Identifier | Responsibility | Access Level |
| :--- | :--- | :--- | :--- |
| **MASTER_ADMIN** | `master` | Platform owner, financial audit, feature flags, global settings & admin management | Complete platform governance & policy control |
| **ADMIN** (Operations) | `admin` | Daily operations, shop registration, 5-tier catalog taxonomy, dispatch oversight, disputes | Operational control & merchant enablement (`/admin/*`) |
| **SHOP_OWNER** | `shop_owner` | Shop inventory, order fulfillment, menu/catalog, revenue settlement | Store-level operations |
| **DELIVERY_PARTNER**| `delivery_boy` | Field delivery, rider acceptance, route navigation, earnings wallet | Rider mobile/web dispatch |
| **CUSTOMER** | `user` | Location-based browsing, cart, checkout, live tracking, order history | Consumer shopping portal |

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
  - `alternative_procurement`: Enables procurement fallback routing for out-of-stock items.
  - `customer_wallet`: Allows customers to maintain wallet balance and receive instant refunds.
  - `delivery_tracking`: Provides real-time interactive mapping and ETA status tracking.
  - `live_gps`: Broadcasts live geolocation coordinates of riders.
  - `campaigns`: Platform-wide and seasonal promotional discount campaigns.
  - `shop_owner_portal`: Dedicated operational portal for merchants.
  - `realtime_notifications`: Push & in-app status update alerts.

### 1.9 Global Marketplace Settings
- Commission percentage (default platform cut per order).
- Maximum delivery radius (in km).
- Base delivery fee & Free delivery threshold (₹499).
- Surge pricing multiplier and emergency closure controls.
- Standard operating hours.

### 1.10 Operations Admin Account Management
- Create, supervise, and deactivate Operations Admin accounts.
- Reset admin passwords and assign permission profiles (`OPERATIONS_ALL`, `ORDERS_READ`, `DISPUTES_WRITE`, etc.).

### 1.11 Broadcast & Push Notifications
- Create platform-wide announcements targeting: **All Users**, **Customers Only**, **Merchants Only**, or **Delivery Partners Only**.

### 1.12 Platform Appearance Customizer
- Customize Platform Branding Name and Tagline.
- Set primary and secondary theme palette colors (HSL / HEX).
- Dark Mode / Light Mode defaults.

---

## 🛡️ 2. Operations Admin Portal Features

The Operations Admin portal is tailored for day-to-day marketplace execution, merchant onboarding, complete 5-tier catalog structuring, and dispatch resolution.

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
    - Automatically creates `User` account with `role: SHOP_OWNER` and `isUser: 'shop_owner'`.
    - Automatically creates `Shop` record linked to the owner.
  - **1-Click Copy Credentials**: Instant copy button to share credentials directly with the shop owner.

### 2.3 Master Catalog Management (5-Tier Hierarchy)
1. **Measurement Units Tab (`Units`)**:
   - Manage standard measurement units (`kg`, `g`, `litre`, `ml`, `piece`, `pack`, `box`, `dozen`) with symbol uniqueness, description, and display ordering.
2. **Category & Subcategory Taxonomies (`Categories` Tab)**:
   - Root categories with Lucide icons, descriptions, and banners.
   - Subcategories linked to parent categories with explicit `allowedUnitIds` configurations.
3. **Brand Management (`Brands` Tab)**:
   - Registry for FMCG, farm, and producer brands.
4. **Master Products & Variants (`Products` Tab)**:
   - Create centralized master products with global descriptions, images, and MRP.
   - Configure packaging variants with specific unit/quantity SKUs (e.g., *1 kg*, *500 g*, *1 L*).
5. **Shop Product Listings (Multi-Vendor Inventory)**:
   - Map master product variants to individual shops.
   - Set shop-specific selling prices ($\le \text{MRP}$), real-time stock levels, and active availability switches.

### 2.4 Order Management & Pipeline Overrides
- Real-time order pipeline tracking across **Pending**, **In-Progress**, and **Completed** states.
- Update order progress (*Placed $\rightarrow$ Accepted $\rightarrow$ Preparing $\rightarrow$ Ready for Pickup $\rightarrow$ Out for Delivery $\rightarrow$ Delivered*).
- Cancel orders with logged cancellation reasons.
- **Live Delivery Tracking & Rider Dispatch**:
  - Visual milestone journey: *Confirmed $\rightarrow$ Prepared $\rightarrow$ Picked Up $\rightarrow$ En Route $\rightarrow$ Delivered*.
  - Rider assignment telemetry, vehicle details, contact triggers, and estimated arrival times.

### 2.5 Order Dispute Resolution
- Review flagged orders and customer dispute claims.
- Execute resolution actions:
  - **REFUND**: Marks payment status as `REFUNDED`, cancels order, and logs refund metadata.
  - **REJECT**: Dismisses claim and records dispute rationale.

---

## 🛒 3. Customer Storefront & Shopping Features

- **Initial Permissions Onboarding**: Mandatory 3-pillar permissions modal at signup/first login granting GPS location, browser push notifications, and pre-unlocking Web Audio API context for zero-friction alerts.
- **Dynamic Header Location Bar**: Displays detected street and city address with a live GPS badge; supports 1-tap manual re-detection anywhere in the app.
- **Hyperlocal Discovery**: Explore categories, featured groceries, fresh meats, seafood, farm vegetables, and daily staples.
- **Interactive Product Catalog**: High-res product cards, dynamic variant selectors, discount percentage badges, and instant "Add to Cart".
- **Cart & Dynamic Pricing**: Real-time quantity adjustment, automated subtotal calculations, and free delivery thresholds ($\ge ₹499$).
- **Live Order Tracking**: Interactive Leaflet map powered by free OpenStreetMap raster tiles showing real-time rider GPS movement.
- **User Account Portal**: Saved delivery address book, order history with live status updates, and digital wallet balance.
- **Editorial & Information Pages**: About Us, Contact & Support, and Marketplace News/Blog.

---

## 🧑‍🍳 4. Shop Owner (Merchant) Portal Features

- **Store Dashboard**: Daily revenue telemetry, pending orders counter, and average fulfillment time.
- **Live Kitchen / Store Orders**: Accept incoming orders, advance status from *Preparing* to *Ready for Pickup*.
- **Menu & Catalog Controls**: Instant toggle for in-stock/out-of-stock items, price overrides, and direct product creation.
- **GPS Coordinates Persistence**: Shop locations capture exact latitude/longitude coordinates via Nominatim reverse geocoding.

---

## 🛵 5. Delivery Partner (Rider) Portal Features

- **Rider Duty Switch**: Toggle `Online` / `Offline` duty status to start receiving assignments.
- **Continuous Siren & Tri-Point Distance Telemetry**:
  - High-urgency audio synthesizer alarm sounds continuously until unassigned ticket is Accepted or Rejected.
  - Computes and displays exact Haversine distances on incoming tickets: *~X km to Kitchen*, *~Y km to Customer*, and *~Z km Total Journey*.
- **Two-Stage Street Navigation**:
  - **Stage 1 (To Store)**: Highlights route polyline from rider GPS to restaurant, with 1-tap Google Maps directions to the kitchen.
  - **Stage Transition**: Prominent button **"📍 I Have Reached Restaurant (Show Customer Directions)"** advances order to `PICKED_UP`.
  - **Stage 2 (To Customer)**: Automatically refocuses map camera bounds and switches route polyline to customer doorstep, activating **"🛵 Start Transit to Customer Doorstep"** and requiring 4-digit doorstep security OTP.
- **Real-Time GPS Broadcaster**: Streams live device telemetry or simulated test rides directly to the customer radar via WebSockets.
- **Earnings Wallet**: Lifetime earnings, completed deliveries counter, and performance ratings.

---

## 🔒 6. Security, Authentication & Role-Based Access Control (RBAC)

- **Two-Factor OTP Verification (2FA)**:
  - Admin login enforces a 2-step verification flow:
    - Step 1: Email + Password authentication.
    - Step 2: 6-digit one-time passcode (OTP) verification with 5-minute expiry.
- **JWT Session Security**: Secure token authorization attached to all protected API calls.
- **Role Isolation & Guards**:
  - `requireRole(ROLES.MASTER_ADMIN)` guards master control endpoints.
  - `requireRole(ROLES.ADMIN, ROLES.MASTER_ADMIN)` guards operational endpoints.
  - Non-admin users are strictly isolated to their respective portals.
- **Audit Logging**: All database updates, status changes, credentials generation, and disputes are recorded with timestamps, actor IDs, and IP addresses.

---

## 💻 7. Technology Stack Summary

- **Frontend**: React 18, Vite, Vanilla CSS + Tailwind utility tokens, Leaflet & OpenStreetMap, Web Audio API, Socket.IO Client, Lucide Icons, Radix UI Primitives, Context API.
- **Backend**: Node.js & Express.js REST API, Socket.IO WebSockets, MongoDB with Mongoose ORM (18 Models), JWT & Bcryptjs.
- **Testing**: Supertest & Jest (comprehensive automated test suites with in-memory DB).
- **Database Collections (18 Models)**:
  - `User`, `Shop`, `Unit`, `Category`, `Subcategory`, `Brand`, `Product`, `ProductVariant`, `ShopProduct`, `Cart`, `Order`, `DeliveryPartner`, `Customer`, `ActivityLog`, `FeatureFlag`, `AppearanceSetting`, `MarketplaceSetting`, `Notification`.
