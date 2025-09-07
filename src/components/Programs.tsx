import React, { useState, useEffect } from 'react';
import { Search, Edit3, Trash2, Plus, BookOpen } from 'lucide-react';
import Header from '../layout/Header';

const API_BASE_URL = 'https://backendd-fundunity.vercel.app/v1/content/program';

type ProgramItem = {
  id?: number;
  title: string;
  description: string;
  imageUrl?: string;
  imageFile: File | null;
};

const Programs = () => {
  const [tableData, setTableData] = useState<ProgramItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ProgramItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState<ProgramItem>({
    title: '',
    description: '',
    imageFile: null,
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setTableData(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleEditClick = (item: any) => {
    setCurrentItem({
      id: item.id,
      title: item.title,
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

  const handleSave = async () => {
    if (!currentItem) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token tidak ditemukan!');
        return;
      }

      const formData = new FormData();
      formData.append('title', currentItem.title);
      formData.append('description', currentItem.description);

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

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update program');
      }

      console.log('Program berhasil diperbarui:', data);
      await fetchPrograms();
      handleModalClose();
    } catch (error) {
      console.error('Error updating program:', error);
    }
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSave = async () => {
    try {
      // Validasi input
      if (!newItem.title || !newItem.description) {
        alert('Judul dan deskripsi wajib diisi!');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token tidak ditemukan!');
        return;
      }

      console.log('Data yang akan dikirim:', {
        title: newItem.title,
        description: newItem.description,
        imageFile: newItem.imageFile ? newItem.imageFile.name : 'No file'
      });

      const formData = new FormData();
      formData.append('title', newItem.title);
      formData.append('description', newItem.description);

      // Cek apakah ada file gambar yang dipilih dan append ke formData
      if (newItem.imageFile) {
        formData.append('image', newItem.imageFile);
        console.log('File gambar ditambahkan:', newItem.imageFile.name);
      }

      // Debug: Log semua data di FormData
      console.log('FormData contents:');
formData.forEach((value, key) => {
  console.log(key, value);
});

      console.log('Mengirim request ke:', API_BASE_URL);
      console.log('Token:', token ? 'Token tersedia' : 'Token tidak ada');

      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);

      const data = await res.json();
      console.log('Response data:', data);

      if (!res.ok) {
        console.error('Server error response:', data);
        throw new Error(data.message || data.error || `Server error: ${res.status}`);
      }

      console.log('Program berhasil ditambahkan:', data);
      await fetchPrograms();
      setNewItem({ title: '', description: '', imageFile: null });
      setIsAddModalOpen(false);
      alert('Program berhasil ditambahkan!');
      
    } catch (error: any) {
      console.error('Error adding program:', error);
      
      // Tampilkan error yang lebih detail
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        alert('Gagal terhubung ke server. Periksa koneksi internet Anda.');
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus program ini?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to delete program');
        await fetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value);
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('File selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      setNewItem((prev) => ({ ...prev, imageFile: file }));
    }
  };

  const filteredData = tableData.filter(
    (item: any) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (index: number) => {
    return BookOpen;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-purple-100">
      <Header />
      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-800 to-purple-900 p-6 border-b border-purple-700/40">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Program Management</h2>
                  <p className="text-purple-300 text-sm">Kelola daftar program komunitas</p>
                </div>
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-700 text-white rounded-xl shadow-lg hover:scale-105 transition"
              >
                <Plus size={20} />
                <span>Tambah Program</span>
              </button>
            </div>
          </div>

          <div className="p-6 border-b border-purple-200">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-purple-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                placeholder="Cari program..."
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-100 text-purple-800">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Judul</th>
                  <th className="py-3 px-6 text-left">Deskripsi</th>
                  <th className="py-3 px-6 text-left">Image</th>
                  <th className="py-3 px-6 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Program tidak ditemukan.
                    </td>
                  </tr>
                )}
                {filteredData.map((item: any, index) => {
                  return (
                    <tr key={item.id} className="hover:bg-purple-50 transition">
                      <td className="py-3 px-6">{item.id}</td>
                      <td className="py-3 px-6 flex items-center space-x-2">
                        <BookOpen size={20} className="text-purple-600" />
                        <span>{item.title}</span>
                      </td>
                      <td className="py-3 px-6">{item.description}</td>
                      <td className="py-3 px-6">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt="Image"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-yellow-500 hover:text-yellow-700"
                        >
                          <Edit3 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700 ml-3"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal untuk Add Program */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">Tambah Program Baru</h3>

            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 mb-2">Judul *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newItem.title}
                onChange={handleNewItemChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Masukkan Judul"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 mb-2">Deskripsi *</label>
              <textarea
                id="description"
                name="description"
                value={newItem.description}
                onChange={handleNewItemChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                placeholder="Masukkan Deskripsi"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-700 mb-2">
                Pilih Gambar 
                <span className="text-sm text-gray-500">(Opsional)</span>
              </label>
              <input
                type="file"
                id="image"
                onChange={handleNewImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                accept="image/*"
              />
              {newItem.imageFile && (
                <p className="text-sm text-green-600 mt-1">
                  File terpilih: {newItem.imageFile.name}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewItem({ title: '', description: '', imageFile: null });
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Batal
              </button>
              <button
                onClick={handleAddSave}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                disabled={!newItem.title || !newItem.description}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal untuk Edit Program */}
      {isModalOpen && currentItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">Edit Program</h3>

            <div className="mb-4">
              <label htmlFor="edit-title" className="block text-gray-700 mb-2">Judul</label>
              <input
                type="text"
                id="edit-title"
                value={currentItem.title}
                onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="edit-description" className="block text-gray-700 mb-2">Deskripsi</label>
              <textarea
                id="edit-description"
                value={currentItem.description}
                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 min-h-[100px]"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="edit-image" className="block text-gray-700 mb-2">Gambar (Opsional)</label>
              <input
                type="file"
                id="edit-image"
                onChange={(e) => setCurrentItem({ ...currentItem, imageFile: e.target.files![0] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                accept="image/*"
              />
              {currentItem.imageUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Gambar saat ini:</p>
                  <img 
                    src={currentItem.imageUrl} 
                    alt="Current" 
                    className="w-20 h-20 object-cover rounded-lg mt-1"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
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

export default Programs;