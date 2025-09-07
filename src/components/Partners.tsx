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
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState<Partner>({
    name: '',
    imageFile: null,
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching partners from:', API_BASE_URL);
      
      const res = await fetch(API_BASE_URL);
      console.log('Fetch response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Fetched data:', data);
      setTableData(data);
    } catch (err: unknown) {
      console.error('Error fetching partners:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert('Gagal memuat data partner: ' + errorMessage);
    } finally {
      setIsLoading(false);
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
    
    console.log('=== SAVING EDITED PARTNER ===');
    console.log('Current item:', currentItem);

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Token tidak ditemukan, silakan login ulang');
        return;
      }
      
      console.log('Token exists:', !!token);

      const formData = new FormData();
      formData.append('name', currentItem.name);
      
      if (currentItem.imageFile) {
        console.log('Adding image file:', currentItem.imageFile.name);
        formData.append('image', currentItem.imageFile);
      }

      // Debug FormData contents (TypeScript compatible way)
      console.log('FormData contents:');
      const entries = formData as any;
      if (entries.entries) {
        for (const [key, value] of entries.entries()) {
          console.log('FormData:', key, value);
        }
      }

      const url = `${API_BASE_URL}/${currentItem.id}`;
      console.log('PUT request to:', url);

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Update response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Update error response:', errorText);
        throw new Error(`Failed to update partner: ${res.status} - ${errorText}`);
      }

      const result = await res.json();
      console.log('Update success result:', result);
      
      await fetchPartners();
      handleModalClose();
      alert('Partner berhasil diperbarui!');
      
    } catch (err: unknown) {
      console.error('Error updating partner:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert('Error updating partner: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentItem) {
      setCurrentItem({
        ...currentItem,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentItem) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar.');
        return;
      }
      
      setCurrentItem({
        ...currentItem,
        imageFile: file
      });
    }
  };

  // Delete partner
  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    console.log('=== DELETING PARTNER ===');
    console.log('Partner ID:', id);

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Token tidak ditemukan, silakan login ulang');
        return;
      }

      const url = `${API_BASE_URL}/${id}`;
      console.log('DELETE request to:', url);

      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Delete response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Delete error response:', errorText);
        throw new Error(`Failed to delete partner: ${res.status} - ${errorText}`);
      }

      console.log('Delete successful');
      await fetchPartners();
      alert('Partner berhasil dihapus!');
      
    } catch (err: unknown) {
      console.error('Error deleting partner:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert('Error deleting partner: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add modal open
  const handleAddNew = () => {
    setNewItem({
      name: '',
      imageFile: null,
    });
    setIsAddModalOpen(true);
  };

  // Save new partner
  const handleAddSave = async () => {
    console.log('=== ADDING NEW PARTNER ===');
    console.log('New item:', newItem);

    if (!newItem.name.trim()) {
      alert('Nama partner harus diisi');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Token tidak ditemukan, silakan login ulang');
        return;
      }
      
      console.log('Token exists:', !!token);

      const formData = new FormData();
      formData.append('name', newItem.name.trim());
      
      if (newItem.imageFile) {
        console.log('Adding image file:', newItem.imageFile.name);
        formData.append('image', newItem.imageFile);
      }

      // Debug FormData contents (TypeScript compatible way)
      console.log('FormData contents:');
      const entries = formData as any;
      if (entries.entries) {
        for (const [key, value] of entries.entries()) {
          console.log('FormData:', key, value);
        }
      }

      console.log('POST request to:', API_BASE_URL);

      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Add response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Add error response:', errorText);
        throw new Error(`Failed to add partner: ${res.status} - ${errorText}`);
      }

      const result = await res.json();
      console.log('Add success result:', result);

      await fetchPartners();
      setNewItem({ name: '', imageFile: null });
      setIsAddModalOpen(false);
      alert('Partner berhasil ditambahkan!');
      
    } catch (err: unknown) {
      console.error('Error adding partner:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert('Error adding partner: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar.');
        return;
      }
      
      setNewItem(prev => ({
        ...prev,
        imageFile: file
      }));
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
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-xl shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
                <span>{isLoading ? 'Loading...' : 'Tambah Data'}</span>
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
                className="w-full pl-10 pr-4 py-3 border border-yellow-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                placeholder="Cari data mitra..."
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                <p className="mt-2 text-gray-600">Memuat data...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-yellow-100 text-yellow-800">
                    <th className="py-3 px-6 text-left font-semibold">ID</th>
                    <th className="py-3 px-6 text-left font-semibold">Nama</th>
                    <th className="py-3 px-6 text-left font-semibold">Gambar</th>
                    <th className="py-3 px-6 text-left font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">
                        {tableData.length === 0 ? 'Belum ada data partner.' : 'Data tidak ditemukan.'}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map(item => (
                      <tr key={item.id} className="hover:bg-yellow-50 transition border-b border-yellow-100">
                        <td className="py-3 px-6 text-gray-700">{item.id}</td>
                        <td className="py-3 px-6 text-gray-700 font-medium">{item.name}</td>
                        <td className="py-3 px-6">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-20 h-12 object-contain rounded border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.png';
                                e.currentTarget.alt = 'Image not found';
                              }}
                            />
                          ) : (
                            <span className="italic text-gray-400 text-sm">Tidak ada gambar</span>
                          )}
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleEditClick(item)}
                              disabled={isLoading}
                              className="text-yellow-600 hover:text-yellow-800 transition disabled:opacity-50"
                              title="Edit"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => item.id && handleDelete(item.id)}
                              disabled={isLoading || !item.id}
                              className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                              title="Hapus"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-yellow-700 mb-6">Edit Mitra Kami</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-yellow-700 font-semibold mb-2">
                    Nama *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentItem.name}
                    onChange={handleChange}
                    className="w-full border border-yellow-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Masukkan nama partner"
                  />
                </div>

                <div>
                  <label className="block text-yellow-700 font-semibold mb-2">
                    Gambar (ubah jika perlu)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="w-full border border-yellow-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Maksimal 5MB, format: JPG, PNG, GIF</p>
                  
                  {currentItem.imageUrl && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Gambar saat ini:</p>
                      <img
                        src={currentItem.imageUrl}
                        alt="Current preview"
                        className="w-40 h-24 object-contain rounded border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleModalClose}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading || !currentItem.name.trim()}
                  className="px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-yellow-700 mb-6">Tambah Mitra Baru</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-yellow-700 font-semibold mb-2">
                    Nama *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newItem.name}
                    onChange={handleNewItemChange}
                    className="w-full border border-yellow-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Masukkan nama partner"
                  />
                </div>

                <div>
                  <label className="block text-yellow-700 font-semibold mb-2">
                    Gambar (TEMPORARILY DISABLED FOR TESTING)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewImageChange}
                    className="w-full border border-yellow-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    disabled={true}
                  />
                  <p className="text-sm text-red-500 mt-1">Image upload disabled for testing - only testing with name</p>
                  
                  {newItem.imageFile && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <img
                        src={URL.createObjectURL(newItem.imageFile)}
                        alt="Preview"
                        className="w-40 h-24 object-contain rounded border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddSave}
                  disabled={isLoading || !newItem.name.trim()}
                  className="px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!newItem.name.trim() ? 'Nama partner harus diisi' : ''}
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Partners;