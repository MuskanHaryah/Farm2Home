# Address Management Testing Guide

## Overview
This document provides comprehensive testing instructions for the Address Management System, covering both backend API endpoints and frontend functionality.

---

## 📋 Prerequisites

1. **Database Setup**
   - Run migrations: `python manage.py migrate`
   - Create a superuser: `python manage.py createsuperuser`
   - Verify customers exist in database

2. **Server Running**
   - Start server: `python manage.py runserver`
   - Server should be accessible at `http://127.0.0.1:8000/`

3. **Test Data**
   - At least one customer account (ID: 6 recommended - Muskan's account)
   - Multiple addresses for comprehensive testing (optional)

---

## 🔧 Step 27: API Endpoint Testing

### Automated Testing

**Run the test script:**
```bash
cd Farm2Home
python test_address_api.py
```

This script will automatically test all 11 scenarios:
- ✅ GET addresses (success)
- ✅ GET addresses (invalid customer)
- ✅ POST add address (valid data)
- ✅ POST add address (invalid phone)
- ✅ POST add address (invalid postal code)
- ✅ POST add address (missing fields)
- ✅ PUT update address (owned)
- ✅ PUT update address (not owned - should fail)
- ✅ POST set default address
- ✅ DELETE address (owned)
- ✅ DELETE address (not owned - should fail)

### Manual API Testing

Use **Postman**, **cURL**, or **Browser DevTools** to test:

#### 1. GET - Fetch All Addresses
```http
GET http://127.0.0.1:8000/api/customer/addresses/?customer_id=6
```
**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Addresses retrieved successfully",
  "data": [...],
  "count": 2
}
```

#### 2. POST - Add New Address
```http
POST http://127.0.0.1:8000/api/customer/addresses/add/
Content-Type: application/json

{
  "customer_id": 6,
  "label": "HOME",
  "address_line": "123 Main Street, Apartment 4B",
  "city": "Lahore",
  "postal_code": "54000",
  "phone": "03001234567",
  "is_default": true
}
```
**Expected Response (201):**
```json
{
  "status": "success",
  "message": "Address added successfully",
  "data": {
    "address_id": 1,
    "label": "HOME",
    ...
  }
}
```

#### 3. PUT - Update Address
```http
PUT http://127.0.0.1:8000/api/customer/addresses/1/
Content-Type: application/json

{
  "customer_id": 6,
  "label": "WORK",
  "address_line": "Updated Address Line",
  "city": "Karachi",
  "postal_code": "75000",
  "phone": "03009876543",
  "is_default": false
}
```
**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Address updated successfully",
  "data": {...}
}
```

#### 4. POST - Set Default Address
```http
POST http://127.0.0.1:8000/api/customer/addresses/1/set-default/
Content-Type: application/json

{
  "customer_id": 6
}
```
**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Address set as default successfully",
  "data": {...}
}
```

#### 5. DELETE - Remove Address
```http
DELETE http://127.0.0.1:8000/api/customer/addresses/2/
Content-Type: application/json

{
  "customer_id": 6
}
```
**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Address deleted successfully"
}
```

### Validation Testing

#### Test Invalid Phone Number
```json
{
  "phone": "123"  // Too short - should return 400
}
```
**Expected:** `400 Bad Request` with validation error

#### Test Invalid Postal Code
```json
{
  "postal_code": "123"  // Not 5 digits - should return 400
}
```
**Expected:** `400 Bad Request` with validation error

#### Test Missing Required Fields
```json
{
  "customer_id": 6,
  "label": "HOME"
  // Missing: address_line, city, postal_code, phone
}
```
**Expected:** `400 Bad Request` with validation error

#### Test Ownership Violation
```json
{
  "customer_id": 999  // Different customer - should return 403/404
}
```
**Expected:** `403 Forbidden` or `404 Not Found`

---

## 🎨 Step 28: Frontend Functionality Testing

### Prerequisites
1. Server running at `http://127.0.0.1:8000/`
2. A customer account with email and password
3. Browser with DevTools open (F12)

### Test Flow

#### 1. Authentication & Authorization
- [ ] Visit `http://127.0.0.1:8000/account/addresses/` without login
  - **Expected:** Redirected to `/landing/`
- [ ] Login with valid credentials
  - **Expected:** Successful login, redirected to account page
- [ ] Navigate to addresses page
  - **Expected:** Addresses page loads successfully

#### 2. Page Load & Data Fetching
- [ ] Check Console for errors
  - **Expected:** No JavaScript errors
- [ ] Verify sidebar profile displays
  - **Expected:** Name and email shown from localStorage
- [ ] Check addresses container
  - **Expected:** If addresses exist, cards render; if not, empty state shows

#### 3. Empty State Display
- [ ] If no addresses exist:
  - **Expected:** Empty state message displayed
  - **Expected:** "Add New Address" button visible and clickable

#### 4. Add New Address
- [ ] Click "Add New Address" button
  - **Expected:** Modal opens with empty form
- [ ] Fill in all fields:
  - Label: HOME
  - Address Line: 123 Test Street
  - City: Lahore
  - Postal Code: 54000
  - Phone: 03001234567
  - Check "Set as default"
- [ ] Click Save/Submit
  - **Expected:** Loading state shows (button disabled)
  - **Expected:** Success notification appears
  - **Expected:** Modal closes automatically
  - **Expected:** New address appears in the list

#### 5. Form Validation - Add Address
- [ ] Try submitting with empty fields
  - **Expected:** Validation errors shown inline
- [ ] Enter invalid phone (e.g., "123")
  - **Expected:** "Phone must be 10-15 digits" error
- [ ] Enter invalid postal code (e.g., "123")
  - **Expected:** "Postal code must be exactly 5 digits" error
- [ ] Enter valid data and submit
  - **Expected:** Address created successfully

#### 6. Edit Existing Address
- [ ] Click "Edit" button on an address card
  - **Expected:** Modal opens with pre-filled form
  - **Expected:** All fields populated with current values
- [ ] Modify address line: "Updated Address 999"
- [ ] Change city to "Faisalabad"
- [ ] Click Save
  - **Expected:** Loading state shows
  - **Expected:** Success notification appears
  - **Expected:** Modal closes
  - **Expected:** Address card updates with new information

#### 7. Form Validation - Edit Address
- [ ] Open edit modal
- [ ] Clear the address line field
- [ ] Try to submit
  - **Expected:** Validation error "Address line is required"
- [ ] Enter invalid phone
  - **Expected:** Validation error shown
- [ ] Fix errors and resubmit
  - **Expected:** Update successful

#### 8. Set Default Address
- [ ] Find a non-default address
- [ ] Click "Set as Default" button
  - **Expected:** Loading state on button
  - **Expected:** Success notification
  - **Expected:** Green "Default" badge appears on this card
  - **Expected:** Previous default badge removed

#### 9. Delete Address
- [ ] Click "Delete" button on a non-default address
  - **Expected:** Confirmation dialog appears
  - **Expected:** Dialog shows address label
- [ ] Click "Cancel"
  - **Expected:** Dialog closes, address remains
- [ ] Click Delete again, then "Confirm"
  - **Expected:** Loading state shows
  - **Expected:** Success notification
  - **Expected:** Address card fades out and disappears
  - **Expected:** Remaining addresses re-render

#### 10. Delete Constraints
- [ ] If only one address exists, try to delete it
  - **Expected:** Error message "Cannot delete the only address"
  - **OR** Delete button disabled

#### 11. Multiple Addresses Display
- [ ] Add 3-4 addresses
  - **Expected:** All cards display in grid layout
  - **Expected:** Each card shows icon based on label (HOME/WORK/OTHER)
  - **Expected:** Default address has green badge
  - **Expected:** Phone numbers formatted correctly

#### 12. Loading States
- [ ] During fetch on page load:
  - **Expected:** Loading indicator in container
  - **Expected:** "Add New Address" button disabled
- [ ] During add/edit/delete operations:
  - **Expected:** Button shows "Processing..." or disabled
  - **Expected:** User cannot submit twice

#### 13. Error Handling
- [ ] Stop the Django server
- [ ] Try adding an address
  - **Expected:** Network error caught
  - **Expected:** Error notification shown
  - **Expected:** Modal stays open
- [ ] Restart server and retry
  - **Expected:** Operation succeeds

#### 14. Modal Behavior
- [ ] Open add/edit modal
- [ ] Press ESC key
  - **Expected:** Modal closes, form resets
- [ ] Open modal again
- [ ] Click outside modal (on backdrop)
  - **Expected:** Modal closes, form resets
- [ ] Open modal
- [ ] Click "Cancel" button
  - **Expected:** Modal closes, form resets

#### 15. Logout Functionality
- [ ] Click logout button in sidebar
  - **Expected:** Confirmation dialog (if implemented)
  - **Expected:** localStorage cleared (customer_id, customer_name, customer_email)
  - **Expected:** Redirected to `/landing/`
- [ ] Try to access addresses page again
  - **Expected:** Redirected to `/landing/` (auth check works)

#### 16. Browser Console Checks
- [ ] Open DevTools Console
  - **Expected:** No errors during normal operations
- [ ] Check Network tab during API calls
  - **Expected:** All requests return proper status codes
  - **Expected:** Request payloads correctly formatted
  - **Expected:** Response bodies contain expected data

---

## ✨ Step 29: Animations & Polish Testing

### Visual Animations

#### Address Card Animations
- [ ] Load addresses page with multiple addresses
  - **Expected:** Cards fade in with staggered delay
  - **Expected:** Animation duration: ~0.3s per card
  - **Expected:** Smooth opacity transition (0 → 1)

#### Modal Animations
- [ ] Open add/edit modal
  - **Expected:** Modal backdrop fades in
  - **Expected:** Modal content scales/fades in smoothly
- [ ] Close modal (ESC, backdrop click, cancel button)
  - **Expected:** Smooth fade out animation
  - **Expected:** Backdrop disappears gracefully

#### Delete Animation
- [ ] Delete an address
  - **Expected:** Card fades out before removal
  - **Expected:** Remaining cards smoothly reposition
  - **Expected:** No jarring layout shifts

#### Loading States
- [ ] During API calls:
  - **Expected:** Buttons show loading text ("Processing...")
  - **Expected:** Buttons disabled (visual feedback)
  - **Expected:** Optional spinner icon (if implemented)

### Notification Integration

#### Success Notifications
- [ ] Add address successfully
  - **Expected:** Green success toast appears
  - **Expected:** Message: "Address added successfully"
  - **Expected:** Auto-dismisses after 3-5 seconds
- [ ] Update address
  - **Expected:** Success notification with appropriate message
- [ ] Delete address
  - **Expected:** Success notification appears
- [ ] Set default
  - **Expected:** Success notification appears

#### Error Notifications
- [ ] Submit invalid data
  - **Expected:** Red error toast appears
  - **Expected:** Descriptive error message shown
- [ ] Network error
  - **Expected:** Error notification with retry suggestion

#### Fallback Behavior
- [ ] If `notifications.js` fails to load:
  - **Expected:** Browser's `alert()` used as fallback
  - **Expected:** Notifications still functional (less pretty)

### Polish Elements

#### Icons
- [ ] HOME label: House/Home icon
- [ ] WORK label: Briefcase icon
- [ ] OTHER label: Map marker icon
- [ ] Edit button: Pencil icon
- [ ] Delete button: Trash icon

#### Badges
- [ ] Default address: Green "Default" badge
- [ ] Positioned top-right of card
- [ ] Distinct visual style

#### Phone Formatting
- [ ] Phone numbers displayed with proper formatting
- [ ] Example: 0300-1234567 or (0300) 123-4567
- [ ] Consistent format across all addresses

#### Responsive Hover States
- [ ] Hover over address card
  - **Expected:** Subtle shadow or border change
- [ ] Hover over Edit/Delete buttons
  - **Expected:** Color change or scale effect
- [ ] Hover over "Set as Default" button
  - **Expected:** Visual feedback

---

## 🎯 Step 30: UI Consistency Verification

### Layout & Styling Checks

#### No Changes to Existing UI
- [ ] Compare addresses.html with backup/previous version
  - **Expected:** Only ID attributes and 2 form fields added
  - **Expected:** No CSS class changes
  - **Expected:** No structural HTML changes
  - **Expected:** All existing classes preserved

#### CSS Files Unchanged
- [ ] Check `static/css/addresses.css`
  - **Expected:** File not modified
  - **Expected:** All original styles intact
- [ ] Check `static/css/global-typography.css`
  - **Expected:** File not modified
- [ ] Check `static/css/account.css`
  - **Expected:** File not modified

#### Responsive Design

##### Desktop (1920x1080)
- [ ] Addresses display in grid (3-4 columns)
- [ ] Cards properly sized and spaced
- [ ] Modal centered on screen
- [ ] All text readable

##### Tablet (768x1024)
- [ ] Grid adapts to 2 columns
- [ ] Cards stack nicely
- [ ] Modal responsive
- [ ] Touch targets adequate (44x44px minimum)

##### Mobile (375x667)
- [ ] Single column layout
- [ ] Cards full-width with padding
- [ ] Modal full-screen or properly sized
- [ ] Form fields easily tappable
- [ ] No horizontal scrolling

### Cross-Browser Testing

#### Chrome (Latest)
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

#### Firefox (Latest)
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

#### Safari (Latest)
- [ ] All features work (if testing on Mac)
- [ ] Animations smooth
- [ ] No console errors

#### Edge (Latest)
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

### Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through all interactive elements
  - **Expected:** Logical tab order
  - **Expected:** Focus visible on all elements
- [ ] Press Enter on buttons
  - **Expected:** Buttons trigger correctly
- [ ] Press ESC in modal
  - **Expected:** Modal closes

#### Screen Reader Testing (Optional)
- [ ] Use NVDA/JAWS/VoiceOver
- [ ] Navigate through addresses
  - **Expected:** All content announced
  - **Expected:** Button purposes clear
  - **Expected:** Form labels associated

#### ARIA Attributes
- [ ] Modal has `role="dialog"`
- [ ] Modal has `aria-labelledby` or `aria-label`
- [ ] Buttons have descriptive `aria-label` if icon-only
- [ ] Form fields have associated labels

#### Color Contrast
- [ ] Text on backgrounds meets WCAG AA (4.5:1)
- [ ] Button text readable
- [ ] Error messages visible

### Performance Checks

#### Page Load
- [ ] Time from navigation to interactive
  - **Target:** < 2 seconds
- [ ] API calls complete quickly
  - **Target:** < 1 second per request

#### Animations
- [ ] No janky animations (maintain 60fps)
- [ ] Smooth transitions
- [ ] No layout thrashing

#### Memory Usage
- [ ] No memory leaks after multiple operations
- [ ] Event listeners properly cleaned up
- [ ] No zombie intervals/timeouts

---

## 📊 Test Results Checklist

### Backend API (Step 27)
- [ ] All 11 test scenarios pass
- [ ] Proper HTTP status codes returned
- [ ] Validation working correctly
- [ ] Ownership checks functioning
- [ ] Error messages descriptive

### Frontend Functionality (Step 28)
- [ ] Authentication & authorization working
- [ ] Fetch and display addresses
- [ ] Add new address
- [ ] Edit existing address
- [ ] Delete address with confirmation
- [ ] Set default address
- [ ] Form validation on client
- [ ] Error handling graceful
- [ ] Loading states visible
- [ ] Logout functionality

### Animations & Polish (Step 29)
- [ ] Fade-in animations smooth
- [ ] Modal transitions polished
- [ ] Delete animations work
- [ ] Notifications display correctly
- [ ] Icons render properly
- [ ] Badges styled correctly
- [ ] Phone formatting applied

### UI Consistency (Step 30)
- [ ] No unwanted layout changes
- [ ] CSS files unchanged
- [ ] Responsive on all screen sizes
- [ ] Works in multiple browsers
- [ ] Keyboard navigation functional
- [ ] Accessibility standards met
- [ ] Performance acceptable

---

## 🐛 Common Issues & Solutions

### Issue: Server not responding
**Solution:** Ensure server is running: `python manage.py runserver`

### Issue: No addresses displayed
**Solution:** Check browser console for errors, verify customer_id in localStorage

### Issue: Form validation not working
**Solution:** Check JavaScript console for errors, ensure addresses.js loaded

### Issue: Animations not smooth
**Solution:** Check browser performance, close other tabs, disable browser extensions

### Issue: Modal not closing
**Solution:** Check event listeners bound correctly, verify ESC key handler

### Issue: API returns 403/404
**Solution:** Verify customer_id matches address owner, check ownership logic

---

## ✅ Testing Complete!

Once all tests pass:
1. ✅ Mark steps 27-30 as completed in todo list
2. ✅ Document any bugs found and fixed
3. ✅ Prepare for production deployment (if applicable)
4. ✅ Create user documentation (optional)

**Congratulations!** The Address Management System is fully tested and ready for use! 🎉
