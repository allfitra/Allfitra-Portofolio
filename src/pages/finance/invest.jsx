import { SecondLayout } from '@/components/Layouts';
import { 
  TrendingUp, 
  Wallet, 
  PlusCircle, 
  History, 
  Coins, 
  BarChart3, 
  ArrowUpRight,
  Save,
  Trash2,
  PieChart
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

// Utility for currency formatting
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const InvestPage = () => {
  // Platforms definition
  const platforms = [
    { id: 'peluang', name: 'Peluang', icon: <Coins className="text-blue-500" />, color: 'blue' },
    { id: 'bibit', name: 'Bibit', icon: <TrendingUp className="text-green-500" />, color: 'green' },
    { id: 'indodax', name: 'Indodax', icon: <BarChart3 className="text-orange-500" />, color: 'orange' },
    { id: 'tringEmas', name: 'Tring Emas', icon: <Wallet className="text-yellow-600" />, color: 'yellow' },
  ];

  // State for current month's inputs
  const [deposits, setDeposits] = useState({
    peluang: '',
    bibit: '',
    indodax: '',
    tringEmas: '',
  });

  // Mocked historical data (In real scenario, fetch this from Firebase)
  const [history, setHistory] = useState([
    {
      id: 1,
      month: 'April 2026',
      data: { peluang: 500000, bibit: 1000000, indodax: 200000, tringEmas: 300000 },
      total: 2000000,
    },
    {
      id: 2,
      month: 'March 2026',
      data: { peluang: 500000, bibit: 500000, indodax: 100000, tringEmas: 300000 },
      total: 1400000,
    },
  ]);

  // Calculate accumulated totals per platform
  const platformTotals = useMemo(() => {
    const totals = { peluang: 0, bibit: 0, indodax: 0, tringEmas: 0 };
    history.forEach((entry) => {
      Object.keys(entry.data).forEach((key) => {
        totals[key] += entry.data[key];
      });
    });
    return totals;
  }, [history]);

  // Total Portfolio Value
  const totalPortfolio = useMemo(() => {
    return Object.values(platformTotals).reduce((sum, val) => sum + val, 0);
  }, [platformTotals]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setDeposits((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      month: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      data: {
        peluang: Number(deposits.peluang) || 0,
        bibit: Number(deposits.bibit) || 0,
        indodax: Number(deposits.indodax) || 0,
        tringEmas: Number(deposits.tringEmas) || 0,
      },
      total: Object.values(deposits).reduce((sum, val) => sum + (Number(val) || 0), 0),
    };

    setHistory([newEntry, ...history]);
    setDeposits({ peluang: '', bibit: '', indodax: '', tringEmas: '' });
    
    // Notification logic can be added here
    alert('Data investasi bulan ini berhasil disimpan!');
  };

  return (
    <SecondLayout title="Investment Tracker">
      <div className="flex flex-col gap-8 pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <PieChart className="text-indigo-500" /> Investment Tracker
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Pantau pertumbuhan aset setiap bulannya.</p>
          </div>
          <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg flex items-center gap-4 min-w-[240px]">
            <div className="p-2 bg-white/20 rounded-full">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Portfolio</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPortfolio)}</p>
            </div>
          </div>
        </div>

        {/* Platform Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((platform) => (
            <div 
              key={platform.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-${platform.color}-50 dark:bg-${platform.color}-900/20`}>
                  {platform.icon}
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{platform.name}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Akumulasi</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(platformTotals[platform.id])}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <PlusCircle size={20} className="text-indigo-500" /> Setoran Bulan Ini
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              {platforms.map((platform) => (
                <div key={platform.id} className="space-y-1">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-1">
                    {platform.name}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                    <input
                      type="text"
                      name={platform.id}
                      value={deposits[platform.id]}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
              ))}
              <button
                type="submit"
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Save size={18} /> Simpan Setoran
              </button>
            </form>
          </div>

          {/* History Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History size={20} className="text-indigo-500" /> Riwayat Investasi
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="pb-4 font-semibold text-gray-600 dark:text-gray-400">Bulan</th>
                    <th className="pb-4 font-semibold text-gray-600 dark:text-gray-400 text-right">Total Setoran</th>
                    <th className="pb-4 font-semibold text-gray-600 dark:text-gray-400 text-center">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {history.map((item) => (
                    <tr key={item.id} className="group hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="py-4 font-medium text-gray-900 dark:text-white">{item.month}</td>
                      <td className="py-4 text-right font-bold text-gray-900 dark:text-white">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center gap-3">
                           {/* Simple dots visualization of distribution */}
                           <div className="flex gap-1">
                             {Object.entries(item.data).map(([key, val]) => (
                               val > 0 && (
                                 <div 
                                   key={key} 
                                   title={`${key}: ${formatCurrency(val)}`}
                                   className={`w-2 h-2 rounded-full ${
                                     key === 'peluang' ? 'bg-blue-500' : 
                                     key === 'bibit' ? 'bg-green-500' : 
                                     key === 'indodax' ? 'bg-orange-500' : 'bg-yellow-600'
                                   }`}
                                 />
                               )
                             ))}
                           </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="3" className="py-10 text-center text-gray-400 italic">
                        Belum ada data riwayat.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SecondLayout>
  );
};

export default InvestPage;
