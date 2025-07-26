import { useState } from 'react'
import { FireIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const TrendingTopics = () => {
  const [selectedTopic, setSelectedTopic] = useState('AI')

  const trendingTopics = [
    { name: 'AI', mentions: 1250, growth: '+15%', color: '#3B82F6' },
    { name: 'Climate', mentions: 890, growth: '+8%', color: '#10B981' },
    { name: 'Crypto', mentions: 650, growth: '-5%', color: '#F59E0B' },
    { name: 'Space', mentions: 420, growth: '+12%', color: '#8B5CF6' },
    { name: 'Health', mentions: 380, growth: '+3%', color: '#EF4444' }
  ]

  const chartData = [
    { time: '00:00', AI: 120, Climate: 85, Crypto: 65, Space: 40, Health: 35 },
    { time: '04:00', AI: 180, Climate: 120, Crypto: 90, Space: 55, Health: 45 },
    { time: '08:00', AI: 250, Climate: 160, Crypto: 120, Space: 75, Health: 60 },
    { time: '12:00', AI: 320, Climate: 200, Crypto: 150, Space: 95, Health: 80 },
    { time: '16:00', AI: 280, Climate: 180, Crypto: 130, Space: 85, Health: 70 },
    { time: '20:00', AI: 200, Climate: 140, Crypto: 100, Space: 65, Health: 55 }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FireIcon className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Trending Topics</h3>
        </div>
        <ChartBarIcon className="h-5 w-5 text-gray-400" />
      </div>

      {/* Topics List */}
      <div className="space-y-3 mb-6">
        {trendingTopics.map((topic) => (
          <button
            key={topic.name}
            onClick={() => setSelectedTopic(topic.name)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              selectedTopic === topic.name
                ? 'bg-blue-50 border border-blue-200'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: topic.color }}
              />
              <span className="font-medium text-gray-900">{topic.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{topic.mentions.toLocaleString()}</span>
              <span className={`text-xs font-medium ${
                topic.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {topic.growth}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Mentions over time - {selectedTopic}
        </h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#6b7280', fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey={selectedTopic} 
                stroke={trendingTopics.find(t => t.name === selectedTopic)?.color || '#3B82F6'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          💡 <strong>AI Insight:</strong> {selectedTopic} is trending due to recent developments and increased public interest.
        </p>
      </div>
    </div>
  )
}

export default TrendingTopics 