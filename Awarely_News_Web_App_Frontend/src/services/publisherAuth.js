// Publisher Authentication and Authorization Service
class PublisherAuthService {
  constructor() {
    this.publishers = this.loadPublishers();
    this.currentPublisher = this.loadCurrentPublisher();
  }

  // Load publishers from localStorage (in real app, this would be from a backend)
  loadPublishers() {
    const stored = localStorage.getItem('awarely_publishers');
    return stored ? JSON.parse(stored) : [];
  }

  // Save publishers to localStorage
  savePublishers() {
    localStorage.setItem('awarely_publishers', JSON.stringify(this.publishers));
  }

  // Load current publisher session
  loadCurrentPublisher() {
    const stored = localStorage.getItem('awarely_current_publisher');
    return stored ? JSON.parse(stored) : null;
  }

  // Save current publisher session
  saveCurrentPublisher(publisher) {
    localStorage.setItem('awarely_current_publisher', JSON.stringify(publisher));
    this.currentPublisher = publisher;
  }

  // Register a new publisher
  async registerPublisher(publisherData) {
    try {
      const {
        name,
        email,
        organization,
        website,
        description,
        category,
        credentials
      } = publisherData;

      // Validation
      if (!name || !email || !organization) {
        throw new Error('Name, email, and organization are required');
      }

      // Check if email already exists
      const existingPublisher = this.publishers.find(p => p.email === email);
      if (existingPublisher) {
        throw new Error('Publisher with this email already exists');
      }

      // Create new publisher
      const newPublisher = {
        id: `pub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        organization,
        website: website || '',
        description: description || '',
        category: category || 'general',
        credentials: credentials || '',
        verified: false,
        verificationStatus: 'pending',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        articlesPublished: 0,
        reputation: 0,
        permissions: ['submit_articles'], // Basic permissions
        status: 'active'
      };

      this.publishers.push(newPublisher);
      this.savePublishers();

      return {
        success: true,
        publisher: newPublisher,
        message: 'Publisher registered successfully. Verification pending.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Login publisher
  async loginPublisher(email, password) {
    try {
      // In a real app, this would verify against a secure backend
      const publisher = this.publishers.find(p => p.email === email);
      
      if (!publisher) {
        throw new Error('Publisher not found');
      }

      if (publisher.status !== 'active') {
        throw new Error('Publisher account is not active');
      }

      // Update last login
      publisher.lastLogin = new Date().toISOString();
      this.savePublishers();
      this.saveCurrentPublisher(publisher);

      return {
        success: true,
        publisher,
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Logout publisher
  logout() {
    localStorage.removeItem('awarely_current_publisher');
    this.currentPublisher = null;
  }

  // Check if publisher is authenticated
  isAuthenticated() {
    return this.currentPublisher !== null;
  }

  // Check if publisher is verified
  isVerified() {
    return this.currentPublisher && this.currentPublisher.verified;
  }

  // Get current publisher
  getCurrentPublisher() {
    return this.currentPublisher;
  }

  // Check publisher permissions
  hasPermission(permission) {
    if (!this.currentPublisher) return false;
    return this.currentPublisher.permissions.includes(permission);
  }

  // Verify publisher (admin function)
  async verifyPublisher(publisherId, verificationData) {
    try {
      const publisher = this.publishers.find(p => p.id === publisherId);
      if (!publisher) {
        throw new Error('Publisher not found');
      }

      publisher.verified = true;
      publisher.verificationStatus = 'verified';
      publisher.verificationDate = new Date().toISOString();
      publisher.verificationData = verificationData;

      // Add additional permissions for verified publishers
      publisher.permissions.push('priority_review', 'auto_publish_low_risk');

      this.savePublishers();

      return {
        success: true,
        message: 'Publisher verified successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all publishers (admin function)
  getAllPublishers() {
    return this.publishers;
  }

  // Get publisher statistics
  getPublisherStats(publisherId) {
    const publisher = this.publishers.find(p => p.id === publisherId);
    if (!publisher) return null;

    return {
      articlesPublished: publisher.articlesPublished,
      reputation: publisher.reputation,
      verificationStatus: publisher.verificationStatus,
      memberSince: publisher.createdAt,
      lastActive: publisher.lastLogin
    };
  }

  // Update publisher reputation
  updateReputation(publisherId, change, reason) {
    const publisher = this.publishers.find(p => p.id === publisherId);
    if (!publisher) return false;

    publisher.reputation = Math.max(0, publisher.reputation + change);
    publisher.reputationHistory = publisher.reputationHistory || [];
    publisher.reputationHistory.push({
      change,
      reason,
      timestamp: new Date().toISOString(),
      newTotal: publisher.reputation
    });

    this.savePublishers();
    return true;
  }

  // Increment article count
  incrementArticleCount(publisherId) {
    const publisher = this.publishers.find(p => p.id === publisherId);
    if (!publisher) return false;

    publisher.articlesPublished += 1;
    this.savePublishers();
    return true;
  }

  // Generate publisher API key (for future API access)
  generateApiKey(publisherId) {
    const publisher = this.publishers.find(p => p.id === publisherId);
    if (!publisher) return null;

    const apiKey = `ak_${publisherId}_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
    publisher.apiKey = apiKey;
    publisher.apiKeyCreated = new Date().toISOString();
    
    this.savePublishers();
    return apiKey;
  }

  // Validate API key
  validateApiKey(apiKey) {
    const publisher = this.publishers.find(p => p.apiKey === apiKey);
    return publisher && publisher.status === 'active';
  }
}

// Export singleton instance
const publisherAuthService = new PublisherAuthService();
export default publisherAuthService;
