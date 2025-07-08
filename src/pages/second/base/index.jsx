import { SecondLayout } from '@/components/Layouts';
import { OnGoing } from '@/utils/components/OnGoing';
import React from 'react';

export const BasePage = () => {
  return (
    <SecondLayout title="Base">
      <OnGoing />
    </SecondLayout>
  );
};
