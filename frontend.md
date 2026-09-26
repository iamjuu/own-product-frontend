# Hyperlocal Multi-Vendor Marketplace — Frontend Architecture & UI Guide (`frontend.md`)

> **Document Type**: Client Application Specification & Technical Architecture  
> **Source Directory**: `client/`  
> **Last Updated**: 2026-09-27  
> **Core Companion Files**: [`main.md`](./main.md) | [`FEATURES.md`](./FEATURES.md) | [`backend.md`](./backend.md)

---

## 🎨 1. Frontend Technology Stack & Design System

### 1.1 Technology Stack
- **Framework**: React 18 (`react`, `react-dom`)
- **Build Tool**: Vite (`@vitejs/plugin-react`)
- **Styling**: Custom modern design tokens + Tailwind utility classes (`tailwindcss`, `postcss`, `autoprefixer`)
- **Design Tokens**: Standardized CSS variables in [`client/src/index.css`](file:///d:/desktop/freelance/own-product/client/src/index.css)
- **Typography**: Google Fonts — **Manrope** (`300; 400; 500; 600; 700; 800`)
- **Icons**: `lucide-react`
- **Real-Time Mapping**: Leaflet (`leaflet`) with 100% Free OpenStreetMap raster tiles
- **Real-Time Communication**: Socket.IO Client (`socket.io-client`)
- **Audio Synthesizer**: Zero-dependency Web Audio API sound generator (`soundAlert.js`)
- **UI Primitives**: Radix UI (`@radix-ui/react-switch`, `@radix-ui/react-label`, `@radix-ui/react-dialog`)
- **Utilities**: `clsx`, `tailwind-merge`, `date-fns`

### 1.2 Design Tokens & Visual Aesthetics
The application uses a crisp modern marketplace theme:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `--primary` | `#6339f4` | Vivid Royal Violet brand primary |
| `--primary-hover` | `#5327ec` | Darkened violet for hover & focus states |
| `--primary-light` | `#ece8ff` | Soft lavender accent background |
| `--accent-orange` | `#ff7622` | Energetic action & CTA accent |
| `--bg-app` | `#f0f2fb` / `#f8f9fd` | Modern subtle grayish-blue slate background |
| `--card-bg` | `#ffffff` | Crisp pure white surface |
| `--text-dark` | `#181829` / `#181c2e` | High-contrast deep ink font color |
| `--text-muted` | `#8a87a6` / `#646982` | Subdued secondary font color |

#### Core CSS Utility Classes
- `.theme-card`: Rounded 24px (`1.5rem`), subtle dual-drop shadow, delicate 1px border.
- `.theme-card-hover`: Dynamic micro-interaction lifting element by `-2px` with expanded glow shadow.
- `.theme-sidebar`: Vertical linear gradient (`#6736f8` $\rightarrow$ `#6030ea` $\rightarrow$ `#5725e4`), rounded 32px pill silhouette with ambient violet box shadow.
- `.theme-sidebar-card`: Translucent glass container (`rgba(255,255,255,0.16)`), backdrop-filter blur `10px`, white translucent border.

---

## 🧭 2. Client Architecture & Directory Layout

```
client/src/
├── api/                   # API client layer & HTTP request utilities
├── components/            # Reusable UI & Layout components
│   ├── auth/              # InitialPermissionsModal (GPS, Push, Audio)
│   ├── common/            # ErrorBoundary, modals, spinners
│   ├── layout/            # Layout wrappers per portal (User, Rider, Admin, Master)
│   ├── tracking/          # RealtimeLiveMap (Leaflet OSM), LiveDeliveryTrackingModal
│   └── ui/                # Buttons, inputs, switches, dialogs
├── context/               # Global Context & State management
│   ├── AuthContext.jsx    # Session, JWT, user role, 2FA OTP state
│   ├── CartContext.jsx    # Shopping cart, item quantities, pricing totals
│   └── PlatformContext.jsx# Dynamic theme colors, branding, feature flags
├── data/                  # Static mocks and preset catalog templates
├── lib/                   # Utility helpers (formatting, class mergers)
├── utils/                 # Audio synthesizer (soundAlert.js), calculation helpers
├── pages/                 # Role-based portal views
│   ├── auth/              # Dual-step login & OTP verification
│   ├── master_admin/      # Executive governance screens
│   ├── admin/             # Operations management screens (AdminRoutes)
│   │   ├── dashboard/     # Operations triage KPIs
│   │   ├── shops/         # Shop provisioning & credentials
│   │   ├── categories/    # Category & subcategory taxonomies
│   │   ├── brands/        # Brand management
│   │   ├── units/         # Measurement unit manager
│   │   └── products/      # Master product & shop listings manager
│   ├── shop_owner/        # Store catalog, menu & order management screens
│   ├── delivery_boy/      # Rider dashboard & duty toggle screens
│   └── user/              # Customer storefront & pages
│       ├── dashboard/     # Storefront with category carousels & deals
│       ├── product/       # Product detail page with variant selection
│       ├── shop/          # Shop catalog & filtering
│       ├── profile/       # User profile, wallet & address book
│       ├── about/         # About marketplace page
│       ├── contact/       # Support & contact page
│       └── news/          # Platform blog / news page
├── App.jsx                # Root router & role-based conditional rendering
├── index.css              # Global design tokens, animations, scrollbars
└── main.jsx               # React DOM entry point
```

---

## 🔐 3. State Management & Context Architecture

### 3.1 `AuthContext` ([`client/src/context/AuthContext.jsx`](file:///d:/desktop/freelance/own-product/client/src/context/AuthContext.jsx))
Handles authentication lifecycle, persistent token storage, and two-factor authentication:
- **State**:
  - `user`: Authenticated user object `{ id, name, email, role, isUser, avatar, permissions }`.
  - `token`: JWT bearer string stored in `localStorage`.
  - `isAuthenticated`: Boolean derived from token presence and user profile.
  - `isLoading`: Initial boot verification flag.
- **Key Methods**:
  - `login(email, password)`: Sends credentials to `/api/auth/login`. If 2FA is required, sets `requiresOtp: true` and preserves pending email in `sessionStorage`.
  - `verifyOtp(email, otp)`: Submits 6-digit OTP code to `/api/auth/verify-otp`. On success, saves token, sets user, and clears session temp data.
  - `resendOtp(email)`: Triggers new OTP code generation with cooldown timer.
  - `logout()`: Clears tokens, resets user state, and removes session cache.

### 3.2 `CartContext` ([`client/src/context/CartContext.jsx`](file:///d:/desktop/freelance/own-product/client/src/context/CartContext.jsx))
Manages active customer cart, real-time quantity mutations, and pricing calculations:
- **State**:
  - `cartItems`: Array of cart items with quantity, unit price, and variant metadata.
  - `subtotal`: Sum of item prices.
  - `deliveryFee`: Free for orders $\ge ₹499$, otherwise ₹30.
  - `discount`: Active promotion deduction.
  - `totalAmount`: Net payable amount.
- **Key Methods**:
  - `addToCart(product, quantity)`
  - `updateQuantity(productId, quantity)`
  - `removeFromCart(productId)`
  - `clearCart()`

### 3.3 `PlatformContext` ([`client/src/context/PlatformContext.jsx`](file:///d:/desktop/freelance/own-product/client/src/context/PlatformContext.jsx))
Maintains dynamic platform branding, theme customizations, and feature toggles:
- **State**:
  - `appearance`: Platform Title, Primary Color, Secondary Color, Default Theme (`DARK` / `LIGHT`).
  - `featureFlags`: Record of active flags (`customer_wallet`, `delivery_tracking`, `live_gps`, etc.).
  - `marketplaceSettings`: Radius, commissions, and platform parameters.
- **Dynamic Theme Injection**: Injects CSS variables onto the `:root` element in real time when modified by administrators without requiring a rebuild or page reload.

### 3.4 Permissions, Geolocation & Audio Architecture
Manages critical device access for real-time tracking, alarms, and notifications:
- **`InitialPermissionsModal`** ([`client/src/components/auth/InitialPermissionsModal.jsx`](file:///d:/desktop/freelance/own-product/client/src/components/auth/InitialPermissionsModal.jsx)):
  - Modal presented at registration/signup or on unconfigured sessions (`!localStorage.getItem('app_permissions_configured')`).
  - Coordinates native prompts for **Precise GPS Location**, **Push Notifications**, and **Audio Autoplay**.
- **Audio Synthesizer** ([`client/src/utils/soundAlert.js`](file:///d:/desktop/freelance/own-product/client/src/utils/soundAlert.js)):
  - Built on the Web Audio API without third-party audio asset dependencies.
  - Automatically synthesizes the high-urgency continuous delivery boy alarm (`startDeliveryBoyContinuousAlarm`), customer rider-assigned melodic chimes (`playCustomerRiderAssignedChime`), and order confirmation pings.
  - Handles browser gesture unlocking (`unlockAudioContext`) during user taps.

---

## 📱 4. Portals & Page Directory

### 4.1 Authentication & Onboarding Portal (`pages/auth/Login.jsx`)
- **Step 1: Credentials Screen**: Email + password inputs with password visibility toggle, role credentials quick-filler buttons, and validation.
- **Step 2: 2FA OTP Screen**:
  - Automatically triggered for `MASTER_ADMIN` and `ADMIN` roles, as well as new user registration verification.
  - 6-digit code input with live formatting and countdown timer.
- **Step 3: Initial Permissions Onboarding (`InitialPermissionsModal.jsx`)**:
  - Triggered immediately after account verification or on first login.
  - Asks user to grant GPS Location, Push Notifications, and unblock audio alarms.

### 4.2 Customer Storefront Portal (`pages/user/`)
- **Storefront Home (`dashboard/Dashboard.jsx`)**: Category chips, hero banners, top trending products, quick "Add to Cart" triggers.
- **Dynamic Header Location Bar (`components/layout/UserLayout.jsx`)**:
  - Desktop utility bar and mobile top bar display the user's detected address with a live `GPS` badge.
  - Interactive click listener (`handleDetectLocationManually`) enables instant re-detection of device coordinates.
- **Product Detail (`product/ProductDetailPage.jsx`)**: High-res image gallery, variant unit selectors, MRP discount badges, nutritional/item descriptions, customer reviews.
- **Shop Catalog (`shop/ShopCatalogPage.jsx`)**: Search, category filters, price sorting, and store inventory listings.
- **User Profile & Orders (`profile/UserProfilePage.jsx`)**: Address book management, wallet balance telemetry, order history with live status tracking.
- **Content Pages**: `about/AboutPage.jsx`, `contact/ContactPage.jsx`, `news/NewsPage.jsx`.

### 4.3 Master Admin Portal (`pages/master_admin/`)
Renders inside `MasterAdminLayout` when `user.role === 'MASTER_ADMIN'`:
1. **Executive Dashboard (`dashboard/Dashboard.jsx`)**: GMV (₹), Commission revenue, active orders, live riders, shop counts, interactive trend charts (*Today, 7D, 30D, 90D*).
2. **Orders Oversight (`orders/OrdersList.jsx`)**: Filter tabs (`Pending`, `In-Progress`, `Completed`) and order inspection modal.
3. **Shop Management (`shops/ShopsList.jsx`)**: Grid/table view of all marketplace shops with revenue metrics and status badges.
4. **Delivery Partner Fleet (`delivery_partners/DeliveryPartnersList.jsx`)**: KYC verification queue (`pending` tab) with document approval/rejection actions and verified active fleet.
5. **Customer Directory (`customers/CustomersList.jsx`)**: Directory with total spend, order counts, and address previews.
6. **Financial Analytics (`analytics/AnalyticsDashboard.jsx`)**: Settled shop payouts, rider delivery fees, platform commission retention.
7. **Activity Logs (`activity_logs/ActivityLogsList.jsx`)**: Immutable audit trail.
8. **Feature Flags (`features/FeaturesList.jsx`)**: Zero-downtime toggles.
9. **Operations Admin Management (`admins/AdminsList.jsx`)**: Account provisioning and permission assignments.
10. **Broadcast Notifications (`notifications/NotificationsList.jsx`)**: System-wide announcements.
11. **Appearance Customizer (`appearance/AppearanceSettings.jsx`)**: Real-time color picker and branding title editor.
12. **Marketplace Settings (`settings/MarketplaceSettings.jsx`)**: Commission percentage, delivery radius (km), minimum order value.

### 4.4 Operations Admin Portal (`pages/admin/` via `AdminRoutes.jsx`)
Renders inside `AdminLayout` when `user.role === 'ADMIN'`:
1. **Operations Dashboard (`dashboard/Dashboard.jsx`)**: Live dispatch triage KPIs.
2. **Shop Provisioning Hub (`shops/AdminShopsList.jsx`)**:
   - Create shop modal with **Automated Credential Engine** and 1-click credential copying.
   - **"Use Current Location" GPS Capture**: Auto-detects coordinates via `navigator.geolocation`, reverse-geocodes with Nominatim, and populates Street, City, Latitude, and Longitude for exact map routing.
3. **Unit Manager (`units/UnitsList.jsx`)**: Standard measurement unit registry (`kg`, `g`, `litre`, `ml`, `piece`, `pack`, `box`, `dozen`).
4. **Category & Subcategory Taxonomies (`categories/CategoriesList.jsx`)**: Full CRUD with auto-slug generation, Lucide icon picker, and allowed unit configurations.
5. **Brand Management (`brands/BrandsList.jsx`)**: FMCG and producer brands linked to categories.
6. **Products & Multi-Vendor Inventory (`products/AdminProductsList.jsx`)**: Master catalog products, SKU packaging variants, and shop listing price/stock overrides.
7. **Order & Dispute Resolution (`orders/OrdersList.jsx`)**: Pipeline overrides and dispute resolutions (`REFUND` or `REJECT`).

### 4.5 Shop Owner Portal (`pages/shop_owner/`)
Renders inside `ShopOwnerLayout` when `user.role === 'SHOP_OWNER'`:
1. **Merchant Dashboard (`dashboard/Dashboard.jsx`)**: Today's revenue, pending orders counter, average fulfillment time.
2. **Live Order Fulfillment (`orders/ShopOwnerOrders.jsx`)**: Accept incoming orders, advance status (`Preparing` $\rightarrow$ `Ready for Pickup`).
3. **Menu / Product Catalog (`menu/ShopOwnerMenu.jsx`)**: Quick in-stock toggle, price adjustments, new item listings.

### 4.6 Delivery Partner Portal (`pages/delivery_boy/`)
Renders inside `DeliveryBoyLayout` when `user.role === 'DELIVERY_PARTNER'`:
- **Rider Console (`dashboard/Dashboard.jsx`)**:
  - **Broadcast Alarm & Distance Telemetry**:
    - Synthesizes a continuous alert sound until ticket is Accepted or Rejected.
    - Renders exact Haversine distance telemetry on incoming order cards (`~X km to Kitchen`, `~Y km to Customer`, `~Z km Total Trip`).
  - **Two-Stage Live Navigation Flow**:
    - **Stage 1 (`DELIVERY_PARTNER_ASSIGNED` / `TO_STORE`)**: Map polyline and Google Maps navigation direct rider to the restaurant kitchen.
    - **Arrival Action**: Prominent button **"📍 I Have Reached Restaurant (Show Customer Directions)"** advances status to `PICKED_UP`.
    - **Stage 2 (`PICKED_UP` & `OUT_FOR_DELIVERY` / `TO_CUSTOMER`)**: Map automatically transitions camera bounds and polylines to customer doorstep, activating **"🛵 Start Transit to Customer Doorstep"** and 4-digit doorstep OTP completion.
  - **Real-Time GPS Broadcaster**: Streams live device GPS coordinates (`navigator.geolocation.watchPosition`) or simulated test rides directly to customer radar via WebSockets.
  - **100% Free OpenStreetMap Map Engine (`components/tracking/RealtimeLiveMap.jsx`)**: Leaflet street map powered by official OpenStreetMap raster tiles (zero watermarks), featuring animated vehicle pins and stage-aware routes.

---

## 🚀 5. Development & Build Commands

All frontend commands must be executed from the `client/` directory:

```bash
# Start local development server (Vite on default http://localhost:5173)
npm run dev

# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```
