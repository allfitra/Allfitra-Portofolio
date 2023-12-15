import { Helmet } from 'react-helmet-async';

export const Head = ({ title = '', description = '' }) => {
  return (
    <Helmet title={title ? `Allfitra | ${title}` : undefined} defaultTitle="Allfitra">
      <meta name="description" content={description ? `${description}` : 'My portofolio'} />
    </Helmet>
  );
};
