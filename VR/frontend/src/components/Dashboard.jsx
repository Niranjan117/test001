/**
 * Dashboard Component
 * Clean VR Training Platform Dashboard
 */

import React, { useState, useEffect } from 'react';
import LiveSession from './LiveSession';
import AnalyticsChart from './AnalyticsChart';
import { sessionAPI } from '../services/api';
import socketService from '../services/socketService';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('training');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Initialize WebSocket connection and load sessions
  useEffect(() => {
    socketService.connect();
    
    socketService.on('connected', () => setConnectionStatus('connected'));
    socketService.on('disconnected', () => setConnectionStatus('disconnected'));
    socketService.on('error', () => setConnectionStatus('error'));

    loadSessions();

    return () => {
      socketService.disconnect();
    };
  }, []);

  /**
   * Load user sessions from API
   */
  const loadSessions = async () => {
    try {
      const sessionsData = await sessionAPI.getSessions();
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle new session creation
   */
  const handleNewSession = async (sessionData) => {
    try {
      const newSession = await sessionAPI.createSession(sessionData);
      setSessions(prev => [newSession, ...prev]);
      return newSession;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-semibold text-primary-600">Sentinel VR</h1>
              <p className="text-sm text-neutral-600 mt-1">Welcome, {user?.username || 'User'}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-emerald-500' : 
                  connectionStatus === 'disconnected' ? 'bg-amber-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-neutral-600">
                  {connectionStatus === 'connected' ? 'Online' : 
                   connectionStatus === 'disconnected' ? 'Connecting...' : 'Offline'}
                </span>
              </div>
              
              {/* Notifications Bell */}
              <button className="relative p-2 text-neutral-600 hover:text-neutral-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">2</span>
                </div>
              </button>
              
              {/* User Avatar */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-neutral-700">{user?.username}</span>
              </div>
              
              <button
                onClick={onLogout}
                className="btn-secondary"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'training', label: 'Training Center' },
              { id: 'analytics', label: 'Performance Analytics' },
              { id: 'scenarios', label: 'Training Scenarios' },
              { id: 'progress', label: 'My Progress' },
              { id: 'leaderboard', label: 'Leaderboard' },
              { id: 'help', label: 'Help Center' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-800 hover:border-neutral-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'training' && (
              <LiveSession 
                onNewSession={handleNewSession}
                connectionStatus={connectionStatus}
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsChart 
                sessions={sessions}
                onRefresh={loadSessions}
              />
            )}
            {activeTab === 'scenarios' && (
              <TrainingScenarios />
            )}
            {activeTab === 'progress' && (
              <UserProgress sessions={sessions} />
            )}
            {activeTab === 'leaderboard' && (
              <Leaderboard />
            )}
            {activeTab === 'help' && (
              <HelpCenter />
            )}
            {activeTab === 'settings' && (
              <Settings user={user} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

// Training Scenarios Component
const TrainingScenarios = () => {
  const scenarios = [
    {
      id: 'chemical_spill',
      title: 'Chemical Spill Response',
      description: 'Learn proper containment and cleanup procedures for hazardous chemical spills in industrial environments.',
      difficulty: 'Beginner',
      duration: '15-20 min',
      objectives: ['Identify hazard types', 'Secure the area', 'Apply containment procedures', 'Follow safety protocols']
    },
    {
      id: 'gas_leak',
      title: 'Gas Leak Emergency',
      description: 'Practice detection and response protocols for gas leak emergencies in confined spaces.',
      difficulty: 'Intermediate',
      duration: '20-25 min',
      objectives: ['Detect gas presence', 'Evacuate personnel', 'Shut off gas sources', 'Ventilate area safely']
    },
    {
      id: 'fire_suppression',
      title: 'Fire Suppression Protocol',
      description: 'Master fire suppression techniques using various extinguishing agents and equipment.',
      difficulty: 'Advanced',
      duration: '25-30 min',
      objectives: ['Assess fire type', 'Select appropriate agent', 'Execute suppression strategy', 'Prevent re-ignition']
    },
    {
      id: 'evacuation',
      title: 'Emergency Evacuation',
      description: 'Coordinate emergency evacuation procedures and crowd management in crisis situations.',
      difficulty: 'Intermediate',
      duration: '20-25 min',
      objectives: ['Plan evacuation routes', 'Manage crowd flow', 'Account for personnel', 'Coordinate with emergency services']
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-neutral-800 mb-2">Training Scenarios</h2>
        <p className="text-neutral-600">Choose from our comprehensive library of VR training scenarios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">{scenario.title}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                scenario.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                scenario.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {scenario.difficulty}
              </span>
            </div>
            
            <p className="text-neutral-600 text-sm mb-4">{scenario.description}</p>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-neutral-700 mb-2">Learning Objectives:</p>
              <ul className="text-sm text-neutral-600 space-y-1">
                {scenario.objectives.map((objective, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">Duration: {scenario.duration}</span>
              <button className="btn-primary">Start Training</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Leaderboard Component
const Leaderboard = () => {
  const leaderboardData = [
    { rank: 1, name: 'Alex Chen', score: 96, sessions: 45, specialty: 'Chemical Spill Expert' },
    { rank: 2, name: 'Sarah Johnson', score: 94, sessions: 38, specialty: 'Fire Suppression Pro' },
    { rank: 3, name: 'Mike Rodriguez', score: 92, sessions: 42, specialty: 'Evacuation Specialist' },
    { rank: 4, name: 'Emma Wilson', score: 89, sessions: 35, specialty: 'Hazmat Handler' },
    { rank: 5, name: 'David Kim', score: 87, sessions: 29, specialty: 'Safety Coordinator' },
    { rank: 6, name: 'Lisa Zhang', score: 85, sessions: 31, specialty: 'Emergency Response' },
    { rank: 7, name: 'Tom Anderson', score: 83, sessions: 27, specialty: 'Risk Assessment' },
    { rank: 8, name: 'Admin User', score: 82, sessions: 15, specialty: 'System Administrator' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-neutral-800 mb-2">🏅 Global Leaderboard</h2>
        <p className="text-neutral-600">Top performers in VR chemical disaster response training.</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {leaderboardData.slice(0, 3).map((user, index) => (
          <div key={user.rank} className={`text-center p-6 rounded-2xl ${
            index === 0 ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300' :
            index === 1 ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300' :
            'bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300'
          }`}>
            <div className="text-2xl font-bold mb-2">#{user.rank}</div>
            <div className="font-bold text-lg text-neutral-800">{user.name}</div>
            <div className="text-2xl font-bold text-primary-600 my-2">{user.score}%</div>
            <div className="text-sm text-neutral-600">{user.sessions} sessions</div>
            <div className="text-xs text-neutral-500 mt-1">{user.specialty}</div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Complete Rankings</h3>
        <div className="space-y-2">
          {leaderboardData.map((user) => (
            <div key={user.rank} className={`flex items-center justify-between p-4 rounded-lg transition-all hover:bg-neutral-50 ${
              user.name === 'Admin User' ? 'bg-primary-50 border border-primary-200' : 'bg-white'
            }`}>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-neutral-400 w-8">#{user.rank}</div>
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-600">{user.rank}</span>
                </div>
                <div>
                  <div className="font-semibold text-neutral-800">{user.name}</div>
                  <div className="text-sm text-neutral-600">{user.specialty}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary-600">{user.score}%</div>
                <div className="text-sm text-neutral-600">{user.sessions} sessions</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">🏆 Available Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Fire Fighter', desc: 'Complete 10 fire scenarios', color: 'bg-red-100 text-red-700' },
            { name: 'Chemical Expert', desc: 'Master chemical handling', color: 'bg-green-100 text-green-700' },
            { name: 'Speed Demon', desc: 'Complete scenario in <5 min', color: 'bg-yellow-100 text-yellow-700' },
            { name: 'Perfectionist', desc: 'Score 100% in any scenario', color: 'bg-purple-100 text-purple-700' },
            { name: 'Endurance', desc: 'Train for 10+ hours', color: 'bg-blue-100 text-blue-700' },
            { name: 'Strategist', desc: 'Perfect decision making', color: 'bg-indigo-100 text-indigo-700' },
            { name: 'First Responder', desc: 'Complete all scenarios', color: 'bg-orange-100 text-orange-700' },
            { name: 'VR Master', desc: 'Reach top 3 leaderboard', color: 'bg-pink-100 text-pink-700' }
          ].map((achievement, index) => (
            <div key={index} className="text-center p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full ${achievement.color} flex items-center justify-center`}>
                <span className="text-lg font-bold">{achievement.name.charAt(0)}</span>
              </div>
              <div className="font-medium text-sm text-neutral-800">{achievement.name}</div>
              <div className="text-xs text-neutral-600 mt-1">{achievement.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component Imports
import Settings from './Settings';
import HelpCenter from './HelpCenter';

// User Progress Component
const UserProgress = ({ sessions }) => {
  const completedSessions = sessions.filter(s => s.performanceScore);
  const avgScore = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((sum, s) => sum + s.performanceScore, 0) / completedSessions.length)
    : 0;
  const totalHours = Math.round(sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 3600 * 10) / 10;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-neutral-800 mb-2">My Progress</h2>
        <p className="text-neutral-600">Track your VR training progress and achievements.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{sessions.length}</div>
          <div className="text-sm text-neutral-600">Total Sessions</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{avgScore}%</div>
          <div className="text-sm text-neutral-600">Average Score</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{totalHours}h</div>
          <div className="text-sm text-neutral-600">Training Hours</div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Recent Training Sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">No training sessions yet. Start your first session to track progress.</p>
        ) : (
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex justify-between items-center p-3 bg-neutral-50 rounded-md">
                <div>
                  <div className="font-medium text-neutral-800">{session.sessionName}</div>
                  <div className="text-sm text-neutral-600">
                    {session.scenario?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • 
                    {new Date(session.startTime).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-neutral-800">
                    {session.performanceScore ? `${session.performanceScore}%` : 'In Progress'}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {session.duration ? `${Math.floor(session.duration / 60)}m` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;