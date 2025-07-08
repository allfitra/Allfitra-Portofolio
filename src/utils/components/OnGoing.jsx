export const OnGoing = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <svg
          className="h-16 w-16 animate-spin text-emerald-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="8"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M12 2a10 10 0 00-3.516.648l1.243 3.32A6 6 0 0118 12h4a10 10 0 00-10-10z"
          />
        </svg>
        <h1 className="mt-10 text-xl font-bold text-[#39afaf] md:text-2xl">
          Sedang dalam pengembangan
        </h1>
        <p className="mt-2 text-lg text-[#39afaf]">
          Mohon maaf, halaman ini masih dalam pengembangan.
        </p>
        <p className="mt-5 text-lg text-[#39afaf]">Silakan kunjungi kembali nanti. 😊</p>
      </div>
    </div>
  );
};
