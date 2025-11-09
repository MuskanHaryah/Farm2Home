// Custom Notification System
class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        this.init();
    }

    init() {
        // Create notification container if it doesn't exist
        if (!document.querySelector('.notification-container')) {
            this.container = document.createElement('div');
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.notification-container');
        }
    }

    show(message, type = 'info', title = '', duration = null) {
        const notification = this.createNotification(message, type, title, duration);
        this.addNotification(notification);
        return notification;
    }

    createNotification(message, type, title, duration) {
        const id = 'notification_' + Date.now() + Math.random().toString(36).substr(2, 9);
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.id = id;

        // Set default titles based on type if not provided
        if (!title) {
            const titles = {
                success: 'Success',
                error: 'Error',
                warning: 'Warning',
                info: 'Information'
            };
            title = titles[type] || 'Notification';
        }

        // Set default icons based on type
        const icons = {
            success: '✓',
            error: '✕',
            warning: '!',
            info: 'i'
        };

        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || 'i'}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="notifications.hide('${id}')">&times;</button>
        `;

        // Auto-hide after duration
        const autoDuration = duration !== null ? duration : this.defaultDuration;
        if (autoDuration > 0) {
            setTimeout(() => {
                this.hide(id);
            }, autoDuration);
        }

        return notification;
    }

    addNotification(notification) {
        // Remove oldest notification if we exceed max
        if (this.notifications.length >= this.maxNotifications) {
            const oldest = this.notifications.shift();
            this.hide(oldest.id);
        }

        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Trigger show animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    }

    hide(id) {
        const notification = document.getElementById(id);
        if (notification) {
            notification.classList.add('hide');
            notification.classList.remove('show');
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                    this.notifications = this.notifications.filter(n => n.id !== id);
                }
            }, 400);
        }
    }

    hideAll() {
        this.notifications.forEach(notification => {
            this.hide(notification.id);
        });
    }

    // Convenience methods
    success(message, title = 'Success!', duration = null) {
        return this.show(message, 'success', title, duration);
    }

    error(message, title = 'Error!', duration = null) {
        return this.show(message, 'error', title, duration);
    }

    warning(message, title = 'Warning!', duration = null) {
        return this.show(message, 'warning', title, duration);
    }

    info(message, title = 'Info', duration = null) {
        return this.show(message, 'info', title, duration);
    }
}

// Create global instance
window.notifications = new NotificationSystem();

// Override alert function to use custom notifications
window.originalAlert = window.alert;
window.alert = function(message) {
    // Determine notification type based on message content
    const lowerMessage = message.toLowerCase();
    let type = 'info';
    let title = 'Notice';

    if (lowerMessage.includes('success') || lowerMessage.includes('added') || lowerMessage.includes('confirmed') || lowerMessage.includes('updated')) {
        type = 'success';
        title = 'Success!';
    } else if (lowerMessage.includes('error') || lowerMessage.includes('invalid') || lowerMessage.includes('expired') || lowerMessage.includes('failed')) {
        type = 'error';
        title = 'Error!';
    } else if (lowerMessage.includes('please') || lowerMessage.includes('required') || lowerMessage.includes('must') || lowerMessage.includes('enter')) {
        type = 'warning';
        title = 'Please check';
    }

    notifications.show(message, type, title);
};

// Also override confirm for consistency (optional)
window.originalConfirm = window.confirm;
window.confirm = function(message) {
    // For now, use original confirm, but you could create a custom modal
    return window.originalConfirm(message);
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSystem;
}