// AI Service for advanced news processing and analysis
class AIService {
  constructor() {
    this.sentimentCache = new Map();
    this.summaryCache = new Map();
  }

  // AI-powered news summarization
  async generateSummary(article) {
    const cacheKey = `summary_${article.id}`;
    if (this.summaryCache.has(cacheKey)) {
      return this.summaryCache.get(cacheKey);
    }

    try {
      // Simulate AI summarization (in production, use OpenAI API or similar)
      const summary = this.simulateAISummary(article);
      this.summaryCache.set(cacheKey, summary);
      return summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      return article.summary || 'Summary not available';
    }
  }

  // Simulate AI summarization
  simulateAISummary(article) {
    const content = article.content || article.summary;
    const sentences = content.split('.').filter(s => s.trim().length > 20);
    
    // Extract key sentences (simulate AI selection)
    const keySentences = sentences.slice(0, 2).join('. ');
    return keySentences + (keySentences.endsWith('.') ? '' : '.');
  }

  // Advanced sentiment analysis
  async analyzeSentiment(text) {
    const cacheKey = `sentiment_${text.substring(0, 50)}`;
    if (this.sentimentCache.has(cacheKey)) {
      return this.sentimentCache.get(cacheKey);
    }

    try {
      const sentiment = this.simulateSentimentAnalysis(text);
      this.sentimentCache.set(cacheKey, sentiment);
      return sentiment;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return { sentiment: 'neutral', confidence: 0.5, emotions: {} };
    }
  }

  // Simulate advanced sentiment analysis
  simulateSentimentAnalysis(text) {
    const lowerText = text.toLowerCase();
    
    // Positive keywords
    const positiveWords = ['breakthrough', 'success', 'achievement', 'innovation', 'growth', 'improvement', 'record', 'wins', 'advance', 'discover'];
    const negativeWords = ['crisis', 'failure', 'decline', 'problem', 'issue', 'concern', 'risk', 'threat', 'loss', 'controversy'];
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveScore += 1;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeScore += 1;
    });
    
    let sentiment = 'neutral';
    let confidence = 0.6;
    
    if (positiveScore > negativeScore) {
      sentiment = 'positive';
      confidence = Math.min(0.9, 0.6 + (positiveScore - negativeScore) * 0.1);
    } else if (negativeScore > positiveScore) {
      sentiment = 'negative';
      confidence = Math.min(0.9, 0.6 + (negativeScore - positiveScore) * 0.1);
    }
    
    return {
      sentiment,
      confidence,
      emotions: {
        joy: sentiment === 'positive' ? confidence : 0.1,
        anger: sentiment === 'negative' ? confidence * 0.7 : 0.1,
        fear: sentiment === 'negative' ? confidence * 0.5 : 0.1,
        surprise: Math.random() * 0.3,
        trust: sentiment === 'positive' ? confidence * 0.8 : 0.3
      },
      keywords: this.extractKeywords(text)
    };
  }

  // Extract keywords using AI simulation
  extractKeywords(text) {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    // Simulate keyword extraction (frequency-based)
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  // AI-powered content recommendations
  async getRecommendations(userPreferences, readHistory, currentArticle) {
    try {
      // Simulate ML-based recommendations
      const recommendations = this.simulateRecommendations(userPreferences, readHistory, currentArticle);
      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  // Simulate ML recommendations
  simulateRecommendations(userPreferences, readHistory, currentArticle) {
    const categories = ['Technology', 'Business', 'Science', 'Health', 'World'];
    const recommendations = [];
    
    categories.forEach(category => {
      if (Math.random() > 0.3) { // 70% chance to recommend from each category
        recommendations.push({
          category,
          confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
          reason: this.getRecommendationReason(category, userPreferences)
        });
      }
    });
    
    return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  }

  getRecommendationReason(category, preferences) {
    const reasons = {
      'Technology': 'Based on your interest in AI and tech innovations',
      'Business': 'Trending in your professional network',
      'Science': 'Matches your curiosity for scientific breakthroughs',
      'Health': 'Popular among readers with similar interests',
      'World': 'Important global developments you should know'
    };
    return reasons[category] || 'Recommended for you';
  }

  // AI trend prediction
  async predictTrends(articles) {
    try {
      const trends = this.simulateTrendPrediction(articles);
      return trends;
    } catch (error) {
      console.error('Error predicting trends:', error);
      return [];
    }
  }

  simulateTrendPrediction(articles) {
    const trendingTopics = [
      { topic: 'Artificial Intelligence', growth: '+45%', confidence: 0.92 },
      { topic: 'Climate Technology', growth: '+38%', confidence: 0.87 },
      { topic: 'Quantum Computing', growth: '+52%', confidence: 0.79 },
      { topic: 'Space Exploration', growth: '+41%', confidence: 0.84 },
      { topic: 'Biotechnology', growth: '+36%', confidence: 0.81 }
    ];
    
    return trendingTopics.sort((a, b) => b.confidence - a.confidence);
  }

  // AI-powered search enhancement
  async enhancedSearch(query, articles) {
    try {
      // Simulate semantic search
      const results = this.simulateSemanticSearch(query, articles);
      return results;
    } catch (error) {
      console.error('Error in enhanced search:', error);
      return articles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.summary.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  simulateSemanticSearch(query, articles) {
    const queryWords = query.toLowerCase().split(' ');
    
    return articles
      .map(article => {
        let relevanceScore = 0;
        const text = (article.title + ' ' + article.summary + ' ' + article.content).toLowerCase();
        
        // Direct matches
        queryWords.forEach(word => {
          if (text.includes(word)) {
            relevanceScore += 10;
          }
        });
        
        // Semantic similarity simulation
        const semanticWords = this.getSemanticWords(query);
        semanticWords.forEach(word => {
          if (text.includes(word)) {
            relevanceScore += 5;
          }
        });
        
        return { ...article, relevanceScore };
      })
      .filter(article => article.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  getSemanticWords(query) {
    const semanticMap = {
      'ai': ['artificial', 'intelligence', 'machine', 'learning', 'neural', 'algorithm'],
      'tech': ['technology', 'innovation', 'digital', 'software', 'hardware', 'computing'],
      'business': ['economy', 'market', 'finance', 'company', 'corporate', 'industry'],
      'health': ['medical', 'healthcare', 'medicine', 'treatment', 'research', 'clinical']
    };
    
    const words = [];
    Object.keys(semanticMap).forEach(key => {
      if (query.toLowerCase().includes(key)) {
        words.push(...semanticMap[key]);
      }
    });
    
    return words;
  }

  // Generate AI insights for articles
  async generateInsights(article) {
    try {
      const sentiment = await this.analyzeSentiment(article.title + ' ' + article.summary);
      const keywords = sentiment.keywords;
      const summary = await this.generateSummary(article);
      
      return {
        sentiment: sentiment.sentiment,
        confidence: sentiment.confidence,
        emotions: sentiment.emotions,
        keywords: keywords,
        aiSummary: summary,
        readingTime: this.estimateReadingTime(article.content || article.summary),
        complexity: this.analyzeComplexity(article.content || article.summary),
        topics: this.identifyTopics(article.title + ' ' + article.summary)
      };
    } catch (error) {
      console.error('Error generating insights:', error);
      return null;
    }
  }

  estimateReadingTime(text) {
    const wordsPerMinute = 200;
    const wordCount = text.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }

  analyzeComplexity(text) {
    const sentences = text.split('.').length;
    const words = text.split(' ').length;
    const avgWordsPerSentence = words / sentences;
    
    if (avgWordsPerSentence > 20) return 'Complex';
    if (avgWordsPerSentence > 15) return 'Moderate';
    return 'Simple';
  }

  identifyTopics(text) {
    const topicKeywords = {
      'AI & Technology': ['ai', 'artificial intelligence', 'machine learning', 'technology', 'software'],
      'Business & Finance': ['business', 'finance', 'market', 'economy', 'company'],
      'Science & Research': ['research', 'study', 'science', 'discovery', 'breakthrough'],
      'Health & Medicine': ['health', 'medical', 'medicine', 'treatment', 'healthcare'],
      'Politics & Society': ['politics', 'government', 'policy', 'society', 'social']
    };
    
    const lowerText = text.toLowerCase();
    const matchedTopics = [];
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matches > 0) {
        matchedTopics.push({ topic, relevance: matches });
      }
    });
    
    return matchedTopics.sort((a, b) => b.relevance - a.relevance).slice(0, 3);
  }
}

// Export singleton instance
const aiService = new AIService();
export default aiService;
