import React, { useState, useEffect } from 'react';
import {
  Search, Edit3, Trash2, Plus,
} from 'lucide-react';
import Header from '../layout/Header';

const API_BASE_URL = 'https://backendd-fundunity.vercel.app/v1/content/aboutus';

type AboutUsItem = {
  id?: number;
  nama: string;
  description: string;
  imageUrl?: string;
  imageFile: File | null;
};

const AboutUs = () => {
  const [tableData, setTableData] = useState<AboutUsItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<AboutUsItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState<AboutUsItem>({
    nama: '',
    description: '',
    imageFile: null,
  });

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
      const data = await res.json();
      setTableData(data);
    } catch (error) {
      console.error('Error fetching AboutUs:', error);
    }
  };

  // Edit modal open
  const handleEditClick = (item: AboutUsItem) => {
    setCurrentItem({
      id: item.id,
      nama: item.nama,
      description: item.description,
      imageUrl: item.imageUrl,
      imageFile: null,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  // Save edited item - FIXED
  const handleSave = async () => {
    if (!currentItem || currentItem.id === undefined) return;
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('nama', currentItem.nama);
      formData.append('description', currentItem.description);
      if (currentItem.imageFile) {
        formData.append('image', currentItem.imageFile);
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/${currentItem.id}`, {
        method: 'PUT',
        headers: headers,
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Update error response:', errorText);
        throw new Error(`Failed to update AboutUs: ${res.status} - ${errorText}`);
      }
      
      console.log('Update successful');
      await fetchAboutUs();
      handleModalClose();
    } catch (error) {
      console.error('Error updating AboutUs:', error);
      alert('Gagal mengupdate data. Silakan coba lagi.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (currentItem) {
      setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentItem) {
      setCurrentItem({ ...currentItem, imageFile: e.target.files[0] });
    }
  };

  // Delete item - FIXED
  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const token = localStorage.getItem('token');
        console.log(`Deleting item with id ${id}...`);
        
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
          headers: headers,
        });
        
        console.log('Delete response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Delete error response:', errorText);
          throw new Error(`Failed to delete AboutUs: ${res.status} - ${errorText}`);
        }
        
        console.log('Delete successful');
        await fetchAboutUs();
      } catch (error) {
        console.error('Error deleting AboutUs:', error);
        alert('Gagal menghapus data. Silakan coba lagi.');
      }
    }
  };

  // Add modal open
  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  // Save new item - FIXED
  const handleAddSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('nama', newItem.nama);
      formData.append('description', newItem.description);
      if (newItem.imageFile) {
        formData.append('image', newItem.imageFile);
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Add error response:', errorText);
        throw new Error(`Failed to add AboutUs: ${res.status} - ${errorText}`);
      }
      
      console.log('Add successful');
      await fetchAboutUs();
      setNewItem({ nama: '', description: '', imageFile: null });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding AboutUs:', error);
      alert('Gagal menambah data. Silakan coba lagi.');
    }
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewItem(prev => ({ ...prev, imageFile: e.target.files![0] }));
    }
  };

  // Filter data safe dari undefined
  const filteredData = tableData.filter(item => {
    const nama = item.nama?.toLowerCase() || '';
    const desc = item.description?.toLowerCase() || '';
    return nama.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200">
      <Header />
      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 p-6 border-b border-emerald-700/40">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center">
                  <Plus size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Tentang Kami</h2>
                  <p className="text-emerald-300 text-sm">Kelola data tentang kami</p>
                </div>
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-2 px-6 py-3 bg-emerald-700 text-white rounded-xl shadow-lg hover:scale-105 transition"
              >
                <Plus size={20} />
                <span>Tambah Data</span>
              </button>
            </div>
          </div>

          <div className="p-6 border-b border-emerald-200">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-emerald-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                placeholder="Cari data..."
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-emerald-100 text-emerald-800">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Nama</th>
                  <th className="py-3 px-6 text-left">Deskripsi</th>
                  <th className="py-3 px-6 text-left">Gambar</th>
                  <th className="py-3 px-6 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Data tidak ditemukan.
                    </td>
                  </tr>
                )}
                {filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-emerald-50 transition">
                    <td className="py-3 px-6">{item.id}</td>
                    <td className="py-3 px-6">{item.nama}</td>
                    <td className="py-3 px-6">{item.description}</td>
                    <td className="py-3 px-6">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.nama}
                          className="w-20 h-12 object-cover rounded"
                        />
                      ) : (
                        <span className="italic text-emerald-400">Tidak ada gambar</span>
                      )}
                    </td>
                    <td className="py-3 px-6 space-x-3">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-emerald-700 hover:text-emerald-900"
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
            <h3 className="text-2xl font-bold text-emerald-700 mb-4">Edit Tentang Kami</h3>

            <label className="block mb-3">
              <span className="text-emerald-700 font-semibold">Nama</span>
              <input
                type="text"
                name="nama"
                value={currentItem.nama}
                onChange={handleChange}
                className="w-full border border-emerald-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>

            <label className="block mb-3">
              <span className="text-emerald-700 font-semibold">Deskripsi</span>
              <textarea
                name="description"
                value={currentItem.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-emerald-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>

            <label className="block mb-4">
              <span className="text-emerald-700 font-semibold">Gambar (ubah jika perlu)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                className="mt-1"
              />
            </label>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleModalClose}
                className="px-5 py-2 rounded-xl border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
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
            <h3 className="text-2xl font-bold text-emerald-700 mb-4">Tambah Tentang Kami</h3>

            <label className="block mb-3">
              <span className="text-emerald-700 font-semibold">Nama</span>
              <input
                type="text"
                name="nama"
                value={newItem.nama}
                onChange={handleNewItemChange}
                className="w-full border border-emerald-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>

            <label className="block mb-3">
              <span className="text-emerald-700 font-semibold">Deskripsi</span>
              <textarea
                name="description"
                value={newItem.description}
                onChange={handleNewItemChange}
                rows={4}
                className="w-full border border-emerald-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>

            <label className="block mb-4">
              <span className="text-emerald-700 font-semibold">Gambar</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleNewImageChange}
                className="mt-1"
              />
            </label>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2 rounded-xl border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              >
                Batal
              </button>
              <button
                onClick={handleAddSave}
                className="px-5 py-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
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

export default AboutUs;