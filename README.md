# Farm2Home

[![Django](https://img.shields.io/badge/Django-5.2.7-green.svg)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.x-blue.svg)](https://www.python.org/)
[![Stripe](https://img.shields.io/badge/Stripe-11.1.0-blueviolet.svg)](https://stripe.com/)

A Django-based e-commerce platform connecting farmers directly with consumers for fresh organic produce delivery. The application includes a complete checkout flow, payment processing via Stripe, and order management capabilities.

## Getting Started

### Prerequisites
- Python 3.x
- PostgreSQL
- Virtual environment tool

### Installation

Navigate to the project directory and set up your environment:

```bash
cd Farm2Home
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a `.env` file in the project root with the following configuration:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/farm2home
SECRET_KEY=your-secret-key
DEBUG=True

EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
```

Initialize the database and start the development server:

```bash
python manage.py migrate
python manage.py createsuperuser  # Optional
python manage.py runserver
```

Access the application at `http://localhost:8000/` and the admin panel at `http://localhost:8000/admin/`

## Features

The platform includes the following functionality:

- Product catalog with 56+ items and seasonal filtering capabilities
- User authentication and account management
- Stripe payment integration with Cash on Delivery option
- Automated email notifications for order confirmations
- Multiple delivery address management
- Order history and tracking
- Responsive design for mobile and desktop

## Testing

To test the payment flow, use Stripe's test card number `4242 4242 4242 4242` with any future expiry date and CVV. Additional test scripts are available:

```bash
python test_auth_apis.py
python test_address_api.py
python test_order_creation.py
```

## Documentation

Detailed documentation is available in `DOCUMENTATION.md`, covering:

- Order creation workflow
- Email notification system
- Payment integration details
- Authentication implementation
- Address management
- Database schema
- API endpoint reference
- Testing procedures
- Common issues and solutions

## Technology Stack

**Backend:** Django 5.2.7, Django REST Framework  
**Database:** PostgreSQL  
**Payment Processing:** Stripe 11.1.0  
**Email:** Gmail SMTP  
**Frontend:** JavaScript, HTML5, CSS3

## Project Structure

```
Farm2Home/
├── main/                  # Core application logic
├── Farm2Home/             # Django project configuration
├── templates/             # HTML templates
├── static/                # Static assets (CSS, JS, images)
├── .env                   # Environment configuration
├── manage.py              # Django CLI
├── requirements.txt       # Python dependencies
└── DOCUMENTATION.md       # Extended documentation
```

## Key Components

- `main/models.py` - Data models for products, orders, customers, and addresses
- `main/views.py` - API endpoints and view logic
- `main/serializers.py` - Request/response serialization and validation
- `main/utils.py` - Email utility functions
- `static/js/payment.js` - Client-side payment handling
- `templates/emails/order_confirmation.html` - Order confirmation template

## Application Routes

| Route | Purpose |
|-------|---------|
| `/landing/` | Homepage |
| `/catalog/` | Product browsing |
| `/checkout/` | Cart and payment |
| `/account/` | User dashboard |
| `/admin/` | Django admin interface |

## Common Commands

```bash
python manage.py runserver          # Start development server
python manage.py makemigrations     # Generate migration files
python manage.py migrate            # Apply database migrations
python manage.py createsuperuser    # Create admin account
python manage.py collectstatic      # Gather static files
```

## Troubleshooting

**Email notifications not arriving:** Check your spam folder. The application currently uses console email backend by default for development.

**Payment processing errors:** Ensure your `.env` file contains valid Stripe test keys (starting with `pk_test_` and `sk_test_`).

**Order creation failures:** Review the Django server logs and verify that `customer_id` is stored in browser localStorage.

Refer to `DOCUMENTATION.md` for additional troubleshooting guidance.

## License

This project is intended for educational purposes.

---

**Last Updated:** November 17, 2025
