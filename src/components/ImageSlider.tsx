import React, { useState, useEffect } from 'react';
import {
  Search, Edit3, Trash2, Plus, BookOpen, Users, Calendar,
} from 'lucide-react';
import Header from '../layout/Header';

const API_BASE_URL = 'https://backendd-fundunity.vercel.app/v1/content/imageslider';

type ImageSliderItem = {
  id?: number;
  title: string;
  description: string;
  imageUrl?: string;
  imageFile: File | null;
};

const ImageSlider = () => {
  const [tableData, setTableData] = useState<ImageSliderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ImageSliderItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState<ImageSliderItem>({
    title: '',
    description: '',
    imageFile: null,
  });

  useEffect(() => {
    fetchImageSlider();
  }, []);

  const fetchImageSlider = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setTableData(data);
    } catch (error) {
      console.error('Error fetching Image Slider:', error);
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

      if (!res.ok) throw new Error('Failed to update image slider');
      await ImageSlider();
      handleModalClose();
    } catch (error) {
      console.error('Error updating image slider:', error);
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

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus image slider ini?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to delete image');
        await fetchImageSlider();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', newItem.title);
      formData.append('description', newItem.description);
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

      if (!res.ok) throw new Error('Failed to add image');
      await fetchImageSlider();
      setNewItem({ title: '', description: '', imageFile: null });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewItem((prev) => ({ ...prev, imageFile: e.target.files![0] }));
    }
  };

  const filteredData = tableData.filter(
    (item: any) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (index: number) => {
    const icons = [BookOpen, Users, Calendar];
    return icons[index % icons.length];
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50 to-cyan-100">
      <Header />
      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-800 to-cyan-900 p-6 border-b border-cyan-700/40">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-xl flex items-center justify-center">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Image Slider Management</h2>
                  <p className="text-cyan-300 text-sm">Kelola daftar Image Slider</p>
                </div>
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-2 px-6 py-3 bg-cyan-700 text-white rounded-xl shadow-lg hover:scale-105 transition"
              >
                <Plus size={20} />
                <span>Tambah Image</span>
              </button>
            </div>
          </div>

          <div className="p-6 border-b border-cyan-200">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-cyan-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-cyan-300 rounded-xl focus:ring-2 focus:ring-cyan-500"
                placeholder="Cari image..."
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cyan-100 text-cyan-800">
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
                      Image tidak ditemukan.
                    </td>
                  </tr>
                )}
                {filteredData.map((item: any, index) => {
                  const IconComponent = getIcon(index);
                  return (
                    <tr key={item.id} className="hover:bg-cyan-50 transition">
                      <td className="py-3 px-6">{item.id}</td>
                      <td className="py-3 px-6 flex items-center space-x-2">
                        <IconComponent size={20} className="text-cyan-600" />
                        <span>{item.title}</span>
                      </td>
                      <td className="py-3 px-6">{item.description}</td>
                      <td className="py-3 px-6">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-20 h-12 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400 italic">Tidak ada gambar</span>
                        )}
                      </td>
                      <td className="py-3 px-6 space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="px-3 py-1 bg-cyan-100 hover:bg-cyan-200 text-cyan-800 rounded"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
                        >
                          <Trash2 size={16} />
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

      {/* Modal Edit */}
      {isModalOpen && currentItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleModalClose}>
          <div className="bg-white p-6 rounded-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Edit Image</h3>
            <input
              name="title"
              value={currentItem.title}
              onChange={handleChange}
              placeholder="Judul"
              className="w-full mb-4 p-3 border rounded"
            />
            <textarea
              name="description"
              value={currentItem.description}
              onChange={handleChange}
              rows={4}
              placeholder="Deskripsi"
              className="w-full mb-4 p-3 border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleEditImageChange}
              className="w-full mb-4 p-3 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Batal
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsAddModalOpen(false)}>
          <div className="bg-white p-6 rounded-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Tambah Image Baru</h3>
            <input
              name="title"
              value={newItem.title}
              onChange={handleNewItemChange}
              placeholder="Judul"
              className="w-full mb-4 p-3 border rounded"
            />
            <textarea
              name="description"
              value={newItem.description}
              onChange={handleNewItemChange}
              rows={4}
              placeholder="Deskripsi"
              className="w-full mb-4 p-3 border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleNewImageChange}
              className="w-full mb-4 p-3 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Batal
              </button>
              <button onClick={handleAddSave} className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
