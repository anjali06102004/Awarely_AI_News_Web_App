import axios from 'axios';

// Multiple News API configurations for global coverage
const NEWS_API_KEY = 'f6f321a157084ae9bd048cf6f833f2c0'; // from NewsAPI.org
const NEWSAPI_BASE_URL = 'https://newsapi.org/v2';
const GNEWS_API_KEY = 'cf1f968e8e389b93c361c7dde3b0525d'; // from gnews.io
const GNEWS_BASE_URL = 'https://gnews.io/api/v4';
const NEWSDATA_API_KEY = 'pub_77788ffd151a7e7c03c759b030a1debce66f1'; // from newsdata.io
const NEWSDATA_BASE_URL = 'https://newsdata.io/api/1';

// Global news sources and countries
const GLOBAL_COUNTRIES = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'in', name: 'India' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'jp', name: 'Japan' },
  { code: 'cn', name: 'China' },
  { code: 'br', name: 'Brazil' },
  { code: 'mx', name: 'Mexico' },
  { code: 'ru', name: 'Russia' },
  { code: 'it', name: 'Italy' },
  { code: 'es', name: 'Spain' },
  { code: 'kr', name: 'South Korea' }
];

const NEWS_DOMAINS = [
  'technology', 'business', 'politics', 'sports', 'entertainment',
  'science', 'health', 'world', 'environment', 'education',
  'finance', 'startup', 'ai', 'blockchain', 'cybersecurity'
];

class NewsApiService {
  constructor() {
    this.axios = axios.create({
      timeout: 15000,
    });
    this.publishedNews = []; // Store for publisher-submitted news
  }

  // Get available countries for filtering
  getAvailableCountries() {
    return GLOBAL_COUNTRIES;
  }

  // Get available domains for filtering
  getAvailableDomains() {
    return NEWS_DOMAINS;
  }

  // Enhanced global news fetching with multiple sources
  async fetchGlobalNews(options = {}) {
    const {
      category = 'general',
      country = null,
      domain = null,
      query = null,
      page = 1,
      pageSize = 20,
      sortBy = 'publishedAt'
    } = options;

    try {
      // Try multiple news sources for better coverage
      const sources = [];
      
      // Source 1: NewsAPI.org
      if (NEWS_API_KEY && NEWS_API_KEY !== 'your_api_key') {
        sources.push(this.fetchFromNewsAPI(category, country, query, page, pageSize));
      }
      
      // Source 2: Hacker News (for tech news)
      if (category === 'technology' || domain === 'technology' || query?.toLowerCase().includes('tech')) {
        sources.push(this.fetchFromHackerNews());
      }
      
      // Source 3: Guardian API (free alternative)
      sources.push(this.fetchFromGuardian(category, query, page, pageSize));
      
      // Source 4: Publisher-submitted news
      sources.push(this.fetchPublisherNews(category, country, domain, query));
      
      // Fetch from all sources and combine
      const results = await Promise.allSettled(sources);
      const allArticles = [];
      
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value?.articles) {
          allArticles.push(...result.value.articles);
        }
      });
      
      // Remove duplicates and apply filters
      const uniqueArticles = this.removeDuplicates(allArticles);
      const filteredArticles = this.applyFilters(uniqueArticles, { category, country, domain, query });
      
      // Sort articles
      const sortedArticles = this.sortArticles(filteredArticles, sortBy);
      
      return {
        articles: sortedArticles.slice(0, pageSize),
        totalResults: sortedArticles.length,
        sources: results.length,
        filters: { category, country, domain, query }
      };
    } catch (error) {
      console.error('Error fetching global news:', error);
      return this.getFallbackNews(category);
    }
  }

  // Fetch AI technology news (enhanced)
  async fetchAITechNews(page = 1, pageSize = 20) {
    return this.fetchGlobalNews({
      category: 'technology',
      domain: 'ai',
      query: 'artificial intelligence OR machine learning OR AI OR neural networks',
      page,
      pageSize
    });
  }

  // Fetch from NewsAPI.org
  async fetchFromNewsAPI(category, country, query, page, pageSize) {
    try {
      let url = `${NEWSAPI_BASE_URL}/top-headlines?apiKey=${NEWS_API_KEY}&pageSize=${pageSize}&page=${page}`;
      
      if (category && category !== 'general') url += `&category=${category}`;
      if (country) url += `&country=${country}`;
      if (query) url += `&q=${encodeURIComponent(query)}`;
      
      const response = await this.axios.get(url);
      return this.formatNewsAPIResponse(response.data);
    } catch (error) {
      console.error('Error fetching from NewsAPI:', error);
      return { articles: [], totalResults: 0 };
    }
  }

  // Fetch from Guardian API (free alternative)
  async fetchFromGuardian(category, query, page, pageSize) {
    try {
      let url = `https://content.guardianapis.com/search?api-key=test&show-fields=thumbnail,trailText,byline&page-size=${pageSize}&page=${page}`;
      
      if (category && category !== 'general') {
        const sectionMap = {
          'technology': 'technology',
          'business': 'business',
          'politics': 'politics',
          'sports': 'sport',
          'science': 'science',
          'world': 'world'
        };
        if (sectionMap[category]) url += `&section=${sectionMap[category]}`;
      }
      
      if (query) url += `&q=${encodeURIComponent(query)}`;
      
      const response = await this.axios.get(url);
      return this.formatGuardianResponse(response.data);
    } catch (error) {
      console.error('Error fetching from Guardian:', error);
      return { articles: [], totalResults: 0 };
    }
  }

  // Alternative: Fetch from Hacker News API (free, no key required)
  async fetchFromHackerNews() {
    try {
      // Get top stories
      const topStoriesResponse = await this.axios.get(
        'https://hacker-news.firebaseio.com/v0/topstories.json'
      );
      
      // Get first 30 stories for better coverage
      const storyIds = topStoriesResponse.data.slice(0, 30);
      
      // Fetch story details
      const storyPromises = storyIds.map(id => 
        this.axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      );
      
      const stories = await Promise.all(storyPromises);
      
      // Filter for tech related stories
      const techStories = stories
        .map(response => response.data)
        .filter(story => {
          if (!story || !story.title) return false;
          const title = story.title.toLowerCase();
          return title.includes('ai') || 
                 title.includes('artificial intelligence') ||
                 title.includes('machine learning') ||
                 title.includes('neural') ||
                 title.includes('chatgpt') ||
                 title.includes('openai') ||
                 title.includes('tech') ||
                 title.includes('programming') ||
                 title.includes('software') ||
                 title.includes('startup') ||
                 title.includes('crypto') ||
                 title.includes('blockchain');
        });

      return this.formatHackerNewsResponse(techStories);
    } catch (error) {
      console.error('Error fetching from Hacker News:', error);
      return { articles: [], totalResults: 0 };
    }
  }

  // Format NewsAPI response
  formatNewsAPIResponse(data) {
    const formattedArticles = data.articles?.map(article => ({
      id: `newsapi-${Date.now()}-${Math.random()}`,
      title: article.title,
      summary: article.description || 'No description available',
      content: article.content || article.description || 'Full article available at source',
      author: article.author || 'Unknown Author',
      source: article.source?.name || 'NewsAPI',
      publishedAt: article.publishedAt,
      image: article.urlToImage || this.getDefaultImage('news'),
      category: this.detectCategory(article.title + ' ' + article.description),
      sentiment: 'neutral',
      readTime: this.calculateReadTime(article.content || article.description),
      bookmarked: false,
      url: article.url,
      country: 'global'
    })) || [];

    return {
      articles: formattedArticles,
      totalResults: data.totalResults || formattedArticles.length
    };
  }

  // Format Guardian API response
  formatGuardianResponse(data) {
    const formattedArticles = data.response?.results?.map(article => ({
      id: `guardian-${article.id}`,
      title: article.webTitle,
      summary: article.fields?.trailText || 'Read more on The Guardian',
      content: article.fields?.trailText || 'Full article available on The Guardian',
      author: article.fields?.byline || 'Guardian Staff',
      source: 'The Guardian',
      publishedAt: article.webPublicationDate,
      image: article.fields?.thumbnail || this.getDefaultImage('guardian'),
      category: this.mapGuardianSection(article.sectionName),
      sentiment: 'neutral',
      readTime: '4 min read',
      bookmarked: false,
      url: article.webUrl,
      country: 'gb'
    })) || [];

    return {
      articles: formattedArticles,
      totalResults: data.response?.total || formattedArticles.length
    };
  }

  // Format Hacker News response to match our app structure
  formatHackerNewsResponse(stories) {
    const techImages = [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=200&fit=crop'
    ];

    const formattedArticles = stories.map((story, index) => ({
      id: `hn-${story.id}`,
      title: story.title,
      summary: story.text ? story.text.substring(0, 200) + '...' : 'Click to read more on Hacker News',
      content: story.text || 'Full article available on Hacker News',
      author: story.by || 'HN User',
      source: 'Hacker News',
      publishedAt: new Date(story.time * 1000).toISOString(),
      image: techImages[index % techImages.length],
      category: 'Technology',
      sentiment: 'neutral',
      readTime: '3 min read',
      bookmarked: false,
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      country: 'us'
    }));

    return {
      articles: formattedArticles,
      totalResults: formattedArticles.length
    };
  }

  // Publisher news management
  async fetchPublisherNews(category, country, domain, query) {
    try {
      let filteredNews = [...this.publishedNews];
      
      if (category && category !== 'all') {
        filteredNews = filteredNews.filter(article => 
          article.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (country) {
        filteredNews = filteredNews.filter(article => 
          article.country === country
        );
      }
      
      if (domain) {
        filteredNews = filteredNews.filter(article => 
          article.domain === domain
        );
      }
      
      if (query) {
        const searchTerm = query.toLowerCase();
        filteredNews = filteredNews.filter(article => 
          article.title.toLowerCase().includes(searchTerm) ||
          article.summary.toLowerCase().includes(searchTerm)
        );
      }
      
      return {
        articles: filteredNews,
        totalResults: filteredNews.length
      };
    } catch (error) {
      console.error('Error fetching publisher news:', error);
      return { articles: [], totalResults: 0 };
    }
  }

  // Submit news from publishers
  async submitPublisherNews(newsData) {
    try {
      const newArticle = {
        id: `publisher-${Date.now()}-${Math.random()}`,
        title: newsData.title,
        summary: newsData.summary,
        content: newsData.content,
        author: newsData.author,
        source: newsData.publisherName || 'Independent Publisher',
        publishedAt: new Date().toISOString(),
        image: newsData.image || this.getDefaultImage('news'),
        category: newsData.category || 'General',
        domain: newsData.domain || 'general',
        country: newsData.country || 'global',
        sentiment: 'neutral',
        readTime: this.calculateReadTime(newsData.content),
        bookmarked: false,
        url: newsData.url || '#',
        verified: false, // Publishers need verification
        publisherId: newsData.publisherId
      };
      
      this.publishedNews.unshift(newArticle);
      return { success: true, article: newArticle };
    } catch (error) {
      console.error('Error submitting publisher news:', error);
      return { success: false, error: error.message };
    }
  }

  // Utility methods
  removeDuplicates(articles) {
    const seen = new Set();
    return articles.filter(article => {
      const key = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  applyFilters(articles, filters) {
    let filtered = [...articles];
    
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(article => 
        article.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.country) {
      filtered = filtered.filter(article => 
        article.country === filters.country
      );
    }
    
    if (filters.domain) {
      filtered = filtered.filter(article => 
        article.domain === filters.domain
      );
    }
    
    if (filters.query) {
      const searchTerm = filters.query.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.summary.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm)
      );
    }
    
    return filtered;
  }

  sortArticles(articles, sortBy) {
    return articles.sort((a, b) => {
      switch (sortBy) {
        case 'publishedAt':
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'source':
          return a.source.localeCompare(b.source);
        default:
          return new Date(b.publishedAt) - new Date(a.publishedAt);
      }
    });
  }

  detectCategory(text) {
    const keywords = {
      'technology': ['tech', 'ai', 'software', 'computer', 'digital', 'internet'],
      'business': ['business', 'economy', 'market', 'finance', 'company'],
      'politics': ['politics', 'government', 'election', 'policy', 'minister'],
      'sports': ['sports', 'football', 'basketball', 'soccer', 'game'],
      'science': ['science', 'research', 'study', 'discovery', 'experiment'],
      'health': ['health', 'medical', 'doctor', 'hospital', 'disease']
    };
    
    const lowerText = text.toLowerCase();
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => lowerText.includes(word))) {
        return category;
      }
    }
    return 'general';
  }

  mapGuardianSection(section) {
    const sectionMap = {
      'technology': 'Technology',
      'business': 'Business',
      'politics': 'Politics',
      'sport': 'Sports',
      'science': 'Science',
      'world': 'World'
    };
    return sectionMap[section?.toLowerCase()] || 'General';
  }

  calculateReadTime(content) {
    if (!content) return '2 min read';
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200); // Average reading speed
    return `${minutes} min read`;
  }

  getDefaultImage(type) {
    const images = {
      'news': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop',
      'guardian': 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=200&fit=crop',
      'technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop'
    };
    return images[type] || images['news'];
  }

  getFallbackNews(category) {
    return this.getMockNewsByCategory(category);
  }

  // Advanced search with voice and image support
  async advancedSearch(options = {}) {
    const {
      textQuery = '',
      voiceQuery = '',
      imageQuery = '',
      location = null,
      domain = null,
      dateRange = null,
      sortBy = 'publishedAt'
    } = options;

    try {
      // Combine all query types
      let combinedQuery = textQuery;
      if (voiceQuery) combinedQuery += ' ' + voiceQuery;
      if (imageQuery) combinedQuery += ' ' + imageQuery;

      const searchOptions = {
        query: combinedQuery.trim(),
        country: location,
        domain: domain,
        sortBy: sortBy
      };

      const results = await this.fetchGlobalNews(searchOptions);
      
      // Apply date range filter if specified
      if (dateRange && results.articles) {
        const { start, end } = dateRange;
        results.articles = results.articles.filter(article => {
          const publishedDate = new Date(article.publishedAt);
          return publishedDate >= new Date(start) && publishedDate <= new Date(end);
        });
      }

      return results;
    } catch (error) {
      console.error('Error in advanced search:', error);
      return this.getFallbackNews('all');
    }
  }

  // Generate diverse news content for all categories
  getMockNewsByCategory(category = 'all') {
    const currentDate = new Date();
    const baseImages = {
      technology: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
      business: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
      sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
      entertainment: 'https://images.unsplash.com/photo-1489599735734-79b4169c2a78?w=400',
      science: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      health: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      world: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400',
      environment: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400',
      education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400'
    };

    const allArticles = [
      // Technology News (5 articles)
      {
        id: 'tech-1',
        title: 'Revolutionary AI Breakthrough in Neural Networks',
        summary: 'Scientists develop new neural network architecture that mimics human brain processing more accurately.',
        content: 'A team of researchers has developed a groundbreaking neural network architecture that significantly improves AI performance.',
        author: 'Dr. Sarah Chen',
        source: 'Tech Innovation',
        publishedAt: new Date(currentDate.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        image: baseImages.technology,
        category: 'Technology',
        sentiment: 'positive',
        readTime: '5 min read',
        bookmarked: false
      },
      {
        id: 'tech-2',
        title: 'Google DeepMind Achieves Breakthrough in Protein Folding',
        summary: 'AlphaFold 3 demonstrates unprecedented accuracy in predicting protein structures, revolutionizing drug discovery.',
        content: 'Google DeepMind\'s latest AlphaFold 3 model has achieved remarkable accuracy in protein structure prediction.',
        author: 'DeepMind Research',
        source: 'Nature AI',
        publishedAt: new Date(currentDate.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        image: baseImages.technology,
        category: 'Technology',
        sentiment: 'positive',
        readTime: '5 min read',
        bookmarked: false
      },
      // Business News
      {
        id: 'biz-1',
        title: 'Tesla Reports Record Quarterly Earnings',
        summary: 'Electric vehicle manufacturer Tesla exceeds Wall Street expectations with strong Q4 performance.',
        content: 'Tesla has reported record quarterly earnings, driven by increased vehicle deliveries and improved manufacturing efficiency.',
        author: 'Financial Reporter',
        source: 'Business Wire',
        publishedAt: new Date(currentDate.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        image: baseImages.business,
        category: 'Business',
        sentiment: 'positive',
        readTime: '3 min read',
        bookmarked: false
      },
      {
        id: 'biz-2',
        title: 'Global Markets Show Mixed Signals Amid Economic Uncertainty',
        summary: 'Stock markets worldwide display volatility as investors weigh inflation concerns against growth prospects.',
        content: 'Financial markets continue to show mixed performance as global economic indicators present conflicting signals.',
        author: 'Market Analyst',
        source: 'Financial Times',
        publishedAt: new Date(currentDate.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        image: baseImages.business,
        category: 'Business',
        sentiment: 'neutral',
        readTime: '4 min read',
        bookmarked: false
      },
      // Sports News
      {
        id: 'sport-1',
        title: 'Championship Finals Set for This Weekend',
        summary: 'Two powerhouse teams prepare for the ultimate showdown in what promises to be an epic finale.',
        content: 'The championship finals are set with both teams showing exceptional form throughout the season.',
        author: 'Sports Reporter',
        source: 'ESPN',
        publishedAt: new Date(currentDate.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        image: baseImages.sports,
        category: 'Sports',
        sentiment: 'positive',
        readTime: '3 min read',
        bookmarked: false
      },
      // Entertainment News
      {
        id: 'ent-1',
        title: 'New Blockbuster Film Breaks Opening Weekend Records',
        summary: 'Latest superhero movie shatters box office expectations with record-breaking opening weekend performance.',
        content: 'The highly anticipated film has exceeded all expectations, setting new records for opening weekend revenue.',
        author: 'Entertainment Correspondent',
        source: 'Hollywood Reporter',
        publishedAt: new Date(currentDate.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        image: baseImages.entertainment,
        category: 'Entertainment',
        sentiment: 'positive',
        readTime: '2 min read',
        bookmarked: false
      },
      // Science News
      {
        id: 'sci-1',
        title: 'NASA Discovers Potentially Habitable Exoplanet',
        summary: 'Space telescope identifies Earth-like planet in habitable zone of distant star system.',
        content: 'NASA\'s latest discovery brings us closer to finding life beyond Earth with this remarkable exoplanet find.',
        author: 'Space Correspondent',
        source: 'NASA News',
        publishedAt: new Date(currentDate.getTime() - 8 * 60 * 60 * 1000).toISOString(),
        image: baseImages.science,
        category: 'Science',
        sentiment: 'positive',
        readTime: '5 min read',
        bookmarked: false
      },
      // Health News
      {
        id: 'health-1',
        title: 'Breakthrough in Cancer Treatment Shows Promise',
        summary: 'New immunotherapy approach demonstrates significant success rates in clinical trials.',
        content: 'Researchers have developed a novel cancer treatment that shows remarkable promise in early trials.',
        author: 'Medical Reporter',
        source: 'Medical Journal',
        publishedAt: new Date(currentDate.getTime() - 7 * 60 * 60 * 1000).toISOString(),
        image: baseImages.health,
        category: 'Health',
        sentiment: 'positive',
        readTime: '4 min read',
        bookmarked: false
      },
      // World News
      {
        id: 'world-1',
        title: 'International Climate Summit Reaches Historic Agreement',
        summary: 'World leaders unite on ambitious climate action plan with concrete emission reduction targets.',
        content: 'The international community has reached a groundbreaking agreement on climate action.',
        author: 'Global Correspondent',
        source: 'World News',
        publishedAt: new Date(currentDate.getTime() - 9 * 60 * 60 * 1000).toISOString(),
        image: baseImages.world,
        category: 'World',
        sentiment: 'positive',
        readTime: '6 min read',
        bookmarked: false
      },
      // Politics News
      {
        id: 'pol-1',
        title: 'New Infrastructure Bill Passes Legislature',
        summary: 'Comprehensive infrastructure package approved with bipartisan support for national development.',
        content: 'The legislature has approved a major infrastructure bill aimed at modernizing national infrastructure.',
        author: 'Political Reporter',
        source: 'Political News',
        publishedAt: new Date(currentDate.getTime() - 10 * 60 * 60 * 1000).toISOString(),
        image: baseImages.politics,
        category: 'Politics',
        sentiment: 'neutral',
        readTime: '4 min read',
        bookmarked: false
      },
      // Environment News
      {
        id: 'env-1',
        title: 'Renewable Energy Reaches New Milestone',
        summary: 'Solar and wind power generation hits record highs as clean energy adoption accelerates globally.',
        content: 'Renewable energy sources have achieved unprecedented generation levels, marking a significant step toward sustainable energy goals.',
        author: 'Environmental Reporter',
        source: 'Green Energy Today',
        publishedAt: new Date(currentDate.getTime() - 11 * 60 * 60 * 1000).toISOString(),
        image: baseImages.environment,
        category: 'Environment',
        sentiment: 'positive',
        readTime: '5 min read',
        bookmarked: false
      },
      {
        id: 'env-2',
        title: 'Ocean Conservation Project Shows Remarkable Results',
        summary: 'Marine protected areas demonstrate significant recovery in biodiversity and fish populations.',
        content: 'A comprehensive ocean conservation initiative has yielded impressive results in marine ecosystem restoration.',
        author: 'Marine Biologist',
        source: 'Ocean Conservation',
        publishedAt: new Date(currentDate.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        image: baseImages.environment,
        category: 'Environment',
        sentiment: 'positive',
        readTime: '6 min read',
        bookmarked: false
      },
      // Education News
      {
        id: 'edu-1',
        title: 'AI-Powered Learning Platforms Transform Education',
        summary: 'Personalized AI tutoring systems show significant improvement in student learning outcomes.',
        content: 'Educational institutions are embracing AI-powered platforms that adapt to individual learning styles and pace.',
        author: 'Education Correspondent',
        source: 'EdTech News',
        publishedAt: new Date(currentDate.getTime() - 13 * 60 * 60 * 1000).toISOString(),
        image: baseImages.education,
        category: 'Education',
        sentiment: 'positive',
        readTime: '4 min read',
        bookmarked: false
      },
      {
        id: 'edu-2',
        title: 'Global Literacy Rates Reach All-Time High',
        summary: 'International education initiatives contribute to record-breaking literacy achievements worldwide.',
        content: 'Collaborative global efforts in education have resulted in the highest literacy rates in human history.',
        author: 'UNESCO Reporter',
        source: 'Global Education',
        publishedAt: new Date(currentDate.getTime() - 14 * 60 * 60 * 1000).toISOString(),
        image: baseImages.education,
        category: 'Education',
        sentiment: 'positive',
        readTime: '5 min read',
        bookmarked: false
      }
    ];

    // Filter by category if specified
    let filteredArticles = allArticles;
    if (category !== 'all' && category !== 'trending') {
      filteredArticles = allArticles.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      );
    }

    return {
      articles: filteredArticles,
      totalResults: filteredArticles.length
    };
  }

  // Legacy method for backward compatibility
  getMockAINews() {
    return this.getMockNewsByCategory('technology');
  }

  // Fetch news by category (enhanced)
  async fetchNewsByCategory(category, page = 1, pageSize = 20, country = null, domain = null) {
    return this.fetchGlobalNews({
      category,
      country,
      domain,
      page,
      pageSize
    });
  }

  // Search news by query (enhanced)
  async searchNews(query, page = 1, pageSize = 20, filters = {}) {
    return this.fetchGlobalNews({
      query,
      category: filters.category,
      country: filters.country,
      domain: filters.domain,
      page,
      pageSize
    });
  }

  // Voice search functionality
  async voiceSearch(audioBlob) {
    try {
      // This would integrate with Web Speech API or external speech-to-text service
      // For now, return a placeholder that can be enhanced with actual voice processing
      console.log('Voice search initiated with audio blob:', audioBlob);
      
      // Placeholder: In a real implementation, you would:
      // 1. Convert audio to text using speech recognition API
      // 2. Process the text query
      // 3. Return search results
      
      return {
        success: false,
        message: 'Voice search requires speech recognition API integration',
        query: '',
        articles: []
      };
    } catch (error) {
      console.error('Error in voice search:', error);
      return {
        success: false,
        message: 'Voice search failed',
        error: error.message
      };
    }
  }

  // Image search functionality
  async imageSearch(imageFile) {
    try {
      // This would integrate with image recognition API (Google Vision, AWS Rekognition, etc.)
      // For now, return a placeholder that can be enhanced with actual image processing
      console.log('Image search initiated with image file:', imageFile);
      
      // Placeholder: In a real implementation, you would:
      // 1. Analyze image content using computer vision API
      // 2. Extract keywords/tags from image
      // 3. Search news based on extracted keywords
      
      return {
        success: false,
        message: 'Image search requires computer vision API integration',
        keywords: [],
        articles: []
      };
    } catch (error) {
      console.error('Error in image search:', error);
      return {
        success: false,
        message: 'Image search failed',
        error: error.message
      };
    }
  }
}

// Export singleton instance
const newsApiService = new NewsApiService();
export default newsApiService;