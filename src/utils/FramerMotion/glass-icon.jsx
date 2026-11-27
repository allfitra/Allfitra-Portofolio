const GlassIcons = ({ items, className }) => {
  return (
    <div
      className={`grid grid-cols-4 md:grid-cols-5 overflow-visible py-[1em] ${
        className || ''
      }`}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => window.open(item.link)}
          type="button"
          aria-label={item.label}
          className={`group relative bg-transparent outline-none [-webkit-tap-highlight-color:transparent] [perspective:24em] [transform-style:preserve-3d] ${
            item.customClass || ''
          }`}
        >
          {/* Back layer (Teal Accent) */}
          <span
            className="absolute left-0 top-0 block h-full w-full origin-[100%_100%] rotate-[8deg] rounded-md opacity-80 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-hover:[transform:rotate(14deg)_translate3d(-0.25em,-0.25em,0.25em)]"
            style={{
              background: 'var(--accent-primary)',
            }}
          ></span>

          {/* Front layer (Neutral Surface) */}
          <span
            className="absolute left-0 top-0 flex h-full w-full origin-[80%_50%] transform rounded-md border transition-[transform,border-color] duration-200 ease-out group-hover:[transform:translateZ(1.25em)]"
            style={{
              background: 'var(--card-bg)',
              borderColor: 'var(--glass-border)',
              color: 'var(--text-primary)',
            }}
          >
            <span
              className="m-auto flex h-[1.5em] w-[1.5em] items-center justify-center transition-colors duration-200 group-hover:text-[var(--accent-primary)]"
              aria-hidden="true"
            >
              {item.icon}
            </span>
          </span>

          {/* Label */}
          <span
            className="absolute left-0 right-0 top-full translate-y-0 whitespace-nowrap text-center text-xs font-medium leading-[2] opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-hover:[transform:translateY(15%)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default GlassIcons;
