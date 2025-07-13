'use client'
import React, { useState } from 'react';
import { Edit, Mail, X, Save } from 'lucide-react';
import { Avatar } from 'rsuite';
import Link from 'next/link';

interface FormData {
  name: string;
  description: string;
  email: string;
}

interface TempData {
  name: string;
  description: string;
  email: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function AlHudaProfile(): React.JSX.Element {
  const [showEditName, setShowEditName] = useState<boolean>(false);
  const [showEditDesc, setShowEditDesc] = useState<boolean>(false);
  const [showEditEmail, setShowEditEmail] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // State untuk form data
  const [formData, setFormData] = useState<FormData>({
    name: 'Al-Huda',
    description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Amet expedita unde consequuntur, placeat nisi a, obcaecati exercitationem veniam itaque quos numquam, perferendis illo quaerat alias eum suscipit delectus earum debitis.',
    email: 'halo@gmail.com'
  });

  const [tempData, setTempData] = useState<TempData>({
    name: '',
    description: '',
    email: ''
  });

  // Function untuk handle PATCH request
  const handleUpdate = async (field: keyof FormData, value: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value })
      });

      if (response.ok) {
        const updatedData = await response.json();
        setFormData(prev => ({ ...prev, [field]: value }));
        // Close modal
        setShowEditName(false);
        setShowEditDesc(false);
        setShowEditEmail(false);
        console.log('Update successful:', updatedData);
      } else {
        console.error('Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modal Component
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const handleInputChange = (field: keyof TempData, value: string): void => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const openEditModal = (field: keyof FormData): void => {
    setTempData(prev => ({ ...prev, [field]: formData[field] }));
    switch (field) {
      case 'name':
        setShowEditName(true);
        break;
      case 'description':
        setShowEditDesc(true);
        break;
      case 'email':
        setShowEditEmail(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-yellow-600 text-white p-6 text-center relative">
          {/* Profile Picture */}
          <Avatar circle size='lg'/>
          
          {/* Name and Edit Icon */}
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl font-semibold">{formData.name}</h1>
            <button onClick={() => openEditModal('name')}>
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex justify-between text-center">
            <div>
              <p className="text-sm text-gray-600 font-medium">Jumlah Kelas</p>
              <p className="text-2xl font-bold text-gray-800">2</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Jumlah Santri</p>
              <p className="text-2xl font-bold text-gray-800">12</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Akun Dibuat</p>
              <p className="text-2xl font-bold text-gray-800">07/25</p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Deskripsi Bio</h2>
            <button onClick={() => openEditModal('description')}>
              <Edit className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <p className="text-gray-700 text-sm">
            {formData.description}
          </p>
        </div>

        {/* Email Section */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between text-gray-700">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm">Email: {formData.email}</span>
            </div>
            <button onClick={() => openEditModal('email')}>
              <Edit className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-6 pb-6">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* Edit Name Modal */}
      <Modal 
        isOpen={showEditName} 
        onClose={() => setShowEditName(false)}
        title="Edit Nama"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama
            </label>
            <input
              type="text"
              value={tempData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Masukkan nama"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditName(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={() => handleUpdate('name', tempData.name)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Description Modal */}
      <Modal 
        isOpen={showEditDesc} 
        onClose={() => setShowEditDesc(false)}
        title="Edit Deskripsi Bio"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={tempData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Masukkan deskripsi"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditDesc(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={() => handleUpdate('description', tempData.description)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Email Modal */}
      <Modal 
        isOpen={showEditEmail} 
        onClose={() => setShowEditEmail(false)}
        title="Edit Email"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={tempData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Masukkan email"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditEmail(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={() => handleUpdate('email', tempData.email)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}