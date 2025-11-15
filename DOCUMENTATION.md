# Farm2Home - Complete Project Documentation

**Last Updated:** November 15, 2025  
**Project:** E-commerce Platform for Fresh Farm Produce  
**Tech Stack:** Django 5.2.7, PostgreSQL, DRF, Vanilla JavaScript

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Database Structure](#database-structure)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Authentication System](#authentication-system)
6. [API Endpoints](#api-endpoints)
7. [Testing Guide](#testing-guide)
8. [Deployment Notes](#deployment-notes)

---

## Project Overview

### What is Farm2Home?
An e-commerce platform connecting farmers with consumers for fresh, organic produce delivery. Features include product catalog with seasonal filtering, user authentication, shopping cart, checkout process, and address management.

### Key Features
- **Product Catalog:** 56 products (24 vegetables, 24 fruits, 8 herbs)
- **Dynamic Seasons:** Automatic season detection (winter/summer)
- **Authentication:** Modal-based login/signup system
- **Shopping Cart:** Add to cart, modify quantities
- **Checkout:** Multi-step process (shipping → payment → confirmation)
- **Address Management:** CRUD operations for delivery addresses
- **Order Tracking:** Order history and status updates

---

## Database Structure

### Models Summary

#### Customer Model
- **Fields:** customer_id, name, email, phone, address, password (hashed)
- **Features:** Unique email, password hashing with PBKDF2-SHA256
- **Sample Data:** 5 test customers created

#### Product Model
- **Fields:** product_id, name, local_name, category, price, season, discount, image, slug
- **Categories:** VEGETABLES, FRUITS, HERBS
- **Seasons:** SUMMER (Mar-Oct), WINTER (Nov-Feb), ALL_YEAR
- **Sample Data:** 56 products populated

#### Inventory Model
- **Fields:** inventory_id, product (OneToOne), stock_available
- **Features:** Tracks stock levels, auto-decrements on order
- **Sample Data:** All products have 50-500kg stock

#### Order Model
- **Fields:** order_id, customer, order_date, status, total_amount, payment
- **Status Choices:** PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
- **Sample Data:** 10 sample orders created

#### OrderItem Model
- **Fields:** item_id, order, product, quantity, price
- **Features:** Links products to orders with snapshot pricing

#### Cart Model
- **Fields:** cart_id, customer, product, quantity, added_at
- **Constraint:** unique_together (customer, product)

#### Address Model
- **Fields:** address_id, customer, label, address_line, city, postal_code, phone, is_default
- **Labels:** HOME, WORK, OTHER
- **Business Rule:** Only one default address per customer

---

## Backend Implementation

### Authentication APIs

#### Login API
- **Endpoint:** `POST /api/auth/login/`
- **Payload:** `{"email": "...", "password": "..."}`
- **Response:** Customer data with customer_id on success
- **Security:** Password verification with check_password()

#### Signup API
- **Endpoint:** `POST /api/auth/signup/`
- **Payload:** `{"name": "...", "email": "...", "phone": "...", "address": "...", "password": "..."}`
- **Validation:** Email format, password length (min 6), duplicate email check
- **Response:** New customer data with customer_id

### Checkout APIs

#### Get Cart
- **Endpoint:** `GET /api/checkout/cart/?customer_id=X`
- **Returns:** Cart items with product details, total, and count
- **Format:** Matches frontend expectations exactly

#### Create Order
- **Endpoint:** `POST /api/checkout/create-order/`
- **Payload:** Shipping info, billing info, items array, customer_id
- **Process:** Creates customer, order, order items; updates inventory; clears cart
- **Response:** Order confirmation with order number

#### Get Order Confirmation
- **Endpoint:** `GET /api/checkout/order/{order_id}/`
- **Returns:** Complete order details for confirmation page

### Address Management APIs

#### List Addresses
- **Endpoint:** `GET /api/customer/addresses/?customer_id=X`
- **Returns:** All addresses for customer with formatted data

#### Add Address
- **Endpoint:** `POST /api/customer/addresses/add/`
- **Validation:** Phone (10-15 digits), postal code (5 digits), all required fields

#### Update Address
- **Endpoint:** `PUT /api/customer/addresses/{id}/`
- **Security:** Ownership verification (customer can only edit their addresses)

#### Set Default
- **Endpoint:** `POST /api/customer/addresses/{id}/set-default/`
- **Logic:** Removes default from other addresses, sets new default

#### Delete Address
- **Endpoint:** `DELETE /api/customer/addresses/{id}/`
- **Security:** Ownership verification

### Catalog API

#### Get Products
- **Endpoint:** `GET /api/catalog/products/`
- **Filters:** category, season, in_stock, search
- **Response:** Products with computed inSeasonNow and inStock booleans

---

## Frontend Implementation

### Landing Page
- **File:** `templates/landing/index.html`
- **Features:** Hero section, product showcase, authentication modals
- **Modal:** Split-layout with farmer illustration (left.png)
- **Animations:** Blur effect on background when modal opens

### Product Catalog
- **File:** `templates/prod-catalog/index.html`
- **JS:** `static/js/catalog.js` (previously script.js)
- **Features:** 
  - Filters (category, season, price, stock)
  - Search functionality
  - Sorting options
  - Add to cart with quantity selector
  - Dynamic season indicator

### Checkout Flow
- **Files:** `templates/checkout/index.html`, `templates/checkout/payment.html`
- **JS:** `static/js/checkout.js`
- **Steps:**
  1. Shipping form (name, email, phone, address)
  2. Payment form (card details or COD)
  3. Confirmation page
- **Integration:** Loads cart from API, submits order to backend

### Account Section
- **Files:** Multiple templates in `templates/account/`
- **Features:**
  - Account overview
  - Address management (CRUD)
  - Order history
  - Payment methods
  - Settings

### Address Management
- **File:** `templates/account/addresses.html`
- **JS:** `static/js/addresses.js`
- **Features:**
  - Display all addresses with cards
  - Add/Edit/Delete with modal forms
  - Set default address
  - Inline validation
  - Animations and notifications

---

## Authentication System

### Implementation Details

#### Password Security
- **Hashing:** Django's make_password() with PBKDF2-SHA256
- **Verification:** check_password() for constant-time comparison
- **Migration:** Added password field, updated existing customers

#### Modal System
- **Design:** Split-layout with farmer illustration
- **Controls:** Open/close, form switching (login ↔ signup)
- **Keyboard:** ESC to close
- **Click:** Outside modal to close
- **Animations:** Smooth fade in/out with backdrop blur

#### User Flow
1. User clicks Login/Signup button
2. Modal appears on same page (no redirect)
3. User enters credentials
4. AJAX submission to backend API
5. On success: Save customer_id to localStorage, reload page
6. On error: Display error in modal
7. Cart loads with customer_id

#### Integration Points
- **checkout.js:** Opens login modal instead of redirecting to /login/
- **localStorage:** Stores customer_id, customer_name, customer_email
- **All pages:** Check localStorage for customer_id on load

---

## API Endpoints

### Complete Endpoint List

#### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/signup/` - User registration

#### Catalog
- `GET /api/catalog/products/` - Get products with filters

#### Checkout
- `GET /api/checkout/cart/?customer_id=X` - Get cart items
- `POST /api/checkout/create-order/` - Create order
- `GET /api/checkout/order/{id}/` - Get order details

#### Address Management
- `GET /api/customer/addresses/?customer_id=X` - List addresses
- `POST /api/customer/addresses/add/` - Add address
- `PUT /api/customer/addresses/{id}/` - Update address
- `POST /api/customer/addresses/{id}/set-default/` - Set default
- `DELETE /api/customer/addresses/{id}/` - Delete address

### Common Response Format
```json
{
  "status": "success|error",
  "message": "Descriptive message",
  "data": {...},
  "count": 0  // Optional
}
```

### HTTP Status Codes
- **200:** Successful GET/PUT/DELETE
- **201:** Successful POST (created)
- **400:** Bad request (validation error)
- **401:** Unauthorized (wrong credentials)
- **403:** Forbidden (ownership violation)
- **404:** Not found
- **409:** Conflict (duplicate email)
- **500:** Server error

---

## Testing Guide

### Backend Testing

#### Using test_auth_apis.py
```bash
python test_auth_apis.py
```
Tests login, signup, wrong password, duplicate email, etc.

#### Using test_address_api.py
```bash
python test_address_api.py
```
Tests all address CRUD operations with 11 scenarios

#### Manual API Testing
Use Postman or curl to test endpoints with various payloads

### Frontend Testing

#### Authentication
1. Click Login → Modal appears
2. Enter invalid credentials → Error in modal
3. Enter valid credentials → Success, page reloads
4. Verify localStorage has customer_id
5. Test signup flow similarly

#### Checkout
1. Add items to cart (localStorage initially)
2. Navigate to /checkout/
3. If not logged in → Login modal appears
4. Login → Cart loads from backend API
5. Fill shipping form → Validates, proceeds to payment
6. Fill payment form → Submits order
7. Confirmation displays

#### Address Management
1. Navigate to /account/addresses/
2. Click "Add New Address" → Modal opens
3. Fill form → Validates, submits
4. Address card appears
5. Click "Edit" → Modal with pre-filled data
6. Update and save → Card updates
7. Click "Set as Default" → Badge updates
8. Click "Delete" → Confirmation dialog → Deletes

### Cross-Browser Testing
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers

---

## Deployment Notes

### Static Files Migration
- **Structure:** All CSS in `static/css/`, JS in `static/js/`, images in `static/images/`
- **Templates:** Using `{% load static %}` and `{% static 'path' %}`
- **Collection:** Run `python manage.py collectstatic` before deployment

### Environment Variables
- **SECRET_KEY:** Django secret key (never commit)
- **DEBUG:** Set to False in production
- **DATABASE_URL:** PostgreSQL connection string
- **ALLOWED_HOSTS:** Add production domain

### Performance Optimizations
- **CSS Minification:** auth.min.css (49% smaller)
- **JS Minification:** auth.min.js (49% smaller)
- **Lazy Loading:** Images use loading="lazy"
- **Script Defer:** Scripts load asynchronously
- **Total Savings:** ~7.5KB per page load

### Security Checklist
- [x] Password hashing implemented
- [x] CSRF protection enabled
- [x] Input validation (client + server)
- [x] SQL injection prevention (Django ORM)
- [x] XSS prevention (Django templates)
- [ ] HTTPS enforced (production)
- [ ] Rate limiting on login attempts
- [ ] Payment gateway integration (if handling cards)

### Production Recommendations
1. Use PostgreSQL instead of SQLite
2. Enable Gzip compression
3. Set up CDN for static files
4. Implement proper logging
5. Add monitoring (Sentry, New Relic)
6. Regular database backups
7. Set up CI/CD pipeline
8. Load testing before launch

---

## Quick Reference

### URLs to Access Pages
```
http://127.0.0.1:8000/                     # Home (redirects to landing)
http://127.0.0.1:8000/landing/             # Landing page
http://127.0.0.1:8000/catalog/             # Product catalog
http://127.0.0.1:8000/checkout/            # Checkout
http://127.0.0.1:8000/account/             # Account home
http://127.0.0.1:8000/account/addresses/   # Address management
http://127.0.0.1:8000/account/orders/      # Order history
http://127.0.0.1:8000/admin/               # Django admin
```

### Common Commands
```bash
# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Run development server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run tests
python test_auth_apis.py
python test_address_api.py
```

### File Structure
```
Farm2Home/
├── Farm2Home/           # Django project settings
├── main/                # Main Django app
│   ├── models.py       # Database models
│   ├── views.py        # API views
│   ├── serializers.py  # DRF serializers
│   ├── urls.py         # URL routing
│   └── admin.py        # Admin configuration
├── static/              # Static assets
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── images/         # Product images
├── templates/           # HTML templates
│   ├── landing/        # Landing page
│   ├── prod-catalog/   # Product catalog
│   ├── checkout/       # Checkout pages
│   ├── account/        # Account pages
│   └── auth/           # Auth pages (old)
├── manage.py           # Django management script
└── requirements.txt    # Python dependencies
```

---

## Troubleshooting

### Common Issues

**Issue:** Server not starting
**Solution:** Check if port 8000 is already in use, activate virtual environment

**Issue:** Static files not loading
**Solution:** Run `python manage.py collectstatic`, check STATIC_URL in settings

**Issue:** Login not working
**Solution:** Check localStorage has customer_id, verify API endpoint returns 200

**Issue:** Cart not loading
**Solution:** Check customer_id in request, verify Cart records exist in database

**Issue:** Address operations fail
**Solution:** Verify customer_id matches address owner, check ownership validation

**Issue:** Images not displaying
**Solution:** Check image paths in static/images/, verify {% static %} tag usage

---

## Next Steps

### Completed Features ✅
- Database models and migrations
- Authentication system (login/signup)
- Product catalog with filtering
- Shopping cart functionality
- Checkout process
- Address management CRUD
- Order creation and tracking
- Admin panel configuration

### Future Enhancements 🚀
- Email verification for new users
- Password reset functionality
- Social login (Google, Facebook)
- Payment gateway integration (Stripe)
- Real-time order tracking
- Product reviews and ratings
- Wishlist functionality
- Multi-language support
- Mobile app (React Native)

---

**End of Documentation**

For specific implementation details, refer to the individual markdown files in the project root or contact the development team.
