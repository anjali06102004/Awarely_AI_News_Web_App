// Advanced AI Service for News Analysis and Processing
class AdvancedAIService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || 'demo-key'
    this.baseURL = 'https://api.openai.com/v1'
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // AI-powered content summarization
  async summarizeArticle(article) {
    const cacheKey = `summary_${article.url}`
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    try {
      // Simulate AI summarization (replace with actual API call)
      const summary = await this.simulateAISummarization(article)
      
      const result = {
        summary: summary.text,
        keyPoints: summary.keyPoints,
        readingTime: this.estimateReadingTime(article.content || article.description),
        sentiment: await this.analyzeSentiment(article.title + ' ' + (article.description || '')),
        confidence: summary.confidence
      }

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() })
      return result
    } catch (error) {
      console.error('Error summarizing article:', error)
      return {
        summary: article.description || 'Summary not available',
        keyPoints: [],
        readingTime: this.estimateReadingTime(article.description || ''),
        sentiment: 'neutral',
        confidence: 0.5
      }
    }
  }

  // AI sentiment analysis
  async analyzeSentiment(text) {
    if (!text) return 'neutral'

    try {
      // Simulate sentiment analysis
      const sentimentScore = await this.simulateSentimentAnalysis(text)
      
      if (sentimentScore > 0.1) return 'positive'
      if (sentimentScore < -0.1) return 'negative'
      return 'neutral'
    } catch (error) {
      console.error('Error analyzing sentiment:', error)
      return 'neutral'
    }
  }

  // AI-powered news categorization
  async categorizeNews(article) {
    const cacheKey = `category_${article.url}`
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    try {
      const category = await this.simulateNewsCategorization(article)
      this.cache.set(cacheKey, { data: category, timestamp: Date.now() })
      return category
    } catch (error) {
      console.error('Error categorizing news:', error)
      return 'general'
    }
  }

  // AI duplicate detection
  async detectDuplicates(articles) {
    const duplicateGroups = []
    const processed = new Set()

    for (let i = 0; i < articles.length; i++) {
      if (processed.has(i)) continue

      const currentArticle = articles[i]
      const duplicates = [currentArticle]
      processed.add(i)

      for (let j = i + 1; j < articles.length; j++) {
        if (processed.has(j)) continue

        const similarity = await this.calculateSimilarity(currentArticle, articles[j])
        if (similarity > 0.8) {
          duplicates.push(articles[j])
          processed.add(j)
        }
      }

      if (duplicates.length > 1) {
        duplicateGroups.push({
          articles: duplicates,
          similarity: 'high',
          reason: 'Similar content detected'
        })
      }
    }

    return duplicateGroups
  }

  // AI personalized recommendations
  async getPersonalizedRecommendations(userPreferences, articles, readingHistory = []) {
    try {
      const scoredArticles = await Promise.all(
        articles.map(async (article) => {
          const score = await this.calculatePersonalizationScore(
            article,
            userPreferences,
            readingHistory
          )
          return { ...article, personalizedScore: score }
        })
      )

      return scoredArticles
        .sort((a, b) => b.personalizedScore - a.personalizedScore)
        .slice(0, 10)
    } catch (error) {
      console.error('Error getting personalized recommendations:', error)
      return articles.slice(0, 10)
    }
  }

  // AI trend prediction
  async predictTrends(articles, timeframe = '24h') {
    try {
      const trends = await this.simulateTrendPrediction(articles, timeframe)
      return trends
    } catch (error) {
      console.error('Error predicting trends:', error)
      return []
    }
  }

  // AI fact checking
  async factCheck(article) {
    try {
      const factCheckResult = await this.simulateFactChecking(article)
      return factCheckResult
    } catch (error) {
      console.error('Error fact checking:', error)
      return {
        credibilityScore: 0.7,
        flags: [],
        sources: [],
        confidence: 0.5
      }
    }
  }

  // AI content quality assessment
  async assessContentQuality(article) {
    try {
      const qualityMetrics = {
        readability: this.calculateReadability(article.content || article.description),
        credibility: await this.assessCredibility(article),
        relevance: await this.assessRelevance(article),
        freshness: this.assessFreshness(article.publishedAt),
        engagement: this.predictEngagement(article)
      }

      const overallScore = Object.values(qualityMetrics).reduce((sum, score) => sum + score, 0) / Object.keys(qualityMetrics).length

      return {
        ...qualityMetrics,
        overallScore,
        recommendation: overallScore > 0.7 ? 'high' : overallScore > 0.5 ? 'medium' : 'low'
      }
    } catch (error) {
      console.error('Error assessing content quality:', error)
      return {
        readability: 0.7,
        credibility: 0.7,
        relevance: 0.7,
        freshness: 0.7,
        engagement: 0.7,
        overallScore: 0.7,
        recommendation: 'medium'
      }
    }
  }

  // Helper methods for AI simulation (replace with actual API calls)
  async simulateAISummarization(article) {
    await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
    
    const text = article.description || article.title || ''
    const words = text.split(' ')
    
    return {
      text: words.slice(0, 30).join(' ') + (words.length > 30 ? '...' : ''),
      keyPoints: [
        'Key development in ' + (article.category || 'news'),
        'Important implications discussed',
        'Expert opinions included'
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      confidence: 0.8 + Math.random() * 0.2
    }
  }

  async simulateSentimentAnalysis(text) {
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'success', 'win', 'growth', 'up']
    const negativeWords = ['bad', 'terrible', 'negative', 'fail', 'loss', 'down', 'crisis', 'problem']
    
    const words = text.toLowerCase().split(' ')
    let score = 0
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 0.1
      if (negativeWords.includes(word)) score -= 0.1
    })
    
    return Math.max(-1, Math.min(1, score + (Math.random() - 0.5) * 0.2))
  }

  async simulateNewsCategorization(article) {
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const title = (article.title || '').toLowerCase()
    const description = (article.description || '').toLowerCase()
    const content = title + ' ' + description
    
    const categories = {
      technology: ['tech', 'ai', 'software', 'computer', 'digital', 'internet', 'app'],
      business: ['business', 'economy', 'market', 'finance', 'money', 'company', 'stock'],
      politics: ['politics', 'government', 'election', 'policy', 'congress', 'senate'],
      sports: ['sports', 'game', 'team', 'player', 'match', 'championship', 'league'],
      health: ['health', 'medical', 'doctor', 'hospital', 'disease', 'treatment'],
      science: ['science', 'research', 'study', 'discovery', 'experiment', 'scientist']
    }
    
    let bestCategory = 'general'
    let maxScore = 0
    
    Object.entries(categories).forEach(([category, keywords]) => {
      const score = keywords.reduce((sum, keyword) => {
        return sum + (content.includes(keyword) ? 1 : 0)
      }, 0)
      
      if (score > maxScore) {
        maxScore = score
        bestCategory = category
      }
    })
    
    return bestCategory
  }

  async calculateSimilarity(article1, article2) {
    const title1 = (article1.title || '').toLowerCase().split(' ')
    const title2 = (article2.title || '').toLowerCase().split(' ')
    
    const commonWords = title1.filter(word => title2.includes(word))
    const totalWords = new Set([...title1, ...title2]).size
    
    return commonWords.length / totalWords
  }

  async calculatePersonalizationScore(article, preferences, history) {
    let score = 0.5 // Base score
    
    // Category preference
    if (preferences.categories && preferences.categories[article.category]) {
      score += 0.3
    }
    
    // Reading history similarity
    const historyCategories = history.map(h => h.category)
    if (historyCategories.includes(article.category)) {
      score += 0.2
    }
    
    // Freshness
    const hoursOld = (Date.now() - new Date(article.publishedAt)) / (1000 * 60 * 60)
    if (hoursOld < 24) score += 0.1
    
    return Math.min(1, score)
  }

  async simulateTrendPrediction(articles, timeframe) {
    const categoryCount = {}
    const keywordCount = {}
    
    articles.forEach(article => {
      // Count categories
      const category = article.category || 'general'
      categoryCount[category] = (categoryCount[category] || 0) + 1
      
      // Count keywords
      const words = (article.title || '').toLowerCase().split(' ')
      words.forEach(word => {
        if (word.length > 3) {
          keywordCount[word] = (keywordCount[word] || 0) + 1
        }
      })
    })
    
    const trends = []
    
    // Top trending categories
    Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .forEach(([category, count]) => {
        trends.push({
          type: 'category',
          name: category,
          score: count / articles.length,
          prediction: 'rising',
          confidence: 0.7 + Math.random() * 0.3
        })
      })
    
    // Top trending keywords
    Object.entries(keywordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([keyword, count]) => {
        if (count > 2) {
          trends.push({
            type: 'keyword',
            name: keyword,
            score: count / articles.length,
            prediction: 'trending',
            confidence: 0.6 + Math.random() * 0.4
          })
        }
      })
    
    return trends
  }

  async simulateFactChecking(article) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const credibilityScore = 0.6 + Math.random() * 0.4
    const flags = []
    
    if (credibilityScore < 0.7) {
      flags.push('Verify claims with additional sources')
    }
    
    if ((article.title || '').includes('BREAKING')) {
      flags.push('Breaking news - verify with multiple sources')
    }
    
    return {
      credibilityScore,
      flags,
      sources: ['Reuters', 'AP News', 'BBC'].slice(0, Math.floor(Math.random() * 3) + 1),
      confidence: credibilityScore
    }
  }

  // Reading time estimation
  estimateReadingTime(text) {
    if (!text) return 1
    const wordsPerMinute = 200
    const words = text.split(' ').length
    return Math.max(1, Math.ceil(words / wordsPerMinute))
  }

  // Content quality assessment helpers
  calculateReadability(text) {
    if (!text) return 0.5
    const sentences = text.split(/[.!?]+/).length
    const words = text.split(' ').length
    const avgWordsPerSentence = words / sentences
    
    // Simple readability score (lower is better, normalize to 0-1)
    return Math.max(0, Math.min(1, 1 - (avgWordsPerSentence - 15) / 20))
  }

  async assessCredibility(article) {
    const source = article.source?.name || ''
    const trustedSources = ['Reuters', 'AP News', 'BBC', 'CNN', 'The New York Times']
    
    let score = 0.5
    if (trustedSources.includes(source)) score += 0.3
    if (article.author) score += 0.1
    if (article.publishedAt) score += 0.1
    
    return Math.min(1, score)
  }

  async assessRelevance(article) {
    const hoursOld = (Date.now() - new Date(article.publishedAt)) / (1000 * 60 * 60)
    
    if (hoursOld < 1) return 1.0
    if (hoursOld < 6) return 0.9
    if (hoursOld < 24) return 0.8
    if (hoursOld < 72) return 0.6
    return 0.4
  }

  assessFreshness(publishedAt) {
    const hoursOld = (Date.now() - new Date(publishedAt)) / (1000 * 60 * 60)
    return Math.max(0, Math.min(1, 1 - hoursOld / 168)) // 1 week = 0
  }

  predictEngagement(article) {
    let score = 0.5
    
    // Title engagement factors
    const title = article.title || ''
    if (title.includes('?')) score += 0.1
    if (title.includes('BREAKING')) score += 0.2
    if (title.length > 50 && title.length < 100) score += 0.1
    
    return Math.min(1, score)
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

export default new AdvancedAIService()
