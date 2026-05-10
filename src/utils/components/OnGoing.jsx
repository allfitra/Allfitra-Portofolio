export const OnGoing = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center">

      {/* Animated icon area */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow pulse */}
        <div
          className="absolute w-24 h-24 rounded-full animate-ping opacity-20"
          style={{ background: 'var(--accent-cyan)' }}
        />
        {/* Middle ring */}
        <div
          className="absolute w-20 h-20 rounded-full animate-ping opacity-10"
          style={{ background: 'var(--accent-purple)', animationDelay: '0.3s' }}
        />
        {/* Icon container */}
        <div
          className="relative w-16 h-16 rounded-full flex items-center justify-center border"
          style={{
            background: 'rgba(0,240,255,0.08)',
            borderColor: 'var(--accent-cyan)',
            boxShadow: '0 0 20px rgba(0,240,255,0.2)'
          }}
        >
          <svg
            className="w-8 h-8"
            style={{ color: 'var(--accent-cyan)' }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.654-4.654m5.896-2.9a3.5 3.5 0 0 0-4.95-4.95l-1.5 1.5a3.5 3.5 0 0 0 4.95 4.95l1.5-1.5z" />
          </svg>
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-3">
        <h2
          className="text-2xl md:text-3xl font-black tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Something's <span style={{ color: 'var(--accent-cyan)' }}>cooking</span> 🍳
        </h2>
        <p
          className="text-sm md:text-base max-w-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          Halaman ini masih dalam pengembangan.<br />
          Nantikan sesuatu yang keren!
        </p>
      </div>

      {/* Animated progress dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              background: i % 2 === 0 ? 'var(--accent-cyan)' : 'var(--accent-purple)',
              animationDelay: `${i * 0.15}s`,
              opacity: 0.7
            }}
          />
        ))}
      </div>

    </div>
  );
};
