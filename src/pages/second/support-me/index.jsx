import { SecondLayout } from '@/components/Layouts';
import { OnGoing } from '@/utils/components/OnGoing';
import { BanknoteIcon, ContactIcon } from 'lucide-react';
import React from 'react';

export const SupportMe = () => {
  return (
    <SecondLayout>
      <div className="mt-8 flex flex-col items-center gap-10">
        <h2 className="text-4xl font-bold text-[#39afaf]">Support Me</h2>
        <div className="flex w-full max-w-xs flex-col gap-4">
          <a
            href="#"
            // target="_blank"
            rel="noopener noreferrer"
            className="flex transform items-center justify-center rounded-lg bg-orange-500 py-3 font-semibold text-white shadow transition hover:-translate-y-1 hover:scale-105 hover:bg-orange-400"
          >
            <div className="mx-3" style={{ transform: 'rotate(155deg)' }}>
              <BanknoteIcon />
            </div>
            Support in Saweria
          </a>
          <a
            href="/contact"
            className="flex transform items-center justify-center rounded-lg bg-blue-500 py-3 font-semibold text-white shadow transition hover:-translate-y-1 hover:scale-105 hover:bg-blue-400"
          >
            <div className="mx-3">
              <ContactIcon />
            </div>
            Contact Me
          </a>
        </div>
      </div>
    </SecondLayout>
  );
};
