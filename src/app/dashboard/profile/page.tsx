'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { Edit, Mail, X, Save } from 'lucide-react';
import { Avatar, Message, useToaster } from 'rsuite';
import { useAuthActions, useUserProfile, useAuthLoading } from '@/store/auth_store';
import { useKelasStore, useGetKelas } from '@/store/kelas_store';
import { useAktivitasStore, useGetAktivitas } from '@/store/aktivitas_store';
import { MyTextArea } from '@/components/global_ui/my_text_area';

interface StatsData {
  totalKelas: number;
  totalSantri: number;
  totalAktivitas: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Modal Component - moved outside to prevent re-creation on re-renders
const Modal: React.FC<ModalProps> = React.memo(({ isOpen, onClose, title, children }) => {
  console.log('Modal render:', { isOpen, title });

  if (!isOpen) {
    console.log('Modal not open, returning null');
    return null;
  }

  console.log('Modal is open, rendering:', title);

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
});
Modal.displayName = 'Modal';

export default function AlHudaProfile(): React.JSX.Element {
  const toaster = useToaster();

  // Auth store hooks
  const { getUser, patchUsername, patchDescription, patchEmail, logout } = useAuthActions();
  const userProfile = useUserProfile();
  const isLoading = useAuthLoading();

  // Data stores for stats
  const getKelas = useGetKelas();
  const getAktivitas = useGetAktivitas();

  // Modal states
  const [showEditName, setShowEditName] = useState<boolean>(false);
  const [showEditDesc, setShowEditDesc] = useState<boolean>(false);
  const [showEditEmail, setShowEditEmail] = useState<boolean>(false);

  // Debug modal state changes
  useEffect(() => {
    console.log('Modal states changed:', { showEditName, showEditDesc, showEditEmail });
  }, [showEditName, showEditDesc, showEditEmail]);

  // Focus management for modals
  useEffect(() => {
    if (showEditName && nameInputRef.current) {
      console.log('Focusing name input via useEffect');
      const timeoutId = setTimeout(() => {
        nameInputRef.current?.focus();
        console.log('Name input focused via timeout');
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [showEditName]);

  useEffect(() => {
    if (showEditEmail && emailInputRef.current) {
      console.log('Focusing email input via useEffect');
      const timeoutId = setTimeout(() => {
        emailInputRef.current?.focus();
        console.log('Email input focused via timeout');
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [showEditEmail]);

  // Loading states
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  // Stats state
  const [stats, setStats] = useState<StatsData>({
    totalKelas: 0,
    totalSantri: 0,
    totalAktivitas: 0
  });

  // Simple input states
  const [nameInput, setNameInput] = useState<string>('');
  const [descriptionInput, setDescriptionInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');

  // Refs for focus management
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  // Load user data and all stats on component mount
  useEffect(() => {
    const loadAllData = async () => {
      setStatsLoading(true);
      try {
        // Load user profile
        await getUser();

        // Load kelas data
        await getKelas();

        // Wait for stores to update
        await new Promise(resolve => setTimeout(resolve, 100));

        // Get fresh data from stores
        const freshKelasList = useKelasStore.getState().kelasList;

        // Calculate stats
        let totalSantri = 0;
        let totalAktivitas = 0;

        // Sum up santri from each kelas
        freshKelasList.forEach(kelas => {
          if (kelas.santri_count) {
            totalSantri += kelas.santri_count;
          }
        });

        // Get aktivitas count for each kelas
        for (const kelas of freshKelasList) {
          try {
            await getAktivitas(kelas.slug);
            const aktivitasList = useAktivitasStore.getState().aktivitasList;
            totalAktivitas += aktivitasList.length;
          } catch (error) {
            console.warn(`Failed to get aktivitas for kelas ${kelas.slug}:`, error);
          }
        }

        // Update stats
        setStats({
          totalKelas: freshKelasList.length,
          totalSantri,
          totalAktivitas
        });

      } catch (error) {
        console.error('Failed to load data:', error);
        toaster.push(
          <Message type="error" showIcon closable>
            Gagal memuat data
          </Message>,
          { placement: 'topCenter' }
        );
      } finally {
        setStatsLoading(false);
      }
    };

    loadAllData();
  }, [getAktivitas, getKelas, getUser, toaster]); // Only run once on mount

  // Simple update functions for each field
  const handleUpdateName = async () => {
    if (!nameInput.trim()) return;

    setLocalLoading(true);
    try {
      await patchUsername(nameInput);
      setShowEditName(false);
      setNameInput('');

      toaster.push(
        <Message type="success" showIcon closable>
          Username berhasil diperbarui
        </Message>,
        { placement: 'topCenter' }
      );
    } catch (error) {
      console.error('Error updating name:', error);
      toaster.push(
        <Message type="error" showIcon closable>
          Gagal memperbarui username
        </Message>,
        { placement: 'topCenter' }
      );
    } finally {
      setLocalLoading(false);
    }
  };

  const handleUpdateDescription = async () => {
    setLocalLoading(true);
    try {
      await patchDescription(descriptionInput);
      setShowEditDesc(false);
      setDescriptionInput('');

      toaster.push(
        <Message type="success" showIcon closable>
          Deskripsi berhasil diperbarui
        </Message>,
        { placement: 'topCenter' }
      );
    } catch (error) {
      console.error('Error updating description:', error);
      toaster.push(
        <Message type="error" showIcon closable>
          Gagal memperbarui deskripsi
        </Message>,
        { placement: 'topCenter' }
      );
    } finally {
      setLocalLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!emailInput.trim()) return;

    setLocalLoading(true);
    try {
      await patchEmail(emailInput);
      setShowEditEmail(false);
      setEmailInput('');

      toaster.push(
        <Message type="success" showIcon closable>
          Email berhasil diperbarui
        </Message>,
        { placement: 'topCenter' }
      );
    } catch (error) {
      console.error('Error updating email:', error);
      toaster.push(
        <Message type="error" showIcon closable>
          Gagal memperbarui email
        </Message>,
        { placement: 'topCenter' }
      );
    } finally {
      setLocalLoading(false);
    }
  };

  // Simple modal open/close functions
  const openNameModal = useCallback(() => {
    console.log('Opening name modal');
    console.log('Current username:', userProfile?.user.username);
    setNameInput(userProfile?.user.username || '');
    setShowEditName(true);
    console.log('Name modal state set to true');
  }, [userProfile?.user.username]);

  const openDescModal = useCallback(() => {
    console.log('Opening desc modal');
    console.log('Current description:', userProfile?.description);
    setDescriptionInput(userProfile?.description || '');
    setShowEditDesc(true);
    console.log('Desc modal state set to true');
  }, [userProfile?.description]);

  const openEmailModal = useCallback(() => {
    console.log('Opening email modal');
    console.log('Current email:', userProfile?.user.email);
    setEmailInput(userProfile?.user.email || '');
    setShowEditEmail(true);
    console.log('Email modal state set to true');
  }, [userProfile?.user.email]);

  const closeNameModal = useCallback(() => {
    console.log('Closing name modal');
    setShowEditName(false);
    setNameInput('');
  }, []);

  const closeDescModal = useCallback(() => {
    console.log('Closing desc modal');
    setShowEditDesc(false);
    setDescriptionInput('');
  }, []);

  const closeEmailModal = useCallback(() => {
    console.log('Closing email modal');
    setShowEditEmail(false);
    setEmailInput('');
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toaster.push(
        <Message type="success" showIcon closable>
          Berhasil logout
        </Message>,
        { placement: 'topCenter' }
      );
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#C8B560] text-white p-6 text-center relative">
          {/* Profile Picture */}
          <Avatar circle size='lg' />

          {/* Name and Edit Icon */}
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl font-semibold">{userProfile?.user.username || ''}</h1>
            <button onClick={openNameModal}>
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex justify-between text-center">
            <div>
              <p className="text-sm text-gray-600 font-medium">Jumlah Kelas</p>
              <div className="text-2xl font-bold text-gray-800">
                {statsLoading ? (
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  stats.totalKelas
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Jumlah Santri</p>
              <div className="text-2xl font-bold text-gray-800">
                {statsLoading ? (
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  stats.totalSantri
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Jumlah Aktivitas</p>
              <div className="text-2xl font-bold text-gray-800">
                {statsLoading ? (
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  stats.totalAktivitas
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Deskripsi Bio</h2>
            <button onClick={openDescModal}>
              <Edit className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <p className="text-gray-700 text-sm">
            {userProfile?.description || ''}
          </p>
        </div>

        {/* Email Section */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between text-gray-700">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm">Email: {userProfile?.user.email || ''}</span>
            </div>
            <button onClick={openEmailModal}>
              <Edit className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-6 pb-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Edit Name Modal */}
      <Modal
        isOpen={showEditName}
        onClose={closeNameModal}
        title="Edit Nama"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={nameInput}
              onChange={(e) => {
                console.log('Name input changed:', e.target.value);
                setNameInput(e.target.value);
              }}
              onFocus={() => console.log('Name input focused')}
              onBlur={() => console.log('Name input blurred')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Masukkan nama"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={closeNameModal}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleUpdateName}
              disabled={localLoading || isLoading}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {localLoading || isLoading ? (
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
        onClose={closeDescModal}
        title="Edit Deskripsi Bio"
      >
        <div className="space-y-4">
          <MyTextArea
            title="Deskripsi"
            placeholder="Masukkan deskripsi"
            value={descriptionInput}
            onChange={(event) => {
              console.log('Description changed:', event.target.value);
              setDescriptionInput(event.target.value);
            }}
            rows={4}
          />
          <div className="flex gap-2">
            <button
              onClick={closeDescModal}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleUpdateDescription}
              disabled={localLoading || isLoading}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {localLoading || isLoading ? (
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
        onClose={closeEmailModal}
        title="Edit Email"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              ref={emailInputRef}
              type="email"
              value={emailInput}
              onChange={(e) => {
                console.log('Email input changed:', e.target.value);
                setEmailInput(e.target.value);
              }}
              onFocus={() => console.log('Email input focused')}
              onBlur={() => console.log('Email input blurred')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Masukkan email"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={closeEmailModal}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleUpdateEmail}
              disabled={localLoading || isLoading}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {localLoading || isLoading ? (
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