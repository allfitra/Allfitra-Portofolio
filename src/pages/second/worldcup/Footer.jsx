import React from 'react';
import { Globe, Heart, Instagram, Coins } from 'lucide-react';
import logoWorldCupImg from '../../../assets/images/ImagesWorldCup/logo-world-cup.png';

const Footer = () => {
  return (
    <footer className="w-full mt-20 border-t border-zinc-900 bg-[#07070a]/40 backdrop-blur-md relative overflow-hidden">
      {/* Decorative Blur BG */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-blue-500/5 rounded-full blur-[60px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Branding / Info */}
        <div className="flex items-center gap-3">
          <img src={logoWorldCupImg} alt="World Cup 2026 Logo" className="w-9 h-9 object-contain" />
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">World Cup 2026 Predictor</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">A fan-made interactive prediction platform</p>
          </div>
        </div>

        {/* Disclaimer (Fan Project warning) */}
        <div className="max-w-sm text-center md:text-left">
          <p className="text-[9px] text-zinc-650 leading-relaxed">
            <strong>Disclaimer:</strong> This application is a fan-made project developed for portfolio demonstration purposes. It is not affiliated with, endorsed by, or associated with FIFA or any official football organization. All logos and country flags are trademarks of their respective owners.
          </p>
        </div>

        {/* Links & Developer Credits */}
        <div className="flex flex-col items-center md:items-end gap-3.5">
          <a
            href="https://saweria.co/allfitra"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500 hover:to-orange-650 border border-amber-550/20 hover:border-transparent rounded-xl text-xs font-black text-amber-400 hover:text-zinc-950 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-100 hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <Coins className="w-4 h-4 text-amber-400 group-hover:text-zinc-950 group-hover:animate-bounce transition-colors" />
            <span>Support Developer via Saweria</span>
          </a>

          <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
            <a
              href="https://www.instagram.com/allfitra_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" /> Instagram
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5" /> About me
            </a>
          </div>
          <p className="text-[10px] text-zinc-500 flex items-center gap-1 select-none">
            Created with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> by <span className="text-zinc-300 font-semibold">@Allfitra</span> &copy; 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
