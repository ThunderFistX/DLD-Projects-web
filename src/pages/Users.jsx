import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const calculateAge = (dob) => {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
};

const Users = () => {
  const { users, setUsers } = useData();
  const [search, setSearch] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (user) => {
    setCurrentUser({ ...user });
    setIsEditOpen(true);
  };

  const handleAdd = () => {
    setCurrentUser({ name: '', email: '', phone: '', dob: '', status: 'Active', profilePic: '' });
    setIsAddOpen(true);
  };

  const handleInputChange = (field, value) => {
    setCurrentUser({ ...currentUser, [field]: value });
  };

  const handleStatusChange = (e) => {
    setCurrentUser({ ...currentUser, status: e.target.value });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === currentUser.id ? currentUser : u));
    setIsEditOpen(false);
    setToast('User updated successfully');
  };

  const saveNewUser = (e) => {
    e.preventDefault();
    const newUser = {
      ...currentUser,
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      joined: new Date().toISOString().slice(0, 10),
    };

    setUsers([newUser, ...users]);
    setIsAddOpen(false);
    setToast('User added successfully');
  };

  const handleRemove = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
    setToast('User removed successfully');
  };

  return (
    <section>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark">Manage Users</h2>
          <p className="text-sm text-gray-500">Add and manage users with profile details and status.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <button onClick={handleAdd} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">Add User</button>
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition">
            <div className="flex items-center gap-4 mb-4">
              {user.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                  {user.name.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="font-bold text-dark">{user.name}</h4>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400">{user.phone}</p>
                <p className="text-xs text-gray-400">Age: {calculateAge(user.dob) || 'N/A'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                user.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {user.status}
              </span>
              <div className="flex gap-3">
                <button onClick={() => handleEdit(user)} className="text-primary font-semibold text-sm hover:underline">Edit</button>
                <button onClick={() => handleRemove(user.id)} className="text-red-500 font-semibold text-sm hover:underline">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New User">
        <form onSubmit={saveNewUser}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={currentUser?.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={currentUser?.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Phone</label>
            <input
              type="text"
              value={currentUser?.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Date of Birth</label>
            <input
              type="date"
              value={currentUser?.dob || ''}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Profile Picture URL</label>
            <input
              type="url"
              value={currentUser?.profilePic || ''}
              onChange={(e) => handleInputChange('profilePic', e.target.value)}
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select
              value={currentUser?.status || 'Active'}
              onChange={handleStatusChange}
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 border-2 rounded-lg">Cancel</button>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">Add User</button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit User">
        <form onSubmit={saveEdit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={currentUser?.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={currentUser?.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Phone</label>
            <input
              type="text"
              value={currentUser?.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Date of Birth</label>
            <input
              type="date"
              value={currentUser?.dob || ''}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Profile Picture URL</label>
            <input
              type="url"
              value={currentUser?.profilePic || ''}
              onChange={(e) => handleInputChange('profilePic', e.target.value)}
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select
              value={currentUser?.status || 'Active'}
              onChange={handleStatusChange}
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 border-2 rounded-lg">Cancel</button>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">Save</button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default Users;