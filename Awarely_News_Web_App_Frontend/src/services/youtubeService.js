import axios from 'axios';

// YouTube Data API v3 configuration
// Safe environment variable access for both Vite and CRA
let YOUTUBE_API_KEY = null;
try {
  // Try Vite first (import.meta.env is available in Vite)
  if (import.meta && import.meta.env) {
    YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  }
} catch (error) {
  // Fallback to CRA (process.env is available in CRA)
  try {
    if (typeof process !== 'undefined' && process.env) {
      YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
    }
  } catch (processError) {
    console.warn('Environment variables not available, using mock data');
    YOUTUBE_API_KEY = null;
  }
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Popular news channels and podcast channels
const NEWS_CHANNELS = {
  // Major News Networks
  'CNN': 'UCupvZG-5ko_eiXAupbDfxWw',
  'BBC News': 'UC16niRr50-MSBwiO3YDb3RA',
  'Fox News': 'UCXIJgqnII2ZOINSWNOGFThA',
  'NBC News': 'UCeY0bbntWzzVIaj2z3QigXg',
  'CBS News': 'UC8p1vwvWtl6T73JiExfWs1g',
  'ABC News': 'UCBi2mrWuNuyYy4gbM6fU18Q',
  'Sky News': 'UCoMdktPbSTixAyNGwb-UYkQ',
  'Al Jazeera English': 'UCNye-wNBqNL5ZzHSJj3l8Bg',
  'Reuters': 'UChqUTb7kYRX8-EiaN3XFoSQ',
  'Associated Press': 'UCJ6K0YgGojJMIhLPONLqbOQ',
  
  // Tech News
  'TechCrunch': 'UCCjyq_K1Xwfg8Lndy7lKMpA',
  'The Verge': 'UCddiUEpeqJcYeBxX1IVBKvQ',
  'Marques Brownlee': 'UCBJycsmduvYEL83R_U4JriQ',
  'Linus Tech Tips': 'UCXuqSBlHAE6Xw-yeJA0Tunw',
  
  // Business News
  'Bloomberg': 'UCIALMKvObZNtJ6AmdCLP7Lg',
  'CNBC': 'UCrp_UI8XtuYfpiqluWLD7Lw',
  'Wall Street Journal': 'UCK7tptUDHh-RYDsdxO1-5QQ',
  
  // International News
  'DW News': 'UCknLrEdhRCp1aegoMqRaCZg',
  'France 24': 'UCQfwfsi5VrQ8yKZ-UWmAEFg',
  'NHK World': 'UCSPEjw8F2nQDtmUKPFNF7_A'
};

// Only include official channels that explicitly allow embedding and are copyright-free
const OFFICIAL_NEWS_PODCASTS = {
  // Official Government/Public Media (Public Domain/Creative Commons)
  'NASA': 'UCLA_DiR1FfKNvjuUpBHmylQ', // NASA content is public domain
  'Voice of America': 'UCVzc1W1wJONKTyFy8-6SzfA', // US government, public domain
  'BBC News': 'UC16niRr50-MSBwiO3YDb3RA', // Official BBC channel
  
  // Educational/Non-profit (Often Creative Commons)
  'TED': 'UCAuUUnT6oDeKwE6v1NGQxug', // TED Talks are often Creative Commons
  'Khan Academy': 'UC4a-Gbdw7vOaccHmFo40b9g', // Educational, Creative Commons
  
  // Note: We only include official channels that explicitly allow embedding
  // and have clear licensing terms for their content
};

class YouTubeService {
  constructor() {
    this.axios = axios.create({
      baseURL: YOUTUBE_BASE_URL,
      timeout: 10000,
    });
  }

  // Get channel information
  async getChannelInfo(channelId) {
    try {
      const response = await this.axios.get('/channels', {
        params: {
          part: 'snippet,statistics',
          id: channelId,
          key: YOUTUBE_API_KEY
        }
      });
      
      return response.data.items[0];
    } catch (error) {
      console.error('Error fetching channel info:', error);
      return null;
    }
  }

  // Get latest videos from a channel
  async getChannelVideos(channelId, maxResults = 10) {
    // If no API key, return mock data immediately
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
      console.warn('YouTube API key not configured, using mock data');
      return this.getMockYouTubeContent().slice(0, maxResults);
    }

    try {
      const response = await this.axios.get('/search', {
        params: {
          part: 'snippet',
          channelId: channelId,
          maxResults: maxResults,
          order: 'date',
          type: 'video',
          key: YOUTUBE_API_KEY
        }
      });
      
      return response.data.items;
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      // Return mock data as fallback
      return this.getMockYouTubeContent().slice(0, maxResults);
    }
  }

  // Search for news videos by keyword
  async searchNewsVideos(query, maxResults = 20) {
    // If no API key, return mock data immediately
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
      console.warn('YouTube API key not configured, using mock data');
      return this.getMockYouTubeContent().slice(0, maxResults);
    }

    try {
      const response = await this.axios.get('/search', {
        params: {
          part: 'snippet',
          q: `${query} news`,
          maxResults: maxResults,
          order: 'relevance',
          type: 'video',
          publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
          key: YOUTUBE_API_KEY
        }
      });
      
      return response.data.items;
    } catch (error) {
      console.error('Error searching news videos:', error);
      // Return mock data as fallback
      return this.getMockYouTubeContent().slice(0, maxResults);
    }
  }

  // Get trending news videos
  async getTrendingNewsVideos(region = 'US', maxResults = 25) {
    // If no API key, return mock data immediately
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
      console.warn('YouTube API key not configured, using mock data');
      return this.getMockYouTubeContent().slice(0, maxResults);
    }

    try {
      const response = await this.axios.get('/videos', {
        params: {
          part: 'snippet,statistics',
          chart: 'mostPopular',
          regionCode: region,
          videoCategoryId: '25', // News & Politics category
          maxResults: maxResults,
          key: YOUTUBE_API_KEY
        }
      });
      
      return response.data.items;
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      // Return mock data as fallback
      return this.getMockYouTubeContent().slice(0, maxResults);
    }
  }

  // Get news from all major channels
  async getAllNewsChannelsContent(maxPerChannel = 5) {
    // If no API key, return mock data immediately
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
      console.warn('YouTube API key not configured, using mock data');
      return this.getMockYouTubeContent();
    }

    try {
      const channelPromises = Object.entries(NEWS_CHANNELS).map(async ([channelName, channelId]) => {
        const videos = await this.getChannelVideos(channelId, maxPerChannel);
        return videos.map(video => ({
          ...video,
          channelName: channelName
        }));
      });
      
      const allVideos = await Promise.all(channelPromises);
      return allVideos.flat();
    } catch (error) {
      console.error('Error fetching all news channels content:', error);
      // Return mock data as fallback
      return this.getMockYouTubeContent();
    }
  }

  // Get copyright-safe educational/news content
  async getEducationalContent(maxPerChannel = 3) {
    // If no API key, return mock data immediately
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
      console.warn('YouTube API key not configured, using mock educational data');
      return this.getMockEducationalContent();
    }

    try {
      const channelPromises = Object.entries(OFFICIAL_NEWS_PODCASTS).map(async ([channelName, channelId]) => {
        const videos = await this.getChannelVideos(channelId, maxPerChannel);
        return videos.map(video => ({
          ...video,
          channelName: channelName,
          type: 'educational',
          isOfficialChannel: true,
          copyrightSafe: true
        }));
      });
      
      const allVideos = await Promise.all(channelPromises);
      return allVideos.flat();
    } catch (error) {
      console.error('Error fetching educational content:', error);
      // Return mock data as fallback
      return this.getMockEducationalContent();
    }
  }

  // Get video details including duration and view count
  async getVideoDetails(videoIds) {
    try {
      const response = await this.axios.get('/videos', {
        params: {
          part: 'snippet,statistics,contentDetails',
          id: videoIds.join(','),
          key: YOUTUBE_API_KEY
        }
      });
      
      return response.data.items;
    } catch (error) {
      console.error('Error fetching video details:', error);
      return [];
    }
  }

  // Format duration from ISO 8601 to readable format
  formatDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    
    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
  }

  // Format view count
  formatViewCount(viewCount) {
    const count = parseInt(viewCount);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  }

  // Get mock YouTube content (fallback when API is not available)
  getMockYouTubeContent() {
    const currentDate = new Date();
    
    return [
      {
        id: { videoId: 'mock-video-1' },
        snippet: {
          title: 'Breaking: Major Tech Breakthrough Announced',
          description: 'Live coverage of the latest technology announcement that could change the industry.',
          publishedAt: new Date(currentDate.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          thumbnails: {
            medium: { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=320&h=180&fit=crop' }
          }
        },
        channelName: 'CNN',
        type: 'news',
        duration: '15:32',
        viewCount: '1.2M views'
      },
      {
        id: { videoId: 'mock-video-2' },
        snippet: {
          title: 'Global Climate Summit: Key Takeaways',
          description: 'Analysis of the most important decisions made at the international climate conference.',
          publishedAt: new Date(currentDate.getTime() - 4 * 60 * 60 * 1000).toISOString(),
          thumbnails: {
            medium: { url: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=320&h=180&fit=crop' }
          }
        },
        channelName: 'BBC News',
        type: 'news',
        duration: '12:45',
        viewCount: '856K views'
      },
      {
        id: { videoId: 'mock-video-3' },
        snippet: {
          title: 'Market Update: Tech Stocks Surge',
          description: 'Financial markets react positively to new AI developments and tech earnings.',
          publishedAt: new Date(currentDate.getTime() - 6 * 60 * 60 * 1000).toISOString(),
          thumbnails: {
            medium: { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=320&h=180&fit=crop' }
          }
        },
        channelName: 'Bloomberg',
        type: 'news',
        duration: '8:20',
        viewCount: '423K views'
      }
    ];
  }

  // Get mock educational content (copyright-safe)
  getMockEducationalContent() {
    const currentDate = new Date();
    
    return [
      {
        id: { videoId: 'mock-educational-1' },
        snippet: {
          title: 'NASA: Mars Rover Discovers New Evidence of Ancient Water',
          description: 'NASA scientists explain the latest discoveries from the Mars Perseverance rover mission.',
          publishedAt: new Date(currentDate.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          thumbnails: {
            medium: { url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=320&h=180&fit=crop' }
          }
        },
        channelName: 'NASA',
        type: 'educational',
        duration: '15:32',
        viewCount: '1.2M views',
        isOfficialChannel: true,
        copyrightSafe: true
      },
      {
        id: { videoId: 'mock-educational-2' },
        snippet: {
          title: 'TED: How AI Will Transform Healthcare',
          description: 'Leading researchers discuss the future of artificial intelligence in medical diagnosis and treatment.',
          publishedAt: new Date(currentDate.getTime() - 3 * 60 * 60 * 1000).toISOString(),
          thumbnails: {
            medium: { url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=320&h=180&fit=crop' }
          }
        },
        channelName: 'TED',
        type: 'educational',
        duration: '18:45',
        viewCount: '856K views',
        isOfficialChannel: true,
        copyrightSafe: true
      },
      {
        id: { videoId: 'mock-educational-3' },
        snippet: {
          title: 'Khan Academy: Understanding Climate Change Data',
          description: 'Educational explanation of climate science and how to interpret environmental data.',
          publishedAt: new Date(currentDate.getTime() - 5 * 60 * 60 * 1000).toISOString(),
          thumbnails: {
            medium: { url: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=320&h=180&fit=crop' }
          }
        },
        channelName: 'Khan Academy',
        type: 'educational',
        duration: '12:20',
        viewCount: '423K views',
        isOfficialChannel: true,
        copyrightSafe: true
      }
    ];
  }

  // Get content by category
  async getContentByCategory(category, type = 'both') {
    try {
      let searchQuery = '';
      
      switch (category.toLowerCase()) {
        case 'technology':
          searchQuery = 'technology AI artificial intelligence tech';
          break;
        case 'business':
          searchQuery = 'business finance economy market';
          break;
        case 'politics':
          searchQuery = 'politics government election policy';
          break;
        case 'science':
          searchQuery = 'science research discovery space';
          break;
        case 'health':
          searchQuery = 'health medical healthcare medicine';
          break;
        case 'environment':
          searchQuery = 'environment climate change sustainability';
          break;
        case 'sports':
          searchQuery = 'sports championship game match';
          break;
        case 'entertainment':
          searchQuery = 'entertainment movies celebrities hollywood';
          break;
        default:
          searchQuery = 'breaking news latest';
      }
      
      if (type === 'news' || type === 'both') {
        const newsVideos = await this.searchNewsVideos(searchQuery, 10);
        if (type === 'news') return newsVideos;
      }
      
      if (type === 'educational' || type === 'both') {
        const educationalContent = await this.getEducationalContent(10);
        if (type === 'educational') return educationalContent;
      }
      
      // Return both if type is 'both'
      const [newsVideos, educationalContent] = await Promise.all([
        this.searchNewsVideos(searchQuery, 10),
        this.getEducationalContent(10)
      ]);
      
      return [...newsVideos, ...educationalContent];
    } catch (error) {
      console.error('Error fetching content by category:', error);
      return type === 'educational' ? this.getMockEducationalContent() : this.getMockYouTubeContent();
    }
  }
}

// Export singleton instance
const youtubeService = new YouTubeService();
export default youtubeService;
