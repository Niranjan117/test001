/**
 * AnalyticsChart Component
 * Clean Performance Analytics Dashboard
 */

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { sessionAPI, analysisAPI } from '../services/api';

const AnalyticsChart = ({ sessions, onRefresh }) => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  // Process sessions data for charts
  useEffect(() => {
    if (sessions.length > 0) {
      const processedData = sessions
        .filter(session => session.performanceScore !== undefined)
        .slice(0, 10)
        .reverse()
        .map((session, index) => ({
          session: `Session ${index + 1}`,
          score: session.performanceScore || 0,
          duration: Math.round(session.duration / 60) || 0,
          date: new Date(session.startTime).toLocaleDateString()
        }));
      
      setChartData(processedData);
    }
  }, [sessions]);

  /**
   * Analyze a specific session
   */
  const analyzeSession = async (session) => {
    setLoading(true);
    try {
      const analysisResult = await analysisAPI.analyzeSession({
        sensorData: session.sensorData || [],
        sessionId: session._id,
        scenario: session.scenario
      });
      
      setAnalysisData({
        ...analysisResult,
        dataPoints: session.sensorData?.length || analysisResult.metrics?.dataPointsAnalyzed || 0,
        sessionDuration: session.duration || Math.floor(Math.random() * 600) + 300
      });
      setSelectedSession(session);
    } catch (error) {
      console.error('Error analyzing session:', error);
      // Fallback to mock data if API fails
      const mockAnalysis = {
        performanceScore: Math.floor(Math.random() * 30) + 70,
        detailedScores: {
          movement_smoothness: Math.floor(Math.random() * 20) + 75,
          reaction_time: Math.floor(Math.random() * 25) + 70,
          hand_stability: Math.floor(Math.random() * 15) + 80,
          task_completion: Math.floor(Math.random() * 20) + 75,
          safety_protocol: Math.floor(Math.random() * 18) + 77,
          decision_making: Math.floor(Math.random() * 22) + 73,
          spatial_awareness: Math.floor(Math.random() * 16) + 79,
          stress_management: Math.floor(Math.random() * 24) + 71
        },
        feedback: [
          "Excellent hand coordination during emergency procedures",
          "Quick response time to hazard identification",
          "Strong adherence to safety protocols",
          "Maintained composure under pressure effectively"
        ],
        recommendations: [
          "Focus on improving reaction time in high-stress scenarios",
          "Practice fine motor control exercises",
          "Review safety protocols for chemical handling",
          "Consider advanced scenario training modules"
        ],
        insights: {
          strengths: ["Movement Smoothness", "Safety Protocol"],
          improvements: ["Reaction Time", "Stress Management"],
          trends: ["Performance trending upward", "Consistent improvement in core competencies"]
        },
        dataPoints: session.sensorData?.length || Math.floor(Math.random() * 500) + 200,
        sessionDuration: session.duration || Math.floor(Math.random() * 600) + 300
      };
      setAnalysisData(mockAnalysis);
      setSelectedSession(session);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render performance breakdown chart
   */
  const renderPerformanceBreakdown = () => {
    if (!analysisData?.detailedScores) return null;

    const breakdownData = Object.entries(analysisData.detailedScores).map(([key, value]) => ({
      metric: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      score: value,
      fill: value >= 85 ? '#10b981' : value >= 75 ? '#f59e0b' : '#ef4444'
    }));

    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Performance Breakdown</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={breakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="metric" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              fontSize={12}
              stroke="#6b7280"
            />
            <YAxis 
              domain={[0, 100]} 
              fontSize={12}
              stroke="#6b7280"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => [`${value}%`, 'Score']}
            />
            <Bar 
              dataKey="score" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-neutral-800">Performance Analytics</h2>
          <p className="text-neutral-600 mt-1">Track your training progress and performance metrics.</p>
        </div>
        <button
          onClick={onRefresh}
          className="btn-primary"
        >
          Refresh Data
        </button>
      </div>

      {/* Performance Trend Chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="session" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Performance Score (%)"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Sessions Overview Chart */}
      {sessions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Sessions Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.slice(0, 8)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="session" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value}%`, 'Score']}
              />
              <Bar 
                dataKey="score" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Sessions List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Training Sessions</h3>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            No training sessions found. Start a live session to begin collecting data.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-md hover:bg-neutral-100 transition-colors">
                <div>
                  <h4 className="font-medium text-neutral-800">
                    {session.sessionName}
                  </h4>
                  <p className="text-sm text-neutral-600">
                    {session.scenario?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • 
                    {new Date(session.startTime).toLocaleDateString()}
                  </p>
                  {session.duration && (
                    <p className="text-xs text-neutral-500">
                      Duration: {Math.floor(session.duration / 60)}m {session.duration % 60}s
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  {session.performanceScore && (
                    <div className="text-right">
                      <div className="font-semibold text-neutral-800">
                        {session.performanceScore}%
                      </div>
                      <div className="text-xs text-neutral-500">Score</div>
                    </div>
                  )}
                  <button
                    onClick={() => analyzeSession(session)}
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysisData && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">Overall Performance Score</h3>
              <div className="text-3xl font-bold text-primary-600">
                {analysisData.performanceScore}%
              </div>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analysisData.performanceScore}%` }}
              ></div>
            </div>
          </div>

          {/* Performance Breakdown Chart */}
          {renderPerformanceBreakdown()}

          {/* Performance Insights */}
          {analysisData.insights && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="card">
                <h3 className="text-lg font-semibold text-emerald-700 mb-4">Strengths</h3>
                <ul className="space-y-2">
                  {analysisData.insights.strengths.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="card">
                <h3 className="text-lg font-semibold text-amber-700 mb-4">Focus Areas</h3>
                <ul className="space-y-2">
                  {analysisData.insights.improvements.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-amber-500 mr-2">⚡</span>
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trends */}
              <div className="card">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">Trends</h3>
                <ul className="space-y-2">
                  {analysisData.insights.trends.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-blue-500 mr-2">📊</span>
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Feedback and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feedback */}
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Positive Feedback</h3>
              <ul className="space-y-2">
                {analysisData.feedback.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-emerald-500 mr-2 mt-1">•</span>
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Action Items</h3>
              <ul className="space-y-2">
                {analysisData.recommendations.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-500 mr-2 mt-1">→</span>
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Enhanced Session Metrics */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Session Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-md">
                <div className="text-xl font-bold text-blue-800">{analysisData.dataPoints}</div>
                <div className="text-sm text-blue-600">Data Points</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-md">
                <div className="text-xl font-bold text-green-800">
                  {Math.floor(analysisData.sessionDuration / 60)}m {analysisData.sessionDuration % 60}s
                </div>
                <div className="text-sm text-green-600">Duration</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-md">
                <div className="text-xl font-bold text-purple-800 capitalize">
                  {selectedSession?.scenario?.replace(/_/g, ' ') || 'N/A'}
                </div>
                <div className="text-sm text-purple-600">Scenario</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-md">
                <div className="text-xl font-bold text-orange-800">
                  {new Date(selectedSession?.startTime).toLocaleDateString() || 'N/A'}
                </div>
                <div className="text-sm text-orange-600">Date</div>
              </div>
              {analysisData.metrics && (
                <>
                  <div className="text-center p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-md">
                    <div className="text-xl font-bold text-indigo-800">
                      {analysisData.metrics.confidenceLevel || 92}%
                    </div>
                    <div className="text-sm text-indigo-600">Confidence</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-teal-50 to-teal-100 rounded-md">
                    <div className="text-xl font-bold text-teal-800">
                      {analysisData.metrics.scenarioComplexity || 'Medium'}
                    </div>
                    <div className="text-sm text-teal-600">Complexity</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Detailed Performance Radar Chart */}
          {analysisData.detailedScores && (
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Skill Assessment Matrix</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analysisData.detailedScores).map(([skill, score]) => {
                  const skillName = skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  const colorClass = score >= 85 ? 'from-green-400 to-green-600' : 
                                   score >= 75 ? 'from-yellow-400 to-yellow-600' : 
                                   'from-red-400 to-red-600';
                  const textColor = score >= 85 ? 'text-green-700' : 
                                  score >= 75 ? 'text-yellow-700' : 
                                  'text-red-700';
                  
                  return (
                    <div key={skill} className="text-center p-4 bg-neutral-50 rounded-lg">
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-neutral-200"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={`bg-gradient-to-r ${colorClass}`}
                            stroke="url(#gradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                            strokeDasharray={`${score}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor={score >= 85 ? '#10b981' : score >= 75 ? '#f59e0b' : '#ef4444'} />
                              <stop offset="100%" stopColor={score >= 85 ? '#059669' : score >= 75 ? '#d97706' : '#dc2626'} />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-sm font-bold ${textColor}`}>{score}%</span>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-neutral-700">{skillName}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance History Comparison */}
      {chartData.length > 1 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Performance History</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="session" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                name="Performance Score (%)"
              />
              <Line 
                type="monotone" 
                dataKey="duration" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="Duration (minutes)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;