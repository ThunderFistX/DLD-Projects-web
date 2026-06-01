import React, { useState, useEffect } from 'react';
import Toast from '../components/Toast';

const Settings = () => {
  const [notif, setNotif] = useState(true);
  const [toast, setToast] = useState(null);
  const [profile, setProfile] = useState({ name: 'Admin User', email: 'admin@dld.com' });
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // Check local storage for dark mode preference on load
  useEffect(() => {
    const savedMode = localStorage.getItem('dld_dark_mode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dld_dark_mode', newMode);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setToast("Profile saved successfully!");
  };

  return (
    <section>
      {toast && <Snackbar message={toast} onClose={() => setToast(null)} />}
      <h2 className="text-2xl font-bold text-dark mb-6">Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-card">
          <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Full Name</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email Address</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1">Bio</label>
              <textarea className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary" rows="4" placeholder="Tell us about yourself..."></textarea>
            </div>
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition">Save Changes</button>
          </form>
        </div>

        {/* Preferences / Toggles */}
        <div className="bg-white p-6 rounded-xl shadow-card h-fit">
          <h3 className="text-lg font-bold mb-4">Preferences</h3>
          <div className="space-y-6">
            {/* Notification Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-dark">Notifications</h4>
                <p className="text-sm text-gray-500">Receive email alerts</p>
              </div>
              <div className={`relative w-12 h-6 rounded-full cursor-pointer transition ${notif ? 'bg-primary' : 'bg-gray-300'}`} onClick={() => setNotif(!notif)}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition ${notif ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
            
            {/* Dark Mode Toggle - NOW FUNCTIONAL */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-dark">Dark Mode</h4>
                <p className="text-sm text-gray-500">Toggle theme</p>
              </div>
              <div className={`relative w-12 h-6 rounded-full cursor-pointer transition ${darkMode ? 'bg-primary' : 'bg-gray-300'}`} onClick={toggleDarkMode}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;