'use client'
import dynamic from 'next/dynamic';

const VerifyClient = dynamic(() => import('./VerifyClient'), { ssr: false });

const VerifyPage = () => {
  return <VerifyClient />;
};

export default VerifyPage;