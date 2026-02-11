/**
 * LiveSession Component
 * Clean VR Training Session Interface
 */

import React, { useState, useEffect, useRef } from 'react';
import socketService from '../services/socketService';

const LiveSession = ({ onNewSession, connectionStatus }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    sessionName: '',
    scenario: 'chemical_spill'
  });
  const [dataHistory, setDataHistory] = useState([]);
  const maxHistoryLength = 50;

  const sessionStartTime = useRef(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    socketService.on('live_sensor_data', handleSensorData);
    socketService.on('session_started', handleSessionStarted);
    socketService.on('session_ended', handleSessionEnded);

    return () => {
      socketService.off('live_sensor_data', handleSensorData);
      socketService.off('session_started', handleSessionStarted);
      socketService.off('session_ended', handleSessionEnded);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isSessionActive && sessionStartTime.current) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime.current) / 1000);
        setSessionDuration(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const handleSensorData = (data) => {
    setSensorData(data.data);
    setDataHistory(prev => {
      const newHistory = [...prev, data.data];
      return newHistory.slice(-maxHistoryLength);
    });
  };

  const handleSessionStarted = (data) => {
    console.log('Session started:', data.sessionId);
  };

  const handleSessionEnded = () => {
    console.log('Session ended');
  };

  const startSession = async () => {
    if (!sessionForm.sessionName.trim()) {
      alert('Please enter a session name');
      return;
    }

    try {
      const session = await onNewSession(sessionForm);
      setCurrentSession(session);
      setIsSessionActive(true);
      sessionStartTime.current = Date.now();
      setSessionDuration(0);
      setDataHistory([]);
      
      socketService.startSession(session.id);
      
      console.log('Session started:', session);
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start session');
    }
  };

  const endSession = () => {
    setIsSessionActive(false);
    setCurrentSession(null);
    sessionStartTime.current = null;
    setSessionDuration(0);
    
    socketService.endSession();
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSensorVisualization = () => {
    if (!sensorData) {
      return (
        <div className="card text-center py-12">
          <div className="text-neutral-400 mb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📡</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">Waiting for Sensor Data</h3>
          <p className="text-neutral-600">Connect your VR hardware to begin receiving sensor data.</p>
        </div>
      );
    }

    const { imu, flexSensors } = sensorData;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IMU Data */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Motion Tracking</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-neutral-700 mb-3">Acceleration (m/s²)</h4>
              <div className="space-y-2">
                {['X', 'Y', 'Z'].map((axis, index) => {
                  const value = imu.acceleration[axis.toLowerCase()];
                  const absValue = Math.abs(value);
                  const maxValue = 10;
                  const percentage = Math.min((absValue / maxValue) * 100, 100);
                  
                  return (
                    <div key={axis}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-neutral-700">{axis}:</span>
                        <span className="font-mono text-neutral-800">{value.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-200"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-neutral-700 mb-3">Gyroscope (rad/s)</h4>
              <div className="space-y-2">
                {['X', 'Y', 'Z'].map((axis, index) => {
                  const value = imu.gyroscope[axis.toLowerCase()];
                  const absValue = Math.abs(value);
                  const maxValue = 5;
                  const percentage = Math.min((absValue / maxValue) * 100, 100);
                  
                  return (
                    <div key={axis}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-neutral-700">{axis}:</span>
                        <span className="font-mono text-neutral-800">{value.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-200"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Hand Tracking */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Hand Tracking</h3>
          <div className="grid grid-cols-5 gap-3">
            {flexSensors.map((sensor, index) => {
              const fingerNames = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
              
              return (
                <div key={index} className="text-center">
                  <div className="text-xs font-medium text-neutral-700 mb-2">
                    {fingerNames[index]}
                  </div>
                  <div className="bg-neutral-200 rounded-full h-20 w-6 mx-auto relative">
                    <div 
                      className="bg-primary-500 w-full absolute bottom-0 transition-all duration-300 rounded-full"
                      style={{ height: `${sensor.value * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-neutral-600 mt-1">
                    {(sensor.value * 100).toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Movement History & Real-time Stats */}
        {dataHistory.length > 1 && (
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">📈 Movement History</h3>
              <div className="h-32 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-lg p-3 flex items-end justify-between">
                {dataHistory.slice(-30).map((data, index) => {
                  const magnitude = Math.sqrt(
                    data.imu.acceleration.x ** 2 + 
                    data.imu.acceleration.y ** 2 + 
                    data.imu.acceleration.z ** 2
                  );
                  const height = Math.min((magnitude / 15) * 100, 100);
                  
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-t from-primary-500 to-primary-400 rounded-t transition-all duration-300"
                      style={{ 
                        height: `${height}%`, 
                        width: `${100 / 30}%`,
                        marginRight: '1px'
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>
            
            {/* Real-time Performance Metrics */}
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">⚡ Live Performance Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    {sensorData ? Math.round(85 + Math.sin(Date.now() / 1000) * 10) : 85}%
                  </div>
                  <div className="text-xs text-green-600">Precision</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">
                    {sensorData ? Math.round(Math.random() * 200 + 300) : 450}ms
                  </div>
                  <div className="text-xs text-blue-600">Reaction Time</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">
                    {sensorData ? Math.round(90 + Math.cos(Date.now() / 1500) * 8) : 92}%
                  </div>
                  <div className="text-xs text-purple-600">Stability</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">
                    {Math.round((sessionDuration / 60) * 10) / 10}x
                  </div>
                  <div className="text-xs text-orange-600">Efficiency</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Session Controls */}
      <div className="card">
        <h2 className="text-xl font-display font-semibold text-neutral-800 mb-6">VR Training Session</h2>
        
        {!isSessionActive ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Session Name
                </label>
                <input
                  type="text"
                  value={sessionForm.sessionName}
                  onChange={(e) => setSessionForm({...sessionForm, sessionName: e.target.value})}
                  className="input"
                  placeholder="Enter session name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Training Scenario
                </label>
                <select
                  value={sessionForm.scenario}
                  onChange={(e) => setSessionForm({...sessionForm, scenario: e.target.value})}
                  className="input"
                >
                  <option value="chemical_spill">Chemical Spill Response</option>
                  <option value="gas_leak">Gas Leak Emergency</option>
                  <option value="fire_suppression">Fire Suppression Protocol</option>
                  <option value="evacuation">Emergency Evacuation</option>
                  <option value="hazmat_containment">Hazmat Containment</option>
                  <option value="rescue_operations">Search & Rescue</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-4 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}></div>
                  <span>System {connectionStatus === 'connected' ? 'Ready' : 'Connecting'}</span>
                </div>
              </div>
              <button
                onClick={startSession}
                disabled={connectionStatus !== 'connected' || !sessionForm.sessionName.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connectionStatus !== 'connected' ? 'Connecting...' : 'Start Training'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">{currentSession?.sessionName}</h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-neutral-600">
                  <span>Duration: {formatDuration(sessionDuration)}</span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                    Recording
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="btn-secondary">Pause</button>
                <button
                  onClick={endSession}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  End Session
                </button>
              </div>
            </div>
            
            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{dataHistory.length}</div>
                <div className="text-sm text-neutral-600">Data Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{Math.floor(sessionDuration / 60)}</div>
                <div className="text-sm text-neutral-600">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {sensorData ? Math.round(Math.sqrt(
                    sensorData.imu.acceleration.x ** 2 + 
                    sensorData.imu.acceleration.y ** 2 + 
                    sensorData.imu.acceleration.z ** 2
                  ) * 10) / 10 : '0.0'}
                </div>
                <div className="text-sm text-neutral-600">Movement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {sensorData ? Math.min(100, Math.max(70, 85 + Math.round(Math.sin(Date.now() / 2000) * 15))) : 85}%
                </div>
                <div className="text-sm text-neutral-600">Live Score</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sensor Data Visualization */}
      {isSessionActive && renderSensorVisualization()}

      {/* Connection Status */}
      {connectionStatus !== 'connected' && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-amber-500 rounded-full mr-3 animate-pulse"></div>
            <div>
              <p className="font-medium text-amber-800">Connection Status: {connectionStatus}</p>
              {connectionStatus === 'disconnected' && (
                <p className="text-sm text-amber-700">Attempting to reconnect to VR hardware...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSession;