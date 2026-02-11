import React, { useState } from 'react';

const Settings = ({ user }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    difficulty: 'intermediate',
    language: 'en',
    theme: 'light'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-800 mb-2">Settings</h2>
        <p className="text-neutral-600">Customize your VR training experience.</p>
      </div>

      {/* Profile Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Profile Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Username</label>
            <input type="text" value={user?.username || ''} className="input" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input type="email" value={user?.email || ''} className="input" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
            <input type="text" value={user?.role || 'trainee'} className="input" disabled />
          </div>
        </div>
      </div>

      {/* Training Preferences */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Training Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Default Difficulty</label>
            <select 
              value={settings.difficulty} 
              onChange={(e) => handleSettingChange('difficulty', e.target.value)}
              className="input"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-neutral-700">Auto-save Progress</div>
              <div className="text-sm text-neutral-600">Automatically save training progress</div>
            </div>
            <button
              onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoSave ? 'bg-primary-600' : 'bg-neutral-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.autoSave ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">System Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-neutral-700">Push Notifications</div>
              <div className="text-sm text-neutral-600">Receive training reminders and updates</div>
            </div>
            <button
              onClick={() => handleSettingChange('notifications', !settings.notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications ? 'bg-primary-600' : 'bg-neutral-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.notifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Language</label>
            <select 
              value={settings.language} 
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="input"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>

      {/* VR Hardware Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">VR Hardware</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">Connected</div>
              <div className="text-sm text-neutral-600">ESP32 Controller</div>
            </div>
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-neutral-600">Flex Sensors</div>
            </div>
          </div>
          <button className="btn-secondary w-full">Calibrate Sensors</button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary">Save Settings</button>
      </div>
    </div>
  );
};

export default Settings;