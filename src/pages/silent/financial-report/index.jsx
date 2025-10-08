import { SecondLayout } from '@/components/Layouts';
import supabase from '@/utils/Database/supabase';
import { EyeIcon, EyeOffIcon, Rotate3DIcon, Trash, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

const formatCurrency = (amount) => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const FinancialReport = () => {
  const [balanjoData, setBalanjoData] = useState([]);
  const [lockPass, setLockPass] = useState('');
  const [unlocked, setUnlocked] = useState(true);
  const [loading, setLoading] = useState(true);

  const getStartDateDefault = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    date.setDate(25);
    return date.toISOString().split('T')[0];
  };
  const today = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(getStartDateDefault());
  const [endDate, setEndDate] = useState(today);

  const [showAllData, setShowAllData] = useState(false);

  useEffect(() => {
    if (showAllData) {
      setStartDate('');
      setEndDate('');
    } else {
      setStartDate(getStartDateDefault());
      setEndDate(today);
    }
  }, [showAllData]);

  useEffect(() => {
    if (lockPass === '230701') {
      setUnlocked(true);
    }
  }, [lockPass]);

  useEffect(() => {
    getBalanjoData();
  }, []);

  const getBalanjoData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('money_management')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error.message);
    } else {
      setBalanjoData(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Confirm to Delete');
    if (!confirmDelete) return;

    const { error } = await supabase.from('money_management').delete().eq('id', id);

    if (error) {
      console.error('Delete error:', error.message);
    } else {
      setBalanjoData((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const filteredData = useMemo(() => {
    if (!startDate || !endDate) return balanjoData;


    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    return balanjoData.filter((t) => {
      const tDate = new Date(t.created_at);
      tDate.setHours(tDate.getHours() - 7);

      console.log(tDate);

      return tDate >= start && tDate <= end;
    });
  }, [balanjoData, startDate, endDate]);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = filteredData
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.price, 0);
    const expense = filteredData
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.price, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [filteredData]);

  const { allTimeIncome, allTimeExpense, allTimeBalance } = useMemo(() => {
    const income = balanjoData
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.price, 0);
    const expense = balanjoData
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.price, 0);
    return {
      allTimeIncome: income,
      allTimeExpense: expense,
      allTimeBalance: income - expense,
    };
  }, [balanjoData]);

  return (
    <SecondLayout title="Financial Report">
      {!unlocked ? (
        <LockScreen lockPass={lockPass} setLockPass={setLockPass} />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="mt-4 flex justify-center">
            <h1 className="text-3xl font-bold">Balanjo Report</h1>
          </div>

          <div id="date-range-picker" className="flex items-center justify-center gap-3">
            {/* Start Date */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <input
                id="datepicker-range-start"
                name="start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              />
            </div>

            <span className="mx-4 text-gray-500">to</span>

            {/* End Date */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <input
                id="datepicker-range-end"
                name="end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              />

            </div>
            <div className="relative">
              <div className="flex items-center">
                <input
                  id="show-all-checkbox"
                  type="checkbox"
                  checked={showAllData}
                  onChange={(e) => setShowAllData(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600"
                />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-6xl w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-xl dark:bg-gray-800 dark:border-gray-700">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="transform rounded-xl border-l-4 border-green-500 bg-white px-6 py-2 shadow-md transition duration-300 hover:shadow-lg dark:bg-gray-900 cursor-default">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-semibold uppercase tracking-wider text-green-700">Income (Filtered)</h3>
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <p className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalIncome)}</p>
              </div>

              <div className="transform rounded-xl border-l-4 border-red-500 bg-white px-6 py-2 shadow-md transition duration-300 hover:shadow-lg dark:bg-gray-900 cursor-default">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-semibold uppercase tracking-wider text-red-700">Expense (Filtered)</h3>
                  <TrendingDown className="h-6 w-6 text-red-500" />
                </div>
                <p className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalExpense)}</p>
              </div>

              <div className="transform rounded-xl bg-blue-600 px-6 py-2 shadow-2xl transition duration-300 ease-in-out hover:scale-105 cursor-not-allowed">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-md font-semibold uppercase tracking-wider text-blue-100">Balance (Filtered)</h3>
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <p className="mb-2 text-2xl font-extrabold text-white">{formatCurrency(balance)}</p>
              </div>
            </div>

            <div className="mt-3 border-t text-center dark:border-gray-600">
              <div className="mt-2 flex justify-center gap-6 text-gray-600 dark:text-gray-400">
                <span>
                  Total Income: <strong className="text-green-600">{formatCurrency(allTimeIncome)}</strong>
                </span>
                <span>
                  Total Expense: <strong className="text-red-600">{formatCurrency(allTimeExpense)}</strong>
                </span>
                <span>
                  Total Balance: <strong className="text-gray-900 dark:text-white">{formatCurrency(allTimeBalance)}</strong>
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-2xl text-gray-500">Loading data...</p>
          ) : (
            <BalanjoContent
              filteredData={filteredData}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}
    </SecondLayout>
  );
};

const BalanjoContent = ({ filteredData, onDelete }) => {
  return (
    <div className="relative max-h-[69vh] overflow-y-auto overflow-x-auto sm:rounded-lg mb-4">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="sticky top-0 bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                Tidak ada data untuk periode ini
              </td>
            </tr>
          ) : (
            filteredData.map((t) => (
              <tr
                key={t.id}
                className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <td className="px-6 py-4">
                  {new Date(t.created_at).toLocaleDateString('id-ID', {
                    timeZone: 'UTC',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4">{t.desc}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {t.type}
                  </span>
                </td>
                <td className="px-6 py-4">{formatCurrency(t.price)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDelete(t.id)}
                    className="rounded bg-red-500 px-3 py-1 font-semibold text-white hover:bg-red-600"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const LockScreen = ({ lockPass, setLockPass }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-5 bg-black opacity-95">
      <div className="flex gap-1">
        <div className="relative w-full py-1">
          <input
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={lockPass}
            onChange={(e) => setLockPass(e.target.value)}
            className="w-full rounded p-3 pr-10 text-black"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        <button onClick={() => setLockPass('')} className="flex w-16 items-center justify-center rounded-xl p-1">
          <Rotate3DIcon color="green" size={40} />
        </button>
      </div>
    </div>
  );
};