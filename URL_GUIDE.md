# Farm2Home - URL Guide

## 🚀 How to Access Your Pages

After running `python manage.py runserver`, use these URLs:

### Main Pages
- **Home**: http://127.0.0.1:8000/
- **Landing**: http://127.0.0.1:8000/landing/
- **Product Catalog**: http://127.0.0.1:8000/catalog/

### Account Pages
- **Account Home**: http://127.0.0.1:8000/account/
- **Account New**: http://127.0.0.1:8000/account/new/
- **Addresses**: http://127.0.0.1:8000/account/addresses/
- **Orders**: http://127.0.0.1:8000/account/orders/
- **Payment Methods**: http://127.0.0.1:8000/account/payment/
- **Settings**: http://127.0.0.1:8000/account/settings/

### Auth Pages
- **Login**: http://127.0.0.1:8000/login/
- **Signup**: http://127.0.0.1:8000/signup/

### Checkout Pages
- **Checkout**: http://127.0.0.1:8000/checkout/
- **Checkout Payment**: http://127.0.0.1:8000/checkout/payment/

## ⚠️ Important Notes

1. **Always activate virtual environment first**:
   ```powershell
   cd C:\Users\Lenovo\Desktop\python\Projects\Farm-2-Home
   .\.venv\Scripts\Activate.ps1
   cd Farm2Home
   ```

2. **Run the development server**:
   ```powershell
   python manage.py runserver
   ```

3. **DON'T open HTML files directly** - they won't work!
   ❌ Wrong: `file:///C:/Users/.../templates/account/index.html`
   ✅ Right: `http://127.0.0.1:8000/account/`

4. **Static files are served automatically** in development mode

## 🎨 Static Files

Your CSS, JS, and images are served from:
- CSS: `/static/css/filename.css`
- JS: `/static/js/filename.js`
- Images: `/static/images/category/image.png`

Django handles this automatically with the `{% static %}` template tag!
