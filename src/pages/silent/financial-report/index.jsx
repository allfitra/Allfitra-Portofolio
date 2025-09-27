import { SecondLayout } from '@/components/Layouts';
import supabase from '@/utils/Database/supabase';
import { EyeIcon, EyeOffIcon, Rotate3DIcon, Trash } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

export const FinancialReport = () => {
  const [balanjoData, setBalanjoData] = useState([]);
  const [lockPass, setLockPass] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  // State untuk filter tanggal
  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
  const firstDay = new Date();
  firstDay.setDate(1);
  const firstDayStr = firstDay.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDayStr);
  const [endDate, setEndDate] = useState(addDays(today, 1));

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

  return (
    <SecondLayout title="Financial Report">
      {!unlocked ? (
        <LockScreen lockPass={lockPass} setLockPass={setLockPass} />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="mt-10 flex justify-center">
            <h1 className="text-3xl font-bold">Balanjo Report</h1>
          </div>

          <div id="date-range-picker" className="flex items-center justify-center gap-3">
            {/* Start Date */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                <svg
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
                <svg
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
          </div>

          {loading ? (
            <p className="text-center text-2xl text-gray-500">Loading data...</p>
          ) : (
            <BalanjoContent
              balanjoData={balanjoData}
              startDate={startDate}
              endDate={endDate}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}
    </SecondLayout>
  );
};

const BalanjoContent = ({ balanjoData, startDate, endDate, onDelete }) => {
  const filteredData = useMemo(() => {
    return balanjoData.filter((t) => {
      const tDate = new Date(t.created_at);
      const afterStart = startDate ? tDate >= new Date(startDate) : true;
      const beforeEnd = endDate ? tDate <= new Date(endDate + 'T23:59:59') : true;
      return afterStart && beforeEnd;
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

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Action</th>
            {/* <th className="px-6 py-3">Source</th> */}
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                Tidak ada data untuk periode ini
              </td>
            </tr>
          ) : (
            filteredData.map((t) => (
              <tr key={t.id} className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                <td className="px-6 py-4">
                  {new Date(t.created_at).toLocaleDateString('id-ID', { timeZone: 'UTC' })}
                </td>
                <td className="px-6 py-4">{t.desc}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      t.type === 'income'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {t.type}
                  </span>
                </td>
                <td className="px-6 py-4">Rp {t.price.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDelete(t.id)}
                    className="rounded bg-red-500 px-3 py-1 font-semibold text-white hover:bg-red-600"
                  >
                    <Trash />
                  </button>
                </td>
                {/* <td className="px-6 py-4">{t.source}</td> */}
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr className="font-semibold text-gray-900 dark:text-white">
            <th className="px-6 py-3 text-base">Total Income</th>
            <td colSpan={3} className="px-6 py-3 text-green-600">
              Rp {totalIncome.toLocaleString('id-ID')}
            </td>
          </tr>
          <tr className="font-semibold text-gray-900 dark:text-white">
            <th className="px-6 py-3 text-base">Total Expense</th>
            <td colSpan={3} className="px-6 py-3 text-red-600">
              Rp {totalExpense.toLocaleString('id-ID')}
            </td>
          </tr>
          <tr className="font-bold text-gray-900 dark:text-white">
            <th className="px-6 py-3 text-base">Balance</th>
            <td colSpan={3} className="px-6 py-3">
              Rp {balance.toLocaleString('id-ID')}
            </td>
          </tr>
        </tfoot>
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
        <button
          onClick={() => setLockPass('')}
          className="flex w-16 items-center justify-center rounded-xl p-1"
        >
          <Rotate3DIcon color="green" size={40} />
        </button>
      </div>
    </div>
  );
};

function addDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0]; // format YYYY-MM-DD
}
