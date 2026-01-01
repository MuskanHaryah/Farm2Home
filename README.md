<div align="center">

# 🌾 Farm2Home

### *Fresh from Farm to Your Doorstep*

[![Django](https://img.shields.io/badge/Django-5.2.7-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-11.1.0-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

[🚀 Live Demo](https://farm2home.up.railway.app) | [📖 Documentation](DOCUMENTATION.md)

</div>

---

## 🎯 Overview

**Farm2Home** is a modern e-commerce platform revolutionizing the farm-to-consumer supply chain. Built with Django and powered by Stripe, it enables farmers to sell fresh, organic produce directly to health-conscious consumers while ensuring seamless payment processing and order management.

### ✨ Why Farm2Home?

- 🌱 **Direct Connection** - Eliminate middlemen, support local farmers
- 💳 **Secure Payments** - Industry-standard Stripe integration
- 📧 **Smart Notifications** - Automated order confirmations and updates
- 📱 **Responsive Design** - Perfect experience on any device
- 🚚 **Flexible Delivery** - Multiple addresses and payment options

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- 🐍 Python 3.x installed
- 🐘 PostgreSQL database
- 📦 pip package manager

### 📥 Installation

**1. Clone and navigate to the project:**
```bash
git clone <your-repo-url>
cd Farm2Home
```

**2. Set up virtual environment:**

**2. Set up virtual environment:**
```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

**3. Configure environment variables:**

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/farm2home
SECRET_KEY=your-secret-key
DEBUG=True

EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
```

**4. Initialize the database:**
```bash
python manage.py migrate
python manage.py createsuperuser  # Optional: Create admin account
```

**5. Launch the development server:**
```bash
python manage.py runserver
```

🎉 **You're all set!** Visit `http://localhost:8000/` to explore the app.

---

## 🎨 Features

## 🎨 Features

<table>
<tr>
<td>

### 🛒 Shopping Experience
- 56+ organic products catalog
- Seasonal filtering & categories
- Real-time cart management
- Smart product search

</td>
<td>

### 💰 Payment & Security
- Stripe payment integration
- Cash on Delivery option
- Secure checkout flow
- PCI-compliant processing

</td>
</tr>
<tr>
<td>

### 👤 User Management
- Seamless authentication
- Profile customization
- Order history tracking
- Multiple delivery addresses

</td>
<td>

### 📬 Communication
- Automated email notifications
- Order confirmations
- Password reset emails
- Welcome messages

</td>
</tr>
</table>

---

## 🧪 Testing

### Payment Testing

Use Stripe's test credentials for development:

| Card Number | Expiry | CVV | Result |
|-------------|--------|-----|--------|
| `4242 4242 4242 4242` | Any future date | Any 3 digits | ✅ Success |

### API Testing

Run the included test scripts:

### API Testing

Run the included test scripts:
```bash
python test_auth_apis.py          # Authentication endpoints
python test_address_api.py        # Address management
python test_order_creation.py     # Order processing
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|-------|-------------|
| **Backend** | Django 5.2.7 • Django REST Framework • Python 3.x |
| **Database** | PostgreSQL |
| **Payments** | Stripe 11.1.0 |
| **Email** | Gmail SMTP |
| **Frontend** | Vanilla JavaScript • HTML5 • CSS3 |
| **Deployment** | Railway |

</div>

---

## 📂 Project Architecture

## 📂 Project Architecture

```
Farm2Home/
├── 🎯 main/                      # Core application
│   ├── models.py                 # Database models
│   ├── views.py                  # API endpoints
│   ├── serializers.py            # Data validation
│   ├── utils.py                  # Email utilities
│   └── management/commands/      # Custom CLI commands
├── ⚙️ Farm2Home/                 # Project configuration
│   ├── settings.py               # Django settings
│   ├── urls.py                   # URL routing
│   └── wsgi.py                   # WSGI config
├── 🎨 templates/                 # HTML templates
│   ├── landing/                  # Homepage
│   ├── prod-catalog/             # Product pages
│   ├── checkout/                 # Cart & payment
│   ├── account/                  # User dashboard
│   └── emails/                   # Email templates
├── 📦 static/                    # Static assets
│   ├── css/                      # Stylesheets
│   ├── js/                       # Client scripts
│   └── images/                   # Product images
└── 📄 Configuration files
    ├── manage.py
    ├── requirements.txt
    ├── Procfile
    └── .env
```

---

## 🗺️ Application Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/landing/` | Homepage & hero section | Public |
| `/catalog/` | Browse products | Public |
| `/checkout/` | Cart & payment flow | Authenticated |
| `/account/` | User dashboard | Authenticated |
| `/admin/` | Django admin panel | Admin only |

---

## 📚 Documentation

Comprehensive guides available in [DOCUMENTATION.md](DOCUMENTATION.md):

- 📦 Order creation workflow
- 📧 Email notification system
- 💳 Payment integration details
- 🔐 Authentication implementation
- 🏠 Address management
- 🗄️ Database schema
- 🔌 API endpoint reference
- 🧪 Testing procedures
- 🐛 Troubleshooting guide

---

## ⚡ Common Commands

## ⚡ Common Commands

```bash
# Development
python manage.py runserver              # Start dev server
python manage.py shell                  # Interactive Python shell

# Database
python manage.py makemigrations         # Create migrations
python manage.py migrate                # Apply migrations
python manage.py createsuperuser        # Create admin

# Production
python manage.py collectstatic          # Collect static files
python manage.py check --deploy         # Deployment checklist
```

---

## 🔧 Troubleshooting

<details>
<summary><b>📧 Email notifications not working</b></summary>

- Check your spam/junk folder
- Verify `.env` contains correct Gmail credentials
- Enable "Less secure app access" in Gmail settings
- Consider using App Passwords for Gmail
</details>

<details>
<summary><b>💳 Payment processing errors</b></summary>

- Ensure Stripe keys start with `pk_test_` and `sk_test_`
- Verify keys match the same Stripe account
- Check browser console for client-side errors
- Review Django server logs for backend issues
</details>

<details>
<summary><b>🛒 Order creation failures</b></summary>

- Verify `customer_id` is stored in localStorage
- Check that user is authenticated
- Review network tab for API errors
- Ensure database migrations are up to date
</details>

<details>
<summary><b>🗄️ Database connection issues</b></summary>

- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env` file
- Ensure database exists and credentials are correct
- Test connection: `python manage.py dbshell`
</details>

💡 **Need more help?** Check [DOCUMENTATION.md](DOCUMENTATION.md) for detailed troubleshooting.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is intended for educational and demonstration purposes.

---

<div align="center">

**Made with ❤️ for sustainable agriculture**

[⬆ Back to Top](#-farm2home)

</div>
