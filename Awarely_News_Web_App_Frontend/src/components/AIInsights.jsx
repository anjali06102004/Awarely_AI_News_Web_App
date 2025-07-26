import { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  ChartBarIcon, 
  LightBulbIcon,
  TagIcon,
  ClockIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import aiService from '../services/aiService';

const AIInsights = ({ article }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sentiment');

  useEffect(() => {
    const generateInsights = async () => {
      if (!article) return;
      
      try {
        setLoading(true);
        const aiInsights = await aiService.generateInsights(article);
        setInsights(aiInsights);
      } catch (error) {
        console.error('Error generating AI insights:', error);
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, [article]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <SparklesIcon className="h-6 w-6 text-purple-500 mr-2" />
            <div className="h-4 bg-purple-200 rounded w-32"></div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-purple-200 rounded w-full"></div>
            <div className="h-3 bg-purple-200 rounded w-3/4"></div>
            <div className="h-3 bg-purple-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEmotionIntensity = (value) => {
    return Math.round(value * 100);
  };

  const tabs = [
    { id: 'sentiment', name: 'Sentiment', icon: ChartBarIcon },
    { id: 'keywords', name: 'Keywords', icon: TagIcon },
    { id: 'topics', name: 'Topics', icon: LightBulbIcon }
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-xl p-6 border border-purple-100 shadow-lg backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg mr-3">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            <p className="text-sm text-gray-600">Powered by advanced analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ClockIcon className="h-4 w-4" />
          <span>{insights.readingTime}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white/50 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'sentiment' && (
          <div className="space-y-4">
            {/* Sentiment Score */}
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Overall Sentiment</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(insights.sentiment)}`}>
                  {insights.sentiment.charAt(0).toUpperCase() + insights.sentiment.slice(1)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    insights.sentiment === 'positive' ? 'bg-green-500' : 
                    insights.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                  }`}
                  style={{ width: `${insights.confidence * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Confidence: {Math.round(insights.confidence * 100)}%
              </p>
            </div>

            {/* Emotion Analysis */}
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Emotional Breakdown</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(insights.emotions).map(([emotion, value]) => (
                  <div key={emotion} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 capitalize">{emotion}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1">
                        <div 
                          className="h-1 bg-purple-500 rounded-full transition-all duration-1000"
                          style={{ width: `${getEmotionIntensity(value)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-8">
                        {getEmotionIntensity(value)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complexity */}
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Reading Complexity</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  insights.complexity === 'Simple' ? 'bg-green-100 text-green-600' :
                  insights.complexity === 'Moderate' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {insights.complexity}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Key Terms</h4>
            <div className="flex flex-wrap gap-2">
              {insights.keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors duration-200"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="space-y-3">
            {insights.topics.map((topic, index) => (
              <div key={index} className="bg-white/60 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{topic.topic}</span>
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600 font-medium">
                      {topic.relevance} matches
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(topic.relevance / Math.max(...insights.topics.map(t => t.relevance))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Summary */}
      <div className="mt-6 bg-white/60 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <LightBulbIcon className="h-4 w-4 mr-2 text-yellow-500" />
          AI Summary
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {insights.aiSummary}
        </p>
      </div>
    </div>
  );
};

export default AIInsights;
