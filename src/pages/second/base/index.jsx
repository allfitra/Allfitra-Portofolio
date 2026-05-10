import { SecondLayout } from '@/components/Layouts';
import { OnGoing } from '@/utils/components/OnGoing';
import React from 'react';

export const BasePage = () => {
  return (
    <SecondLayout title="Base">
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="card-panel hover-glow p-10 flex flex-col items-center justify-center min-w-[300px] md:min-w-[400px]">
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
            Welcome to <span className="text-[var(--accent-cyan)]">NEW world</span>
          </h2>
          <OnGoing />
        </div>
      </div>
    </SecondLayout>
  );
};
