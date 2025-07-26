import publisherAuthService from './publisherAuth.js';

// News Verification and Quality Control Service
class NewsVerificationService {
  constructor() {
    this.verificationQueue = this.loadVerificationQueue();
    this.verifiedNews = this.loadVerifiedNews();
    this.flaggedContent = this.loadFlaggedContent();
  }

  // Load verification queue from localStorage
  loadVerificationQueue() {
    const stored = localStorage.getItem('awarely_verification_queue');
    return stored ? JSON.parse(stored) : [];
  }

  // Save verification queue
  saveVerificationQueue() {
    localStorage.setItem('awarely_verification_queue', JSON.stringify(this.verificationQueue));
  }

  // Load verified news
  loadVerifiedNews() {
    const stored = localStorage.getItem('awarely_verified_news');
    return stored ? JSON.parse(stored) : [];
  }

  // Save verified news
  saveVerifiedNews() {
    localStorage.setItem('awarely_verified_news', JSON.stringify(this.verifiedNews));
  }

  // Load flagged content
  loadFlaggedContent() {
    const stored = localStorage.getItem('awarely_flagged_content');
    return stored ? JSON.parse(stored) : [];
  }

  // Save flagged content
  saveFlaggedContent() {
    localStorage.setItem('awarely_flagged_content', JSON.stringify(this.flaggedContent));
  }

  // Submit news for verification
  async submitForVerification(newsData) {
    try {
      const verificationItem = {
        id: `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        newsData,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        priority: this.calculatePriority(newsData),
        riskScore: await this.calculateRiskScore(newsData),
        checks: {
          contentQuality: null,
          factCheck: null,
          sourceCredibility: null,
          duplicateCheck: null,
          biasCheck: null
        },
        reviewedBy: null,
        reviewedAt: null,
        decision: null,
        feedback: null
      };

      // Auto-approve low-risk content from verified publishers
      if (verificationItem.riskScore < 0.3 && this.isVerifiedPublisher(newsData.publisherId)) {
        verificationItem.status = 'auto_approved';
        verificationItem.decision = 'approved';
        verificationItem.reviewedAt = new Date().toISOString();
        verificationItem.reviewedBy = 'auto_system';
        
        this.verifiedNews.push(verificationItem);
        this.saveVerifiedNews();
        
        // Update publisher stats
        publisherAuthService.incrementArticleCount(newsData.publisherId);
        publisherAuthService.updateReputation(newsData.publisherId, 1, 'Article auto-approved');
      } else {
        this.verificationQueue.push(verificationItem);
        this.saveVerificationQueue();
      }

      return {
        success: true,
        verificationId: verificationItem.id,
        status: verificationItem.status,
        estimatedReviewTime: this.getEstimatedReviewTime(verificationItem.priority)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate content priority for review
  calculatePriority(newsData) {
    let priority = 'normal';
    
    // High priority for breaking news
    if (newsData.category === 'breaking' || newsData.title.toLowerCase().includes('breaking')) {
      priority = 'high';
    }
    
    // High priority for sensitive topics
    const sensitiveTopic = ['politics', 'health', 'crisis', 'emergency'].some(topic =>
      newsData.title.toLowerCase().includes(topic) || 
      newsData.summary.toLowerCase().includes(topic)
    );
    
    if (sensitiveTopic) {
      priority = 'high';
    }
    
    // Low priority for verified publishers with good reputation
    const publisher = publisherAuthService.getCurrentPublisher();
    if (publisher && publisher.verified && publisher.reputation > 80) {
      priority = priority === 'high' ? 'normal' : 'low';
    }
    
    return priority;
  }

  // Calculate risk score for content
  async calculateRiskScore(newsData) {
    let riskScore = 0;
    
    // Check for suspicious patterns
    const suspiciousWords = [
      'shocking', 'unbelievable', 'secret', 'hidden truth', 'they don\'t want you to know',
      'miracle cure', 'instant', 'guaranteed', 'exclusive', 'leaked'
    ];
    
    const text = (newsData.title + ' ' + newsData.summary + ' ' + newsData.content).toLowerCase();
    const suspiciousCount = suspiciousWords.filter(word => text.includes(word)).length;
    riskScore += suspiciousCount * 0.1;
    
    // Check for excessive capitalization
    const capsRatio = (newsData.title.match(/[A-Z]/g) || []).length / newsData.title.length;
    if (capsRatio > 0.3) riskScore += 0.2;
    
    // Check for excessive punctuation
    const exclamationCount = (newsData.title.match(/!/g) || []).length;
    if (exclamationCount > 2) riskScore += 0.15;
    
    // Check publisher reputation
    const publisher = publisherAuthService.getAllPublishers().find(p => p.id === newsData.publisherId);
    if (publisher) {
      if (publisher.reputation < 50) riskScore += 0.3;
      if (!publisher.verified) riskScore += 0.2;
      if (publisher.articlesPublished < 5) riskScore += 0.1;
    } else {
      riskScore += 0.5; // Unknown publisher
    }
    
    // Check for duplicate content
    const duplicateRisk = await this.checkForDuplicates(newsData);
    riskScore += duplicateRisk;
    
    return Math.min(riskScore, 1.0); // Cap at 1.0
  }

  // Check for duplicate content
  async checkForDuplicates(newsData) {
    try {
      // Simple duplicate detection based on title similarity
      const existingNews = [...this.verifiedNews, ...this.verificationQueue];
      
      for (const existing of existingNews) {
        const similarity = this.calculateTextSimilarity(
          newsData.title.toLowerCase(),
          existing.newsData.title.toLowerCase()
        );
        
        if (similarity > 0.8) {
          return 0.4; // High duplicate risk
        } else if (similarity > 0.6) {
          return 0.2; // Medium duplicate risk
        }
      }
      
      return 0; // No duplicates found
    } catch (error) {
      console.error('Error checking duplicates:', error);
      return 0.1; // Small risk for error
    }
  }

  // Calculate text similarity (simple implementation)
  calculateTextSimilarity(text1, text2) {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  // Check if publisher is verified
  isVerifiedPublisher(publisherId) {
    const publisher = publisherAuthService.getAllPublishers().find(p => p.id === publisherId);
    return publisher && publisher.verified;
  }

  // Get estimated review time
  getEstimatedReviewTime(priority) {
    switch (priority) {
      case 'high': return '1-2 hours';
      case 'normal': return '4-8 hours';
      case 'low': return '12-24 hours';
      default: return '4-8 hours';
    }
  }

  // Manual verification by moderator
  async verifyNews(verificationId, decision, feedback, reviewerId) {
    try {
      const itemIndex = this.verificationQueue.findIndex(item => item.id === verificationId);
      if (itemIndex === -1) {
        throw new Error('Verification item not found');
      }

      const item = this.verificationQueue[itemIndex];
      item.status = 'reviewed';
      item.decision = decision; // 'approved', 'rejected', 'needs_revision'
      item.feedback = feedback;
      item.reviewedBy = reviewerId;
      item.reviewedAt = new Date().toISOString();

      // Move to appropriate list
      if (decision === 'approved') {
        this.verifiedNews.push(item);
        this.saveVerifiedNews();
        
        // Update publisher reputation
        publisherAuthService.incrementArticleCount(item.newsData.publisherId);
        publisherAuthService.updateReputation(item.newsData.publisherId, 2, 'Article approved after review');
      } else if (decision === 'rejected') {
        this.flaggedContent.push(item);
        this.saveFlaggedContent();
        
        // Decrease publisher reputation
        publisherAuthService.updateReputation(item.newsData.publisherId, -1, 'Article rejected');
      }

      // Remove from queue
      this.verificationQueue.splice(itemIndex, 1);
      this.saveVerificationQueue();

      return {
        success: true,
        message: `News ${decision} successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get verification queue for moderators
  getVerificationQueue(priority = null) {
    let queue = [...this.verificationQueue];
    
    if (priority) {
      queue = queue.filter(item => item.priority === priority);
    }
    
    // Sort by priority and submission time
    queue.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.submittedAt) - new Date(b.submittedAt);
    });
    
    return queue;
  }

  // Get verification status
  getVerificationStatus(verificationId) {
    // Check in queue
    const queueItem = this.verificationQueue.find(item => item.id === verificationId);
    if (queueItem) {
      return {
        status: queueItem.status,
        priority: queueItem.priority,
        riskScore: queueItem.riskScore,
        estimatedReviewTime: this.getEstimatedReviewTime(queueItem.priority),
        position: this.verificationQueue.findIndex(item => item.id === verificationId) + 1
      };
    }
    
    // Check in verified
    const verifiedItem = this.verifiedNews.find(item => item.id === verificationId);
    if (verifiedItem) {
      return {
        status: 'approved',
        reviewedAt: verifiedItem.reviewedAt,
        reviewedBy: verifiedItem.reviewedBy
      };
    }
    
    // Check in flagged
    const flaggedItem = this.flaggedContent.find(item => item.id === verificationId);
    if (flaggedItem) {
      return {
        status: 'rejected',
        feedback: flaggedItem.feedback,
        reviewedAt: flaggedItem.reviewedAt,
        reviewedBy: flaggedItem.reviewedBy
      };
    }
    
    return null;
  }

  // Get verification statistics
  getVerificationStats() {
    return {
      pending: this.verificationQueue.length,
      approved: this.verifiedNews.length,
      rejected: this.flaggedContent.length,
      autoApproved: this.verifiedNews.filter(item => item.reviewedBy === 'auto_system').length,
      averageReviewTime: this.calculateAverageReviewTime(),
      highPriorityPending: this.verificationQueue.filter(item => item.priority === 'high').length
    };
  }

  // Calculate average review time
  calculateAverageReviewTime() {
    const reviewedItems = [...this.verifiedNews, ...this.flaggedContent].filter(item => 
      item.reviewedAt && item.submittedAt && item.reviewedBy !== 'auto_system'
    );
    
    if (reviewedItems.length === 0) return 0;
    
    const totalTime = reviewedItems.reduce((sum, item) => {
      const submitted = new Date(item.submittedAt);
      const reviewed = new Date(item.reviewedAt);
      return sum + (reviewed - submitted);
    }, 0);
    
    return Math.round(totalTime / reviewedItems.length / (1000 * 60 * 60)); // Hours
  }

  // Flag content for review
  flagContent(newsId, reason, reporterId) {
    const flaggedItem = {
      id: `flag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      newsId,
      reason,
      reporterId,
      flaggedAt: new Date().toISOString(),
      status: 'pending_review'
    };
    
    this.flaggedContent.push(flaggedItem);
    this.saveFlaggedContent();
    
    return {
      success: true,
      flagId: flaggedItem.id
    };
  }
}

// Export singleton instance
const newsVerificationService = new NewsVerificationService();
export default newsVerificationService;
