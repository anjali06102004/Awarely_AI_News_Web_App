import { useState, useEffect } from 'react';
import { 
  ArrowTrendingUpIcon, 
  ChartBarIcon, 
  FireIcon,
  SparklesIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import aiService from '../services/aiService';

const AITrendPredictor = ({ articles }) => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('24h');

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const predictedTrends = await aiService.predictTrends(articles);
        setTrends(predictedTrends);
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [articles, timeframe]);

  const getGrowthColor = (growth) => {
    const value = parseInt(growth.replace('%', '').replace('+', ''));
    if (value > 40) return 'text-green-600 bg-green-100';
    if (value > 20) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceWidth = (confidence) => {
    return `${confidence * 100}%`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="h-6 w-6 bg-indigo-200 rounded mr-2"></div>
            <div className="h-4 bg-indigo-200 rounded w-32"></div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4">
              <div className="h-3 bg-indigo-200 rounded w-full mb-2"></div>
              <div className="h-2 bg-indigo-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-indigo-100 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-100 rounded-lg mr-3">
            <ArrowTrendingUpIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Trend Predictor</h3>
            <p className="text-sm text-gray-600">Real-time trend analysis</p>
          </div>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex bg-white/50 rounded-lg p-1">
          {['24h', '7d', '30d'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                timeframe === period
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="space-y-4">
        {trends.map((trend, index) => (
          <div key={index} className="bg-white/60 rounded-lg p-4 hover:bg-white/80 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white text-sm font-bold mr-3">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{trend.topic}</h4>
                  <div className="flex items-center mt-1">
                    <FireIcon className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-xs text-gray-500">Trending now</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGrowthColor(trend.growth)}`}>
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  {trend.growth}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(trend.confidence * 100)}% confidence
                </div>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Prediction Confidence</span>
                <span>{Math.round(trend.confidence * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: getConfidenceWidth(trend.confidence) }}
                ></div>
              </div>
            </div>

            {/* Trend Indicators */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <ChartBarIcon className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-gray-600">High Interest</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-3 w-3 text-purple-500 mr-1" />
                  <span className="text-gray-600">AI Verified</span>
                </div>
              </div>
              <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trend Summary */}
      <div className="mt-6 bg-white/60 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Market Sentiment</h4>
            <p className="text-sm text-gray-600">Overall trend direction</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">+42%</div>
            <div className="text-xs text-gray-500">vs last period</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITrendPredictor;
