import { SecondLayout } from '@/components/Layouts';
import { BanknoteIcon, ContactIcon } from 'lucide-react';
import React from 'react';

export const SupportMe = () => {
  return (
    <SecondLayout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="card-panel hover-glow p-10 flex flex-col items-center gap-10 min-w-[300px] md:min-w-[400px]">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
              Support <span className="text-[var(--accent-cyan)]">Me</span>
            </h2>
            <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
              If you like my work, consider supporting me!
            </p>
          </div>
          
          <div className="flex w-full max-w-sm flex-col gap-5">
            <a
              href="https://saweria.co/allfitra"
              target="_blank"
              rel="noopener noreferrer"
              className="flex transform items-center justify-center rounded-xl py-4 font-bold text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_25px_rgba(249,115,22,0.5)] group"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              <div className="mx-3 transition-transform duration-300 group-hover:rotate-12" style={{ transform: 'rotate(155deg)' }}>
                <BanknoteIcon className="w-6 h-6" />
              </div>
              Support via Saweria
            </a>
            
            <a
              href="/contact"
              className="flex transform items-center justify-center rounded-xl py-4 font-bold text-white shadow-[0_4px_15px_rgba(0,240,255,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_25px_rgba(0,240,255,0.4)] group"
              style={{ background: 'linear-gradient(135deg, var(--accent-cyan), #0284c7)' }}
            >
              <div className="mx-3 transition-transform duration-300 group-hover:scale-110">
                <ContactIcon className="w-6 h-6" />
              </div>
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </SecondLayout>
  );
};
