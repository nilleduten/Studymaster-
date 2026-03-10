class PremiumManager {
    constructor() {
        this.isPremium = localStorage.getItem('isPremium') === 'true';
        this.premiumExpiry = localStorage.getItem('premiumExpiry');
        this.stripeCustomerId = localStorage.getItem('stripeCustomerId');
    }

    checkPremiumStatus() {
        if (this.isPremium && this.premiumExpiry) {
            const expiryDate = new Date(this.premiumExpiry);
            const today = new Date();
            if (today > expiryDate) {
                this.revokePremium();
                return false;
            }
            return true;
        }
        return false;
    }

    activatePremium(stripeCustomerId, expiryDate) {
        this.isPremium = true;
        this.stripeCustomerId = stripeCustomerId;
        this.premiumExpiry = expiryDate;
        localStorage.setItem('isPremium', 'true');
        localStorage.setItem('stripeCustomerId', stripeCustomerId);
        localStorage.setItem('premiumExpiry', expiryDate);
    }

    revokePremium() {
        this.isPremium = false;
        localStorage.removeItem('isPremium');
        localStorage.removeItem('stripeCustomerId');
        localStorage.removeItem('premiumExpiry');
    }

    getPremiumStatus() {
        return {
            isPremium: this.checkPremiumStatus(),
            expiry: this.premiumExpiry,
            customerId: this.stripeCustomerId
        };
    }
}

class PremiumFeatures {
    constructor(premiumManager) {
        this.premiumManager = premiumManager;
        this.features = {
            unlimitedFlashcards: true,
            advancedAnalytics: true,
            customStudyPlans: true,
            cloudSync: true,
            collaboration: true,
            prioritySupport: true,
            adFree: true,
            dataExport: true
        };
    }

    hasFeature(featureName) {
        if (!this.premiumManager.checkPremiumStatus()) {
            return false;
        }
        return this.features[featureName] || false;
    }

    getAvailableFeatures() {
        if (!this.premiumManager.checkPremiumStatus()) {
            return [];
        }
        return Object.keys(this.features).filter(key => this.features[key]);
    }
}

class PaymentProcessor {
    constructor() {
        this.monthlyPrice = 9.99;
        this.currency = 'usd';
    }

    async processPayment(stripeToken, email) {
        try {
            const response = await fetch('/api/create-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: stripeToken, email: email, amount: this.monthlyPrice * 100 })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Payment error:', error);
            return { success: false, error: error.message };
        }
    }

    async cancelSubscription(subscriptionId) {
        try {
            const response = await fetch('/api/cancel-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subscriptionId: subscriptionId })
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Cancellation error:', error);
            return false;
        }
    }
}

window.addEventListener('DOMContentLoaded', function() {
    window.premiumManager = new PremiumManager();
    window.premiumFeatures = new PremiumFeatures(window.premiumManager);
    window.paymentProcessor = new PaymentProcessor();
});