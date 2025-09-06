import React, { useState, useEffect } from 'react';
import { Search, Edit3, Trash2, Plus, Save, X } from 'lucide-react';
import Header from '../layout/Header';

const API_BASE_URL = 'https://backendd-fundunity.onrender.com/api/v1/content/transaction';

const statusOptions = ['pending', 'berhasil', 'gagal'] as const;
type StatusType = typeof statusOptions[number];


interface Transaction {
  id: number;
  nama: string;
  email: string;
  notes: string;
  amount: number;
  status: StatusType;
}

const Transaction = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    nama: '',
    email: '',
    notes: '',
    amount: 0,
    status: 'pending',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error('Gagal memuat data transaksi');
      const data = await res.json();
      setTransactions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal edit
  const openEditModal = (transaction: Transaction) => {
    setCurrentTransaction({ ...transaction });
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setCurrentTransaction(null);
    setIsEditModalOpen(false);
  };

  // Modal add
  const openAddModal = () => {
    setNewTransaction({
      nama: '',
      email: '',
      notes: '',
      amount: 0,
      status: 'pending',
    });
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Handle input change edit
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!currentTransaction) return;
    const { name, value } = e.target;
    setCurrentTransaction({
      ...currentTransaction,
      [name]: name === 'amount' ? Number(value) : value,
    });
  };

  // Handle input change add
  const handleAddChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: name === 'amount' ? Number(value) : value,
    });
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!currentTransaction) return;

    if (
      !currentTransaction.nama ||
      !currentTransaction.email ||
      !currentTransaction.amount ||
      !currentTransaction.status
    ) {
      alert('Nama, Email, Amount, dan Status harus diisi');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/${currentTransaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTransaction),
      });
      if (!res.ok) throw new Error('Gagal memperbarui transaksi');
      const updated = await res.json();
      setTransactions((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      closeEditModal();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Save add
  const handleSaveAdd = async () => {
    if (
      !newTransaction.nama ||
      !newTransaction.email ||
      !newTransaction.amount ||
      !newTransaction.status
    ) {
      alert('Nama, Email, Amount, dan Status harus diisi');
      return;
    }

    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });
      if (!res.ok) throw new Error('Gagal menambahkan transaksi');
      const created = await res.json();
      setTransactions((prev) => [created, ...prev]);
      closeAddModal();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus transaksi ini?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus transaksi');
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-yellow-50">
      <Header />

      <div className="flex-1 p-8 overflow-auto">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-yellow-700 p-8 rounded-2xl shadow-2xl mb-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-8 translate-y-8"></div>
            <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-white rounded-full animate-pulse delay-300"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Transaction Management</h1>
            <p className="text-xl text-orange-100 leading-relaxed">
              Kelola dan edit daftar transaksi keuangan dengan mudah. Perubahan tersimpan secara real-time.
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-800 to-orange-700 p-6 border-b border-orange-600/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <Plus size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Transaction Management</h2>
                  <p className="text-orange-300 text-sm">Kelola daftar transaksi keuangan</p>
                </div>
              </div>

              <button
                onClick={openAddModal}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/25 hover:scale-105"
              >
                <Plus size={20} />
                <span className="font-semibold">Tambah Transaksi</span>
              </button>
            </div>
          </div>

          {/* Search Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-gray-50/50"
                placeholder="Cari berdasarkan nama, email, notes, atau status..."
              />
            </div>
          </div>

          {/* Loading & Error */}
          {loading && (
            <div className="p-6 text-center text-orange-600 font-semibold">Loading data transaksi...</div>
          )}
          {error && (
            <div className="p-6 text-center text-red-600 font-semibold">Error: {error}</div>
          )}

          {/* Table Section */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Nama</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Notes</th>
                    <th className="py-4 px-6 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-gray-500">
                        Tidak ada data transaksi yang cocok
                      </td>
                    </tr>
                  )}
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-6">{t.id}</td>
                      <td className="py-3 px-6">{t.nama}</td>
                      <td className="py-3 px-6">{t.email}</td>
                      <td className="py-3 px-6">{t.notes}</td>
                      <td className="py-3 px-6 text-right">{t.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                      <td className="py-3 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            t.status === 'berhasil' ? 'bg-green-100 text-green-800' :
                            t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center space-x-2">
                        <button
                          onClick={() => openEditModal(t)}
                          className="text-orange-600 hover:text-orange-800"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && currentTransaction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Edit Transaksi #{currentTransaction.id}</h3>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1" htmlFor="nama">Nama</label>
                <input
                  id="nama"
                  name="nama"
                  type="text"
                  value={currentTransaction.nama}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={currentTransaction.email}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={currentTransaction.notes}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="amount">Amount</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={currentTransaction.amount}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={currentTransaction.status}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700"
              >
                Save
              </button>
            </div>

            <button
              onClick={closeEditModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Tambah Transaksi Baru</h3>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1" htmlFor="add-nama">Nama</label>
                <input
                  id="add-nama"
                  name="nama"
                  type="text"
                  value={newTransaction.nama}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="add-email">Email</label>
                <input
                  id="add-email"
                  name="email"
                  type="email"
                  value={newTransaction.email}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="add-notes">Notes</label>
                <textarea
                  id="add-notes"
                  name="notes"
                  value={newTransaction.notes}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="add-amount">Amount</label>
                <input
                  id="add-amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="add-status">Status</label>
                <select
                  id="add-status"
                  name="status"
                  value={newTransaction.status}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdd}
                className="px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700"
              >
                Save
              </button>
            </div>

            <button
              onClick={closeAddModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction;
