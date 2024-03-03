import { useEffect } from 'react';

const PageNotFound = () => {
  useEffect(() => {
    window.location.pathname = '/';
  }, []);
};

export default PageNotFound;
