# Farm2Home - Project Structure

## Overview
Farm2Home is an e-commerce platform for fresh, organic farm produce. The project is organized in a modular structure for better maintainability and scalability.

## 📁 Project Structure (Fully Organized)

```
Farm2Home/
├── index.html                    # REDIRECT → /landing/index.html (Auto-redirects to landing page)
│
├── landing/                      # Landing Page Module ✨ NEW
│   ├── index.html                # Main landing page (ENTRY POINT)
│   ├── landing.css              # Landing page styles
│   ├── landing.js               # Landing page functionality (carousel, scroll)
│   └── authentication.js        # Login/Signup modal functionality
│
├── prod-catalog/                # Product Catalog Module
│   ├── index.html               # Product catalog page
│   ├── styles.css               # Product catalog styles
│   └── script.js                # Product catalog logic (filters, search, cart)
│
├── checkout/                    # Checkout Module
│   ├── index.html               # Shipping form (Step 1)
│   ├── payment.html             # Payment method selection (Step 2)
│   ├── checkout.css             # Checkout & shipping styles
│   ├── payment.css              # Payment page styles
│   ├── checkout.js              # Shipping form logic
│   ├── payment.js               # Payment logic & card display
│   └── curve.png                # Wavy background image
│
├── auth/                        # Authentication Module
│   ├── auth.css                 # Auth styles
│   ├── auth.js                  # Auth logic
│   ├── login.html               # Login page
│   └── signup.html              # Signup page
│
├── images/                      # Product Images
│   ├── vegetables/              # Vegetable images (24 items)
│   ├── fruits/                  # Fruit images (24 items)
│   └── herbs/                   # Herb images (8 items)
│
├── PROJECT_STRUCTURE.md         # This file
├── README.md
├── optimize-images.py
├── remove-white-bg.py
│
└── [Deprecated root files - kept for reference]
    ├── landing.html             # OLD: Use /landing/index.html instead
    ├── landing.css              # OLD: Moved to /landing/
    ├── landing.js               # OLD: Moved to /landing/
    ├── authentication.js        # OLD: Moved to /landing/
    ├── styles.css               # OLD: Copied to /prod-catalog/
    └── script.js                # OLD: Copied to /prod-catalog/
```

## 🔗 Navigation Flow

```
1. ENTRY POINT: http://localhost:8000/
   ↓ (Redirects to landing page)
   
2. Landing Page (landing/index.html)
   ├─→ Login/Signup Buttons → Modal (landing/authentication.js)
   ├─→ "Explore Products" Button → Product Catalog (prod-catalog/index.html)
   ├─→ "Shop Now" Button → Product Catalog (prod-catalog/index.html)
   ├─→ "Browse All Products" Button → Product Catalog (prod-catalog/index.html)
   ├─→ "Start Shopping" Button → Product Catalog (prod-catalog/index.html)
   └─→ Footer "Shop" Link → Product Catalog (prod-catalog/index.html)

3. Product Catalog (prod-catalog/index.html)
   ├─→ Header "Home" Link → Landing Page (../landing/index.html)
   ├─→ Filters, Search, Sort Products
   ├─→ "Add to Cart" → Side Cart Popup
   ├─→ "Proceed to Checkout" Button → Shipping Form (../../checkout/index.html)
   └─→ Footer Links → Various sections

4. Checkout Flow
   ├─→ Step 1: Shipping Form (checkout/index.html)
   │   └─→ "Proceed to Payment" → Step 2
   │
   ├─→ Step 2: Payment Methods (checkout/payment.html)
   │   ├─→ Credit/Debit Card Payment
   │   └─→ Cash on Delivery (COD)
   │
   └─→ Step 3: Confirmation (to be created)

5. Authentication
   └─→ Login/Signup Modals (landing/authentication.js)
       ├─→ Opens from Landing Page buttons
       └─→ Modal management (open, close, switch)
```

## 📍 Access URLs

```
http://localhost:8000/                           # REDIRECTS to landing page
http://localhost:8000/landing/index.html         # Main Landing Page (ENTRY POINT)
http://localhost:8000/prod-catalog/index.html    # Product Catalog
http://localhost:8000/checkout/index.html        # Shipping Form (Step 1)
http://localhost:8000/checkout/payment.html      # Payment Methods (Step 2)
```

## 📝 File Descriptions

### Landing Page Module (`/landing/`)
- **index.html**: Main entry point with hero section, features, product showcase, about section, and contact form. Updated paths point to `../prod-catalog/` and `../images/`
- **landing.css**: All styling for landing page components
- **landing.js**: Carousel functionality, smooth scrolling, form handling
- **authentication.js**: Login/Signup modal logic (separated for reusability)

### Product Catalog Module (`/prod-catalog/`)
- **index.html**: Main product listing page with updated navigation links
- **styles.css**: Product grid, filters, cart sidebar styles
- **script.js**: Product data, filtering, search, sorting, cart management with updated image paths

### Checkout Module (`/checkout/`)
- **index.html**: Shipping form (Step 1)
- **payment.html**: Payment method selection (Step 2)
- **checkout.css**: Styles for shipping and checkout forms
- **payment.css**: Payment page styling with card display
- **checkout.js**: Shipping form validation and navigation
- **payment.js**: Payment logic, card formatting, COD handling
- **curve.png**: Wavy background image

### Authentication Module (`/auth/`)
- **login.html**: Login page
- **signup.html**: Signup page
- **auth.js**: Authentication logic
- **auth.css**: Auth page styling

### Images (`/images/`)
- **vegetables/**: 24 vegetable product images (transparent PNG)
- **fruits/**: 24 fruit product images (transparent PNG)
- **herbs/**: 8 herb product images (transparent PNG)

## 🚀 How to Use

### 1. Running the Server
```bash
cd /workspaces/Farm2home
python3 -m http.server 8000
```

### 2. Accessing Pages
- **Auto Entry Point**: `http://localhost:8000/` → Redirects to landing page
- **Landing Page**: `http://localhost:8000/landing/index.html` (Main home page)
- **Product Catalog**: `http://localhost:8000/prod-catalog/index.html` (Browse products)
- **Checkout (Shipping)**: `http://localhost:8000/checkout/index.html` (Step 1)
- **Checkout (Payment)**: `http://localhost:8000/checkout/payment.html` (Step 2)

### 3. Complete User Journey
```
1. Open http://localhost:8000/ 
   ↓ (Auto-redirects to landing page)
2. View landing page with hero, features, and product showcase
3. Click "Login" or "Sign Up" to open auth modals
4. Click "Shop Now" or "Explore Products" button
5. Browse products with filters, search, and sorting
6. Add items to cart (side popup)
7. Click "Proceed to Checkout"
8. Fill shipping form and proceed
9. Select payment method (Card or COD)
10. Complete order
```

## ✨ Key Features

### Landing Page
- ✅ Hero section with call-to-action buttons
- ✅ Features grid (Organic, Fresh Delivery, Sustainable, etc.)
- ✅ Product showcase carousel with auto-slide
- ✅ About section with mission statement
- ✅ Contact form with email/phone
- ✅ Login/Signup modals with smooth transitions
- ✅ Responsive navigation bar
- ✅ Footer with links and social media

### Product Catalog
- ✅ Grid/List view toggle
- ✅ 56 products (vegetables, fruits, herbs)
- ✅ Advanced filtering:
  - Category (Vegetables, Fruits, Herbs)
  - Price range (Under 100, 100-200, 200-500, 500+)
  - Season (Winter, Summer, Year-round)
  - In Season Now indicator
- ✅ Search functionality (real-time)
- ✅ Sorting options:
  - Featured
  - Price: Low to High
  - Price: High to Low
  - Date: New to Old
- ✅ Shopping cart with side popup
- ✅ Product count display
- ✅ Cart subtotal and total calculations

### Checkout Process
- ✅ Step 1: Shipping Form
  - Full name, email, phone
  - Delivery address with city/state/zip
  - Form validation
- ✅ Step 2: Payment Methods
  - Credit/Debit card with real-time display
  - Cardholder name, card number, expiry, CVV
  - Card formatting and validation
  - Cash on Delivery (COD) option
  - Order summary
- ✅ localStorage persistence for form data

### Authentication
- ✅ Login modal with email/password
- ✅ Signup modal with full registration form
- ✅ Form validation
- ✅ Remember me checkbox
- ✅ Forgot password link
- ✅ Modal switching (Login ↔ Signup)
- ✅ Click-outside-to-close functionality

## ✨ Key Functions

### Authentication
- `openLoginModal()` - Open login modal
- `openSignupModal()` - Open signup modal
- `closeLoginModal()` - Close login modal
- `closeSignupModal()` - Close signup modal
- `switchToLogin()` - Switch from signup to login
- `switchToSignup()` - Switch from login to signup

### Product Catalog
- `renderProducts()` - Render products to grid/list
- `applyFilters()` - Apply selected filters
- `searchProducts()` - Search by product name
- `sortProducts()` - Sort by featured/price/date
- `addToCart()` - Add item to shopping cart
- `toggleView()` - Toggle between grid and list view

### Checkout
- `validateShippingForm()` - Validate shipping details
- `validatePaymentForm()` - Validate payment details
- `updateCardDisplay()` - Update credit card display in real-time
- `switchPaymentMethod()` - Switch between Card and COD

## 📦 Product Data Structure
```javascript
{
    id: 1,
    name: 'Tomato',
    variety: 'Tamatar',
    price: 120,
    image: '../images/vegetables/tomato.png',
    category: 'vegetables',
    season: 'summer',
    inStock: true,
    inSeasonNow: true
}
```

## 💾 localStorage Keys
- `checkoutCart` - Items in shopping cart
- `shippingData` - Shipping address and details
- `billingData` - Billing address and details
- `paymentData` - Payment method and details

## 🔄 Image Paths
All product images are stored in `/images/` with category subdirectories:
- `/images/vegetables/*.png` - Vegetable images (24)
- `/images/fruits/*.png` - Fruit images (24)
- `/images/herbs/*.png` - Herb images (8)

Images use root-relative paths for proper loading across all pages.

## 🎯 Future Enhancements
- [ ] Confirmation page (Step 3 of checkout)
- [ ] User accounts and authentication backend
- [ ] Payment gateway integration
- [ ] Order history and tracking
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Admin dashboard for product management

## 📞 Contact
For questions or issues, contact: hello@farm2home.com

---
Last Updated: November 2, 2025
