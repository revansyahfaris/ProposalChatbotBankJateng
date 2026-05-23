/**
 * API Service
 * Handles all API calls for banking operations
 */

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
  /**
   * Make HTTP request with authorization
   */
  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: config.method || 'GET',
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // ==================== ACCOUNT ENDPOINTS ====================

  /**
   * Get all accounts for current user
   */
  async getAccounts(): Promise<any[]> {
    return this.request('/accounts');
  }

  /**
   * Get specific account details
   */
  async getAccount(accountId: string): Promise<any> {
    return this.request(`/accounts/${accountId}`);
  }

  /**
   * Create new account
   */
  async createAccount(accountData: any): Promise<any> {
    return this.request('/accounts', {
      method: 'POST',
      body: accountData,
    });
  }

  /**
   * Update account
   */
  async updateAccount(accountId: string, updates: any): Promise<any> {
    return this.request(`/accounts/${accountId}`, {
      method: 'PUT',
      body: updates,
    });
  }

  /**
   * Delete account
   */
  async deleteAccount(accountId: string): Promise<any> {
    return this.request(`/accounts/${accountId}`, {
      method: 'DELETE',
    });
  }

  // ==================== TRANSACTION ENDPOINTS ====================

  /**
   * Get transactions for account
   */
  async getTransactions(
    accountId: string,
    filters?: { limit?: number; offset?: number; startDate?: string; endDate?: string }
  ): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    return this.request(`/accounts/${accountId}/transactions?${params}`);
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId: string): Promise<any> {
    return this.request(`/transactions/${transactionId}`);
  }

  /**
   * Transfer money
   */
  async transfer(transferData: {
    fromAccountId: string;
    toAccountNumber: string;
    amount: number;
    description?: string;
  }): Promise<any> {
    return this.request('/transactions/transfer', {
      method: 'POST',
      body: transferData,
    });
  }

  /**
   * Pay bill
   */
  async payBill(paymentData: {
    accountId: string;
    billerId: string;
    amount: number;
    description?: string;
  }): Promise<any> {
    return this.request('/transactions/payment', {
      method: 'POST',
      body: paymentData,
    });
  }

  // ==================== USER ENDPOINTS ====================

  /**
   * Get user profile
   */
  async getProfile(): Promise<any> {
    return this.request('/users/profile');
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: any): Promise<any> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: profileData,
    });
  }

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    return this.request('/users/change-password', {
      method: 'POST',
      body: { oldPassword, newPassword },
    });
  }

  /**
   * Update email
   */
  async updateEmail(newEmail: string): Promise<any> {
    return this.request('/users/email', {
      method: 'PUT',
      body: { newEmail },
    });
  }

  /**
   * Update phone
   */
  async updatePhone(newPhone: string): Promise<any> {
    return this.request('/users/phone', {
      method: 'PUT',
      body: { newPhone },
    });
  }

  // ==================== CHATBOT ENDPOINTS ====================

  /**
   * Send message to chatbot
   */
  async sendChatMessage(message: string): Promise<any> {
    return this.request('/chatbot/message', {
      method: 'POST',
      body: { message },
    });
  }

  /**
   * Get chat history
   */
  async getChatHistory(limit: number = 50): Promise<any[]> {
    return this.request(`/chatbot/history?limit=${limit}`);
  }

  // ==================== SETTINGS ENDPOINTS ====================

  /**
   * Get account settings
   */
  async getSettings(): Promise<any> {
    return this.request('/settings');
  }

  /**
   * Update settings
   */
  async updateSettings(settings: any): Promise<any> {
    return this.request('/settings', {
      method: 'PUT',
      body: settings,
    });
  }

  /**
   * Enable two-factor authentication
   */
  async enable2FA(): Promise<any> {
    return this.request('/settings/2fa/enable', {
      method: 'POST',
    });
  }

  /**
   * Verify 2FA code
   */
  async verify2FA(code: string): Promise<any> {
    return this.request('/settings/2fa/verify', {
      method: 'POST',
      body: { code },
    });
  }

  /**
   * Disable two-factor authentication
   */
  async disable2FA(password: string): Promise<any> {
    return this.request('/settings/2fa/disable', {
      method: 'POST',
      body: { password },
    });
  }

  // ==================== NOTIFICATION ENDPOINTS ====================

  /**
   * Get notifications
   */
  async getNotifications(limit: number = 20): Promise<any[]> {
    return this.request(`/notifications?limit=${limit}`);
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<any> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<any> {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
