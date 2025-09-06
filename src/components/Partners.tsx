import React, { useState, useEffect } from 'react';
import { Search, Edit3, Trash2, Plus } from 'lucide-react';
import Header from '../layout/Header';

const API_BASE_URL = 'https://backendd-fundunity.vercel.app/v1/content/ourpartner';

type Partner = {
  id?: number;
  name: string;
  imageUrl?: string;
  imageFile: File | null;
};

const Partners = () => {
  const [tableData, setTableData] = useState<Partner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partner | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState<Partner>({
    name: '',
    imageFile: null,
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setTableData(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  // Edit modal open
  const handleEditClick = (item: Partner) => {
    setCurrentItem({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      imageFile: null,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  // Save edited partner
  const handleSave = async () => {
    if (!currentItem) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', currentItem.name);
      if (currentItem.imageFile) {
        formData.append('image', currentItem.imageFile);
      }

      const res = await fetch(`${API_BASE_URL}/${currentItem.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update partner');
      await fetchPartners();
      handleModalClose();
    } catch (error) {
      console.error('Error updating partner:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentItem) {
      setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentItem) {
      setCurrentItem({ ...currentItem, imageFile: e.target.files[0] });
    }
  };

  // Delete partner
  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to delete partner');
        await fetchPartners();
      } catch (error) {
        console.error('Error deleting partner:', error);
      }
    }
  };

  // Add modal open
  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  // Save new partner
  const handleAddSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', newItem.name);
      if (newItem.imageFile) {
        formData.append('image', newItem.imageFile);
      }

      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to add partner');
      await fetchPartners();
      setNewItem({ name: '', imageFile: null });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding partner:', error);
    }
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewItem(prev => ({ ...prev, imageFile: e.target.files![0] }));
    }
  };

  // Filter data berdasarkan search term
  const filteredData = tableData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200">
      <Header />
      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-yellow-400 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 border-b border-yellow-600/40">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl flex items-center justify-center">
                  <Plus size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Mitra Kami</h2>
                  <p className="text-yellow-200 text-sm">Kelola data mitra</p>
                </div>
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-xl shadow-lg hover:scale-105 transition"
              >
                <Plus size={20} />
                <span>Tambah Data</span>
              </button>
            </div>
          </div>

          <div className="p-6 border-b border-yellow-300">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-yellow-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-yellow-300 rounded-xl focus:ring-2 focus:ring-yellow-500"
                placeholder="Cari data mitra..."
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-yellow-100 text-yellow-800">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Nama</th>
                  <th className="py-3 px-6 text-left">Gambar</th>
                  <th className="py-3 px-6 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      Data tidak ditemukan.
                    </td>
                  </tr>
                )}
                {filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-yellow-50 transition">
                    <td className="py-3 px-6">{item.id}</td>
                    <td className="py-3 px-6">{item.name}</td>
                    <td className="py-3 px-6">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-12 object-contain rounded"
                        />
                      ) : (
                        <span className="italic text-yellow-400">Tidak ada gambar</span>
                      )}
                    </td>
                    <td className="py-3 px-6 space-x-3">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-yellow-700 hover:text-yellow-900"
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => item.id && handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <h3 className="text-2xl font-bold text-yellow-700 mb-4">Edit Mitra Kami</h3>

            <label className="block mb-3">
              <span className="text-yellow-700 font-semibold">Nama</span>
              <input
                type="text"
                name="name"
                value={currentItem.name}
                onChange={handleChange}
                className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </label>

            <label className="block mb-4">
              <span className="text-yellow-700 font-semibold">Gambar (ubah jika perlu)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                className="w-full"
              />
              {currentItem.imageUrl && (
                <img
                  src={currentItem.imageUrl}
                  alt="preview"
                  className="mt-2 w-40 h-20 object-contain rounded"
                />
              )}
            </label>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 rounded bg-yellow-300 hover:bg-yellow-400 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <h3 className="text-2xl font-bold text-yellow-700 mb-4">Tambah Mitra Baru</h3>

            <label className="block mb-3">
              <span className="text-yellow-700 font-semibold">Nama</span>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleNewItemChange}
                className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </label>

            <label className="block mb-4">
              <span className="text-yellow-700 font-semibold">Gambar</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleNewImageChange}
                className="w-full"
              />
            </label>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded bg-yellow-300 hover:bg-yellow-400 transition"
              >
                Batal
              </button>
              <button
                onClick={handleAddSave}
                className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 transition"
                disabled={!newItem.name || !newItem.imageFile}
                title={!newItem.name || !newItem.imageFile ? 'Lengkapi data dulu' : ''}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Partners;
