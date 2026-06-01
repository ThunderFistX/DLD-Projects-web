import React, { useState } from 'react';
import { initialProjects } from '../data/dummyData';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const Projects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [toast, setToast] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ title: '', category: '', price: '', difficulty: '' });

  const handleAdd = () => {
    setCurrentProject(null);
    setFormData({ title: '', category: '', price: '', difficulty: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setCurrentProject(project);
    setFormData({ title: project.title, category: project.category, price: project.price, difficulty: project.difficulty });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (project) => {
    setCurrentProject(project);
    setDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setProjects(projects.filter(p => p.id !== currentProject.id));
    setDeleteConfirm(false);
    setToast("Project deleted successfully!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentProject) {
      // Edit
      setProjects(projects.map(p => p.id === currentProject.id ? { ...p, ...formData, price: Number(formData.price) } : p));
      setToast("Project updated successfully!");
    } else {
      // Add
      const newProject = { id: Date.now(), ...formData, price: Number(formData.price), orders: 0 };
      setProjects([...projects, newProject]);
      setToast("Project added successfully!");
    }
    setIsModalOpen(false);
  };

  return (
    <section>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark">Manage Projects</h2>
        <button onClick={handleAdd} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
          <FiPlus /> Add Project
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-500">
              <th className="py-4 px-6">Title</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6">Orders</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-4 px-6 font-semibold text-dark">{project.title}</td>
                <td className="py-4 px-6"><span className="bg-indigo-50 text-primary px-3 py-1 rounded-full text-sm">{project.category}</span></td>
                <td className="py-4 px-6 font-bold">${project.price}</td>
                <td className="py-4 px-6">{project.orders}</td>
                <td className="py-4 px-6 flex gap-3">
                  <button onClick={() => handleEdit(project)} className="text-blue-500 hover:text-blue-700"><FiEdit /></button>
                  <button onClick={() => handleDeleteClick(project)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentProject ? "Edit Project" : "Add New Project"}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Project Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Category</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary" required>
              <option value="">Select Category</option>
              <option value="Combinational Circuits">Combinational Circuits</option>
              <option value="Sequential Circuits">Sequential Circuits</option>
              <option value="Finite State Machines">Finite State Machines</option>
              <option value="Microprocessor Design">Microprocessor Design</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Price ($)</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Difficulty</label>
              <select value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value})} className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-primary" required>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border-2 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">Save</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Modal isOpen={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Confirm Deletion">
        <p className="text-gray-600 mb-6">Are you sure you want to delete <span className="font-bold">{currentProject?.title}</span>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(false)} className="px-4 py-2 border-2 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Delete</button>
        </div>
      </Modal>
    </section>
  );
};

export default Projects;