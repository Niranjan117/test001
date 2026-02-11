import React, { useState, useEffect } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: 'You earned the "Chemical Expert" badge for completing 5 chemical spill scenarios.',
      time: '2 minutes ago',
      read: false,
      icon: '🏆'
    },
    {
      id: 2,
      type: 'training',
      title: 'Training Reminder',
      message: 'Your weekly VR training session is scheduled for today at 3:00 PM.',
      time: '1 hour ago',
      read: false,
      icon: '⏰'
    },
    {
      id: 3,
      type: 'system',
      title: 'System Update',
      message: 'New VR scenarios have been added to your training library.',
      time: '3 hours ago',
      read: true,
      icon: '🔄'
    },
    {
      id: 4,
      type: 'performance',
      title: 'Performance Milestone',
      message: 'Congratulations! You achieved a 95% average score this week.',
      time: '1 day ago',
      read: true,
      icon: '📈'
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed top-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-neutral-200 z-50">
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-800">Notifications</h3>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              Mark all read
            </button>
          )}
        </div>
        {unreadCount > 0 && (
          <p className="text-xs text-neutral-600 mt-1">{unreadCount} unread</p>
        )}
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{notification.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-neutral-800 truncate">
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full ml-2"></div>
                  )}
                </div>
                <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-neutral-500 mt-2">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-neutral-50 text-center">
        <button className="text-xs text-primary-600 hover:text-primary-700">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default Notifications;