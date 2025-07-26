import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TrendingChart = ({ articles = [] }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!articles || articles.length === 0) {
      setChartData([
        { name: 'Technology', count: 5 },
        { name: 'Business', count: 3 },
        { name: 'Politics', count: 2 },
        { name: 'Sports', count: 4 }
      ]);
      setIsLoading(false);
      return;
    }

    // Count number of articles per category
    const categoryCounts = articles
      .filter(article => article && (article.sentiment === 'positive' || !article.sentiment))
      .reduce((acc, article) => {
        const category = article.category || article.source?.name || 'General';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

    // Convert to chart data format
    const data = Object.keys(categoryCounts)
      .map((category) => ({
        name: category.length > 12 ? category.substring(0, 12) + '...' : category,
        count: categoryCounts[category],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Limit to top 8 categories

    setChartData(data);
    setIsLoading(false);
  }, [articles]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 className="text-md font-bold mb-4 text-gray-900 dark:text-white">Trending Topics</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 className="text-md font-bold mb-4 text-gray-900 dark:text-white">Trending Topics</h3>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <p>No trending data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h3 className="text-md font-bold mb-4 text-gray-900 dark:text-white">Trending Topics</h3>
      <div className="w-full" style={{ height: '280px', minHeight: '280px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={250}>
          <BarChart 
            data={chartData} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              type="number" 
              tickFormatter={(value) => value.toString()}
              className="text-xs"
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={80}
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value, name) => [value, 'Articles']}
            />
            <Bar 
              dataKey="count" 
              fill="#3b82f6" 
              radius={[0, 4, 4, 0]}
              minPointSize={2}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendingChart;
