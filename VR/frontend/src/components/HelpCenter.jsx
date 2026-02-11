import React, { useState } from 'react';

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const categories = {
    'getting-started': {
      title: '🚀 Getting Started',
      items: [
        {
          question: 'How do I start my first VR training session?',
          answer: 'Navigate to the Training Center tab, enter a session name, select a scenario, and click "Start Training". Make sure your VR hardware is connected.'
        },
        {
          question: 'What VR equipment do I need?',
          answer: 'You need an ESP32 microcontroller with MPU-6050 IMU sensor and 5 flex sensors for hand tracking. The system works with most VR headsets.'
        },
        {
          question: 'How do I calibrate my sensors?',
          answer: 'Go to Settings > VR Hardware and click "Calibrate Sensors". Follow the on-screen instructions to calibrate your motion sensors.'
        }
      ]
    },
    'training': {
      title: '🎯 Training & Scenarios',
      items: [
        {
          question: 'What training scenarios are available?',
          answer: 'We offer Chemical Spill Response, Gas Leak Emergency, Fire Suppression, Emergency Evacuation, Hazmat Containment, and Search & Rescue scenarios.'
        },
        {
          question: 'How is my performance scored?',
          answer: 'Performance is evaluated on 8 metrics: Movement Smoothness, Reaction Time, Hand Stability, Task Completion, Safety Protocol, Decision Making, Spatial Awareness, and Stress Management.'
        },
        {
          question: 'Can I repeat training scenarios?',
          answer: 'Yes! You can repeat any scenario as many times as you want to improve your skills and achieve better scores.'
        }
      ]
    },
    'technical': {
      title: '⚙️ Technical Support',
      items: [
        {
          question: 'My sensors are not connecting. What should I do?',
          answer: 'Check your WiFi connection, ensure the ESP32 is powered on, and verify the correct IP address is configured. Try restarting the hardware.'
        },
        {
          question: 'The performance analysis is not working.',
          answer: 'Ensure you have completed at least one training session with sensor data. The AI analysis requires sufficient data points to generate insights.'
        },
        {
          question: 'How do I export my training data?',
          answer: 'Go to My Progress tab and click "Export Data". You can download your training history and performance metrics as a CSV file.'
        }
      ]
    },
    'account': {
      title: '👤 Account & Settings',
      items: [
        {
          question: 'How do I change my password?',
          answer: 'Currently, password changes are handled by your system administrator. Contact support for password reset requests.'
        },
        {
          question: 'Can I customize my training preferences?',
          answer: 'Yes! Go to Settings to adjust difficulty levels, notification preferences, and other training parameters.'
        },
        {
          question: 'How do I view my achievements?',
          answer: 'Check the Leaderboard tab to see available achievements and your progress towards unlocking them.'
        }
      ]
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-800 mb-2">Help Center</h2>
        <p className="text-neutral-600">Find answers to common questions and get support for your VR training.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Navigation */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <h3 className="font-semibold text-neutral-800 mb-4">Categories</h3>
            <div className="space-y-2">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeCategory === key
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-4 mt-4">
            <h3 className="font-semibold text-neutral-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full btn-secondary text-sm">📧 Contact Support</button>
              <button className="w-full btn-secondary text-sm">📖 User Manual</button>
              <button className="w-full btn-secondary text-sm">🎥 Video Tutorials</button>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="lg:col-span-3">
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-800 mb-6">
              {categories[activeCategory].title}
            </h3>
            
            <div className="space-y-4">
              {categories[activeCategory].items.map((item, index) => (
                <div key={index} className="border border-neutral-200 rounded-lg">
                  <div className="p-4">
                    <h4 className="font-medium text-neutral-800 mb-2">{item.question}</h4>
                    <p className="text-neutral-600 text-sm leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">💬 Still Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Subject</label>
                <input type="text" className="input" placeholder="Brief description of your issue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Priority</label>
                <select className="input">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
              <textarea 
                className="input h-24 resize-none" 
                placeholder="Describe your issue in detail..."
              ></textarea>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="btn-primary">Send Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;