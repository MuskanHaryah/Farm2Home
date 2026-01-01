from django.template.loader import render_to_string
from django.conf import settings
import resend


def send_email_via_resend(to_email, subject, html_content):
    """
    Send email using Resend API directly
    """
    try:
        resend.api_key = settings.RESEND_API_KEY
        
        params = {
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "html": html_content,
        }
        
        result = resend.Emails.send(params)
        print(f"📧 Email sent via Resend API: {result}")
        return True
    except Exception as e:
        print(f"❌ Resend API error: {str(e)}")
        return False


def send_welcome_email(customer):
    """
    Send welcome email to newly registered customers
    
    Args:
        customer: Customer model instance
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        subject = 'Welcome to Farm2Home! 🌾'
        
        # Prepare template context
        context = {
            'customer_name': customer.name,
        }
        
        # Render HTML email template
        html_message = render_to_string('emails/welcome.html', context)
        
        # Send via Resend API
        result = send_email_via_resend(customer.email, subject, html_message)
        
        if result:
            print(f"✅ Welcome email sent successfully to {customer.email}")
        return result
        
    except Exception as e:
        print(f"❌ Failed to send welcome email to {customer.email}: {str(e)}")
        return False


def send_order_confirmation_email(order):
    """
    Send order confirmation email after successful order placement
    
    Args:
        order: Order model instance with related customer and order_items
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        subject = f'Order Confirmation #{order.order_id} - Farm2Home'
        
        # Calculate item subtotals
        items_with_subtotal = []
        for item in order.order_items.all():
            items_with_subtotal.append({
                'product': item.product,
                'quantity': item.quantity,
                'price': f"{item.price:,.2f}",
                'subtotal': f"{(item.quantity * item.price):,.2f}"
            })
        
        # Get shipping info from order's temporary attribute if available
        # Otherwise use customer's default information
        if hasattr(order, 'shipping_info'):
            shipping_info = order.shipping_info
            shipping_name = shipping_info.get('name', order.customer.name)
            shipping_address = shipping_info.get('address', 'Address on file')
            shipping_city = shipping_info.get('city', 'City')
            shipping_zip = shipping_info.get('zip', 'Postal Code')
            shipping_phone = shipping_info.get('phone', order.customer.phone)
        else:
            # Fallback to customer information
            shipping_name = order.customer.name
            shipping_phone = order.customer.phone
            shipping_address = 'Address on file'
            shipping_city = 'City'
            shipping_zip = 'Postal Code'
        
        # Prepare template context with complete order details
        context = {
            'customer_name': order.customer.name,
            'order_id': order.order_id,
            'order_date': order.order_date.strftime('%B %d, %Y at %I:%M %p'),
            'total_amount': f"{order.total_amount:,.2f}",
            'payment_method': order.payment if order.payment else 'Cash on Delivery',
            'items': items_with_subtotal,
            # Shipping/Delivery information
                    'shipping_name': shipping_name,
            'shipping_phone': shipping_phone,
            'shipping_address': shipping_address,
            'shipping_city': shipping_city,
            'shipping_zip': shipping_zip,
        }
        
        # Render HTML email template
        html_message = render_to_string('emails/order_confirmation.html', context)
        
        # Send email via Resend API
        print(f"📧 Order confirmation for: {order.customer.email}")
        
        # Send via Resend API
        result = send_email_via_resend(order.customer.email, subject, html_message)
        
        if result:
            print(f"✅ Order confirmation email sent successfully to {order.customer.email} for Order #{order.order_id}")
        return result
        
    except Exception as e:
        print(f"❌ Failed to send order confirmation email for Order #{order.order_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def send_password_reset_email(customer, reset_link):
    """
    Send password reset email with secure reset link
    
    Args:
        customer: Customer model instance
        reset_link: String URL for password reset
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        subject = 'Password Reset Request - Farm2Home'
        
        # Prepare template context
        context = {
            'customer_name': customer.name,
            'reset_link': reset_link
        }
        
        # Render HTML email template
        html_message = render_to_string('emails/password_reset.html', context)
        
        # Send via Resend API
        result = send_email_via_resend(customer.email, subject, html_message)
        
        if result:
            print(f"✅ Password reset email sent successfully to {customer.email}")
        return result
        
    except Exception as e:
        print(f"❌ Failed to send password reset email to {customer.email}: {str(e)}")
        return False


def send_order_shipped_email(order, tracking_number=None):
    """
    Send notification when order is shipped (for future use)
    
    Args:
        order: Order model instance
        tracking_number: Optional tracking number string
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        subject = f'Your Order #{order.order_id} Has Been Shipped! 🚚'
        
        # Simple HTML message for now
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Hi {order.customer.name},</h2>
            <p>Great news! Your order #{order.order_id} has been shipped and is on its way to you!</p>
            {f'<p><strong>Tracking Number:</strong> {tracking_number}</p>' if tracking_number else ''}
            <p>You should receive your fresh produce within 24-48 hours.</p>
            <p>Thank you for choosing Farm2Home!</p>
            <br>
            <p style="color: #666;">Farm2Home - Fresh Organic Produce</p>
        </body>
        </html>
        """
        
        # Send via Resend API
        result = send_email_via_resend(order.customer.email, subject, html_message)
        
        if result:
            print(f"✅ Shipping notification email sent successfully to {order.customer.email}")
        return result
        
    except Exception as e:
        print(f"❌ Failed to send shipping notification email: {str(e)}")
        return False


def send_order_delivered_email(order):
    """
    Send notification when order is delivered (for future use)
    
    Args:
        order: Order model instance
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        subject = f'Your Order #{order.order_id} Has Been Delivered! ✅'
        
        # Simple HTML message for now
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Hi {order.customer.name},</h2>
            <p>Your order #{order.order_id} has been successfully delivered!</p>
            <p>We hope you enjoy your fresh, organic produce from Farm2Home.</p>
            <p>If you have any questions or concerns about your order, please don't hesitate to contact us.</p>
            <p><strong>We'd love to hear your feedback!</strong> Please consider leaving a review.</p>
            <br>
            <p style="color: #666;">Thank you for choosing Farm2Home!</p>
        </body>
        </html>
        """
        
        # Send via Resend API
        result = send_email_via_resend(order.customer.email, subject, html_message)
        
        if result:
            print(f"✅ Delivery confirmation email sent successfully to {order.customer.email}")
        return result
        
    except Exception as e:
        print(f"❌ Failed to send delivery confirmation email: {str(e)}")
        return False


def send_contact_form_email(sender_name, sender_email, message):
    """
    Send contact form submission to admin email
    
    Args:
        sender_name: Name of the person who submitted the form
        sender_email: Email address of the sender
        message: Message content from the form
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        from datetime import datetime
        
        subject = f'🌾 New Contact Form Submission - {sender_name}'
        
        # Prepare template context
        context = {
            'sender_name': sender_name,
            'sender_email': sender_email,
            'message': message,
            'timestamp': datetime.now().strftime('%B %d, %Y at %I:%M %p'),
        }
        
        # Render HTML email template
        html_message = render_to_string('emails/contact_form.html', context)
        
        # Send via Resend API to admin email
        admin_email = getattr(settings, 'ADMIN_EMAIL', 'muskan4606406@cloud.neduet.edu.pk')
        result = send_email_via_resend(admin_email, subject, html_message)
        
        if result:
            print(f"✅ Contact form email sent successfully from {sender_email}")
        return result
        
    except Exception as e:
        print(f"❌ Failed to send contact form email: {str(e)}")
        return False


def send_callback_request_email(client_name, phone_number, preferred_time, message=None):
    """
    Send callback request to admin email
    
    Args:
        client_name: Name of the client requesting callback
        phone_number: Client's phone number
        preferred_time: Preferred time for callback
        message: Optional additional message
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        from datetime import datetime
        
        subject = f'📞 URGENT: Callback Request from {client_name}'
        
        # Prepare template context
        context = {
            'client_name': client_name,
            'phone_number': phone_number,
            'preferred_time': preferred_time,
            'message': message if message else None,
            'timestamp': datetime.now().strftime('%B %d, %Y at %I:%M %p'),
        }
        
        # Render HTML email template
        html_message = render_to_string('emails/callback_request.html', context)
        
        # Send via Resend API to admin email
        admin_email = getattr(settings, 'ADMIN_EMAIL', 'muskan4606406@cloud.neduet.edu.pk')
        result = send_email_via_resend(admin_email, subject, html_message)
        
        if result:
            print(f"✅ Callback request email sent successfully for {client_name} ({phone_number})")
        return result
        
    except Exception as e:
        print(f"❌ Failed to send callback request email: {str(e)}")
        return False


