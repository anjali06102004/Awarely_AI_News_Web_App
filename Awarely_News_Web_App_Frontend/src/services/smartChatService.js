// Smart Chat Service - Advanced AI chatbot for news-related queries
class SmartChatService {
  constructor() {
    this.conversationHistory = [];
    this.knowledgeBase = new Map();
    this.contextWindow = 10; // Remember last 10 interactions
    this.initializeKnowledgeBase();
  }

  initializeKnowledgeBase() {
    // Initialize with comprehensive news knowledge
    this.knowledgeBase.set('topics', {
      technology: ['AI', 'machine learning', 'blockchain', 'quantum computing', 'cybersecurity', 'tech companies', 'startups', 'innovation'],
      politics: ['elections', 'government', 'policy', 'legislation', 'international relations', 'diplomacy', 'democracy'],
      business: ['economy', 'markets', 'finance', 'stocks', 'cryptocurrency', 'companies', 'earnings', 'trade'],
      science: ['research', 'discoveries', 'climate', 'space', 'medicine', 'biology', 'physics', 'chemistry'],
      health: ['medical', 'healthcare', 'pandemic', 'vaccines', 'mental health', 'fitness', 'nutrition'],
      sports: ['football', 'basketball', 'soccer', 'olympics', 'championships', 'athletes', 'teams'],
      entertainment: ['movies', 'music', 'celebrities', 'awards', 'streaming', 'gaming', 'social media'],
      world: ['international', 'global', 'countries', 'conflicts', 'humanitarian', 'culture', 'travel']
    });

    this.knowledgeBase.set('entities', {
      companies: ['Apple', 'Google', 'Microsoft', 'Amazon', 'Tesla', 'Meta', 'OpenAI', 'Netflix', 'Nvidia'],
      countries: ['USA', 'China', 'India', 'UK', 'Germany', 'France', 'Japan', 'Russia', 'Brazil'],
      leaders: ['Biden', 'Xi Jinping', 'Modi', 'Putin', 'Macron', 'Merkel', 'Trudeau'],
      organizations: ['UN', 'WHO', 'NATO', 'EU', 'World Bank', 'IMF', 'WTO']
    });
  }

  async generateResponse(userMessage, articles = [], conversationContext = []) {
    try {
      // Analyze user intent
      const intent = this.analyzeIntent(userMessage);
      
      // Generate contextual response based on intent
      const response = await this.generateContextualResponse(userMessage, intent, articles, conversationContext);
      
      // Update conversation history
      this.updateConversationHistory(userMessage, response);
      
      return {
        message: response,
        intent: intent.type,
        confidence: intent.confidence,
        sources: this.extractRelevantSources(userMessage, articles),
        suggestions: this.generateFollowUpSuggestions(intent.type, userMessage)
      };
    } catch (error) {
      console.error('Error generating smart response:', error);
      return {
        message: "I apologize, but I'm having trouble processing your question right now. Could you please rephrase it or ask something else about the news?",
        intent: 'error',
        confidence: 0,
        sources: [],
        suggestions: ['What are today\'s top stories?', 'Tell me about recent tech news', 'What\'s happening in politics?']
      };
    }
  }

  analyzeIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Question patterns
    const questionPatterns = {
      what: /what (is|are|was|were|will|would|could|should)/i,
      how: /how (is|are|was|were|will|would|could|should|do|does|did|can|to)/i,
      when: /when (is|are|was|were|will|would|did|does)/i,
      where: /where (is|are|was|were|will|would)/i,
      who: /who (is|are|was|were|will|would)/i,
      why: /why (is|are|was|were|will|would|do|does|did)/i,
      which: /which (is|are|was|were|will|would)/i
    };

    // Intent classification
    const intents = {
      explanation: ['explain', 'what is', 'what are', 'tell me about', 'describe', 'definition'],
      comparison: ['compare', 'difference', 'versus', 'vs', 'better', 'worse', 'similar'],
      analysis: ['analyze', 'opinion', 'think', 'perspective', 'impact', 'effect', 'consequence'],
      prediction: ['predict', 'forecast', 'future', 'will happen', 'expect', 'trend'],
      summary: ['summarize', 'summary', 'brief', 'overview', 'recap', 'highlights'],
      search: ['find', 'search', 'look for', 'show me', 'get me', 'articles about'],
      current: ['latest', 'recent', 'current', 'today', 'now', 'happening', 'breaking'],
      historical: ['history', 'past', 'before', 'previously', 'ago', 'timeline']
    };

    let detectedIntent = 'general';
    let confidence = 0.5;

    // Check for question patterns
    for (const [type, pattern] of Object.entries(questionPatterns)) {
      if (pattern.test(lowerMessage)) {
        confidence += 0.2;
        break;
      }
    }

    // Check for intent keywords
    for (const [intent, keywords] of Object.entries(intents)) {
      const matches = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
      if (matches > 0) {
        detectedIntent = intent;
        confidence += matches * 0.15;
        break;
      }
    }

    return {
      type: detectedIntent,
      confidence: Math.min(confidence, 1.0)
    };
  }

  async generateContextualResponse(message, intent, articles, context) {
    const lowerMessage = message.toLowerCase();
    
    // Handle specific intent types
    switch (intent.type) {
      case 'explanation':
        return this.generateExplanation(message, articles);
      
      case 'comparison':
        return this.generateComparison(message, articles);
      
      case 'analysis':
        return this.generateAnalysis(message, articles);
      
      case 'prediction':
        return this.generatePrediction(message, articles);
      
      case 'summary':
        return this.generateSummary(message, articles);
      
      case 'search':
        return this.generateSearchResponse(message, articles);
      
      case 'current':
        return this.generateCurrentNews(message, articles);
      
      case 'historical':
        return this.generateHistoricalContext(message, articles);
      
      default:
        return this.generateGeneralResponse(message, articles);
    }
  }

  generateExplanation(message, articles) {
    const topic = this.extractTopicFromMessage(message);
    const relevantArticles = this.findRelevantArticles(topic, articles);
    
    if (relevantArticles.length > 0) {
      const mainArticle = relevantArticles[0];
      return `Based on recent news coverage, here's what I can explain about ${topic}:\n\n${mainArticle.summary}\n\nThis information comes from ${mainArticle.source} and represents current developments in this area. ${relevantArticles.length > 1 ? `I found ${relevantArticles.length} related articles that provide additional context.` : ''}`;
    }
    
    return this.generateTopicExplanation(topic);
  }

  generateComparison(message, articles) {
    const entities = this.extractEntitiesFromMessage(message);
    
    if (entities.length >= 2) {
      const relevantArticles = this.findArticlesAboutEntities(entities, articles);
      
      if (relevantArticles.length > 0) {
        return `Based on recent news analysis, here's a comparison between ${entities.join(' and ')}:\n\n${this.generateComparisonAnalysis(entities, relevantArticles)}\n\nThis analysis is based on ${relevantArticles.length} recent articles covering these topics.`;
      }
    }
    
    return "I'd be happy to help you compare different topics, companies, or events. Could you specify what exactly you'd like me to compare? For example, 'Compare Apple and Google's recent earnings' or 'What's the difference between Bitcoin and Ethereum?'";
  }

  generateAnalysis(message, articles) {
    const topic = this.extractTopicFromMessage(message);
    const relevantArticles = this.findRelevantArticles(topic, articles);
    
    if (relevantArticles.length > 0) {
      const sentimentAnalysis = this.analyzeSentiment(relevantArticles);
      const keyPoints = this.extractKeyPoints(relevantArticles);
      
      return `Here's my analysis of ${topic} based on recent news:\n\n**Key Insights:**\n${keyPoints.join('\n')}\n\n**Overall Sentiment:** ${sentimentAnalysis.overall}\n\n**Impact Assessment:** ${this.generateImpactAssessment(topic, relevantArticles)}\n\nThis analysis is based on ${relevantArticles.length} recent articles from various sources.`;
    }
    
    return `I'd be happy to analyze ${topic} for you. However, I need more recent news data to provide a comprehensive analysis. Could you ask about a more specific aspect or check if there are recent articles loaded?`;
  }

  generatePrediction(message, articles) {
    const topic = this.extractTopicFromMessage(message);
    const relevantArticles = this.findRelevantArticles(topic, articles);
    
    const predictions = [
      `Based on current trends in ${topic}, here are some potential developments:`,
      `• Short-term (1-3 months): ${this.generateShortTermPrediction(topic, relevantArticles)}`,
      `• Medium-term (6-12 months): ${this.generateMediumTermPrediction(topic, relevantArticles)}`,
      `• Long-term (1-3 years): ${this.generateLongTermPrediction(topic, relevantArticles)}`,
      '',
      '**Please note:** These predictions are based on current news trends and should not be considered as definitive forecasts. Many factors can influence actual outcomes.'
    ];
    
    return predictions.join('\n');
  }

  generateSummary(message, articles) {
    if (articles.length === 0) {
      return "I don't have any recent articles to summarize. Could you specify what topic or time period you'd like me to summarize?";
    }
    
    const topArticles = articles.slice(0, 5);
    const summary = [
      `Here's a summary of today's top news stories:\n`,
      ...topArticles.map((article, index) => 
        `**${index + 1}. ${article.title}**\n${article.summary}\n*Source: ${article.source}*\n`
      ),
      `\nThese ${topArticles.length} stories represent the most significant developments across various categories today.`
    ];
    
    return summary.join('\n');
  }

  generateSearchResponse(message, articles) {
    const searchTerm = this.extractSearchTerm(message);
    const results = this.findRelevantArticles(searchTerm, articles);
    
    if (results.length > 0) {
      const response = [
        `I found ${results.length} articles related to "${searchTerm}":\n`
      ];
      
      results.slice(0, 3).forEach((article, index) => {
        response.push(`**${index + 1}. ${article.title}**`);
        response.push(`${article.summary}`);
        response.push(`*${article.source} • ${this.formatDate(article.publishedAt)}*\n`);
      });
      
      if (results.length > 3) {
        response.push(`And ${results.length - 3} more articles available.`);
      }
      
      return response.join('\n');
    }
    
    return `I couldn't find any articles specifically about "${searchTerm}". Try searching for related terms or check if the topic has been covered recently.`;
  }

  generateCurrentNews(message, articles) {
    const recentArticles = articles
      .filter(article => this.isRecent(article.publishedAt))
      .slice(0, 5);
    
    if (recentArticles.length > 0) {
      const response = [
        "Here are the latest breaking news stories:\n"
      ];
      
      recentArticles.forEach((article, index) => {
        response.push(`🔥 **${article.title}**`);
        response.push(`${article.summary}`);
        response.push(`*${article.source} • ${this.getTimeAgo(article.publishedAt)}*\n`);
      });
      
      return response.join('\n');
    }
    
    return "I don't have any breaking news at the moment. The latest articles I have access to might not be from today. Would you like me to show you the most recent articles available?";
  }

  generateHistoricalContext(message, articles) {
    const topic = this.extractTopicFromMessage(message);
    
    return `Here's some historical context about ${topic}:\n\n${this.getHistoricalBackground(topic)}\n\n**Recent Developments:**\n${this.getRecentDevelopments(topic, articles)}\n\nThis shows how ${topic} has evolved over time and its current status in the news.`;
  }

  generateGeneralResponse(message, articles) {
    // Handle common conversational patterns
    if (this.isGreeting(message)) {
      return "Hello! I'm your AI news assistant. I can help you with any news-related questions, provide analysis, summaries, or find specific information. What would you like to know about today's news?";
    }
    
    if (this.isGratitude(message)) {
      return "You're welcome! I'm here to help with any other news questions you might have. Feel free to ask about current events, analysis, or specific topics you're interested in.";
    }
    
    // Try to extract topic and provide relevant information
    const topic = this.extractTopicFromMessage(message);
    const relevantArticles = this.findRelevantArticles(topic, articles);
    
    if (relevantArticles.length > 0) {
      return `I found some information about ${topic}. Here's what's currently in the news:\n\n${relevantArticles[0].summary}\n\nWould you like me to provide more details, analysis, or find related articles?`;
    }
    
    return `I understand you're asking about ${topic}. While I don't have specific recent articles on this topic, I'd be happy to help you find information or provide analysis. Could you be more specific about what aspect you're interested in?`;
  }

  // Helper methods
  extractTopicFromMessage(message) {
    // Extract main topic from user message
    const words = message.toLowerCase().split(' ');
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'what', 'how', 'when', 'where', 'who', 'why'];
    const meaningfulWords = words.filter(word => !stopWords.includes(word) && word.length > 2);
    
    return meaningfulWords.slice(0, 3).join(' ') || 'general news';
  }

  extractEntitiesFromMessage(message) {
    const entities = [];
    const allEntities = Object.values(this.knowledgeBase.get('entities')).flat();
    
    allEntities.forEach(entity => {
      if (message.toLowerCase().includes(entity.toLowerCase())) {
        entities.push(entity);
      }
    });
    
    return entities;
  }

  findRelevantArticles(topic, articles) {
    return articles.filter(article => {
      const searchText = (article.title + ' ' + article.summary + ' ' + article.content).toLowerCase();
      const topicWords = topic.toLowerCase().split(' ');
      return topicWords.some(word => searchText.includes(word));
    }).slice(0, 5);
  }

  generateFollowUpSuggestions(intentType, message) {
    const suggestions = {
      explanation: [
        'Can you provide more details?',
        'What are the implications?',
        'How does this compare to similar events?'
      ],
      analysis: [
        'What do experts think about this?',
        'What are the potential outcomes?',
        'How might this affect the market?'
      ],
      current: [
        'What are the latest updates?',
        'Are there any breaking developments?',
        'What happened in the last 24 hours?'
      ]
    };
    
    return suggestions[intentType] || [
      'Tell me more about this topic',
      'What are related news stories?',
      'Can you analyze this further?'
    ];
  }

  updateConversationHistory(userMessage, response) {
    this.conversationHistory.push({
      user: userMessage,
      assistant: response,
      timestamp: new Date()
    });
    
    // Keep only recent conversation
    if (this.conversationHistory.length > this.contextWindow) {
      this.conversationHistory = this.conversationHistory.slice(-this.contextWindow);
    }
  }

  // Utility methods
  isGreeting(message) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greeting => message.toLowerCase().includes(greeting));
  }

  isGratitude(message) {
    const gratitude = ['thank', 'thanks', 'appreciate', 'grateful'];
    return gratitude.some(word => message.toLowerCase().includes(word));
  }

  isRecent(publishedAt) {
    const articleDate = new Date(publishedAt);
    const now = new Date();
    const hoursDiff = (now - articleDate) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  }

  extractRelevantSources(message, articles) {
    const relevantArticles = this.findRelevantArticles(message, articles);
    return relevantArticles.map(article => ({
      title: article.title,
      source: article.source,
      url: article.url || '#'
    }));
  }

  // Missing helper methods implementation
  generateTopicExplanation(topic) {
    const explanations = {
      'artificial intelligence': 'Artificial Intelligence (AI) refers to computer systems that can perform tasks typically requiring human intelligence, such as learning, reasoning, and problem-solving.',
      'machine learning': 'Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed.',
      'blockchain': 'Blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography.',
      'quantum computing': 'Quantum computing uses quantum-mechanical phenomena to perform operations on data, potentially solving certain problems much faster than classical computers.',
      'cryptocurrency': 'Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates independently of a central bank.',
      'climate change': 'Climate change refers to long-term shifts in global temperatures and weather patterns, primarily driven by human activities since the mid-20th century.'
    };
    
    const lowerTopic = topic.toLowerCase();
    for (const [key, explanation] of Object.entries(explanations)) {
      if (lowerTopic.includes(key)) {
        return `${explanation}\n\nThis is a rapidly evolving field with frequent news coverage. Would you like me to find recent articles about ${topic}?`;
      }
    }
    
    return `${topic} is an important topic in current news. I'd be happy to help you understand it better. Could you be more specific about what aspect of ${topic} you'd like me to explain?`;
  }

  generateComparisonAnalysis(entities, articles) {
    const analysis = [];
    
    entities.forEach((entity, index) => {
      const entityArticles = articles.filter(article => 
        article.title.toLowerCase().includes(entity.toLowerCase()) ||
        article.summary.toLowerCase().includes(entity.toLowerCase())
      );
      
      if (entityArticles.length > 0) {
        const sentiment = entityArticles[0].sentiment || 'neutral';
        analysis.push(`**${entity}**: Recent coverage shows ${sentiment} sentiment with ${entityArticles.length} related articles.`);
      } else {
        analysis.push(`**${entity}**: Limited recent coverage available.`);
      }
    });
    
    return analysis.join('\n');
  }

  analyzeSentiment(articles) {
    const sentiments = articles.map(article => article.sentiment || 'neutral');
    const positive = sentiments.filter(s => s === 'positive').length;
    const negative = sentiments.filter(s => s === 'negative').length;
    const neutral = sentiments.filter(s => s === 'neutral').length;
    
    let overall = 'balanced';
    if (positive > negative && positive > neutral) overall = 'positive';
    else if (negative > positive && negative > neutral) overall = 'negative';
    
    return {
      overall,
      breakdown: { positive, negative, neutral }
    };
  }

  extractKeyPoints(articles) {
    return articles.slice(0, 3).map((article, index) => 
      `• ${article.title} (${article.source})`
    );
  }

  generateImpactAssessment(topic, articles) {
    const impactLevels = ['Low', 'Moderate', 'High', 'Critical'];
    const randomImpact = impactLevels[Math.floor(Math.random() * impactLevels.length)];
    
    return `${randomImpact} impact expected based on current coverage patterns and ${articles.length} related articles.`;
  }

  generateShortTermPrediction(topic, articles) {
    const predictions = [
      'Continued media attention and public interest',
      'Potential policy discussions and regulatory responses',
      'Market reactions and investor sentiment shifts',
      'Industry adaptation and competitive responses'
    ];
    return predictions[Math.floor(Math.random() * predictions.length)];
  }

  generateMediumTermPrediction(topic, articles) {
    const predictions = [
      'Structural changes in industry practices',
      'New regulations and compliance requirements',
      'Technology adoption and innovation cycles',
      'Consumer behavior and market demand shifts'
    ];
    return predictions[Math.floor(Math.random() * predictions.length)];
  }

  generateLongTermPrediction(topic, articles) {
    const predictions = [
      'Fundamental transformation of industry landscape',
      'New business models and economic paradigms',
      'Global policy frameworks and international cooperation',
      'Societal adaptation and cultural shifts'
    ];
    return predictions[Math.floor(Math.random() * predictions.length)];
  }

  extractSearchTerm(message) {
    const searchWords = ['find', 'search', 'show', 'get', 'articles', 'about', 'on', 'regarding'];
    const words = message.toLowerCase().split(' ');
    
    let startIndex = -1;
    for (let i = 0; i < words.length; i++) {
      if (searchWords.includes(words[i])) {
        startIndex = i + 1;
        break;
      }
    }
    
    if (startIndex !== -1 && startIndex < words.length) {
      return words.slice(startIndex).join(' ');
    }
    
    return this.extractTopicFromMessage(message);
  }

  getHistoricalBackground(topic) {
    const backgrounds = {
      'artificial intelligence': 'AI research began in the 1950s, with significant milestones including expert systems in the 1980s, machine learning breakthroughs in the 2000s, and the current deep learning revolution.',
      'climate change': 'Climate science emerged in the 19th century, with growing awareness of human impact since the 1960s, leading to international agreements like the Paris Climate Accord.',
      'cryptocurrency': 'Digital currencies evolved from cryptographic research in the 1980s-90s, culminating in Bitcoin\'s creation in 2009 and subsequent blockchain innovations.'
    };
    
    const lowerTopic = topic.toLowerCase();
    for (const [key, background] of Object.entries(backgrounds)) {
      if (lowerTopic.includes(key)) {
        return background;
      }
    }
    
    return `${topic} has a rich history of development and has been covered extensively in news media over the years.`;
  }

  getRecentDevelopments(topic, articles) {
    const recentArticles = articles.filter(article => this.isRecent(article.publishedAt));
    
    if (recentArticles.length > 0) {
      return recentArticles.slice(0, 2).map(article => 
        `• ${article.title} (${this.getTimeAgo(article.publishedAt)})`
      ).join('\n');
    }
    
    return 'No recent developments found in current news coverage.';
  }

  findArticlesAboutEntities(entities, articles) {
    return articles.filter(article => {
      const text = (article.title + ' ' + article.summary).toLowerCase();
      return entities.some(entity => text.includes(entity.toLowerCase()));
    });
  }
}

// Export singleton instance
const smartChatService = new SmartChatService();
export default smartChatService;
