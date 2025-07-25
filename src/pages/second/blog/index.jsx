import { SecondLayout } from '@/components/Layouts';
import { OnGoing } from '@/utils/components/OnGoing';
import React from 'react';

export const BlogPage = () => {
  return (
    <SecondLayout title="Blogs">
      <OnGoing />
    </SecondLayout>
  );
};
