import React from 'react';
import Image from "next/image";
import { assets } from '@/lib_src/assets';

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around items-center gap-12 sm:gap-6 text-center py-20 text-gray-700'>
      {[
        {
          icon: assets.exchange_icon,
          title: 'Easy Exchange Policy',
          description: 'Hassle-free exchanges on all purchases.',
        },
        {
          icon: assets.quality_icon,
          title: '7 Days Return Policy',
          description: 'Enjoy a 7-day worry-free return policy.',
        },
        {
          icon: assets.support_img,
          title: '24/7 Customer Support',
          description: 'Our support team is always here for you.',
        },
      ].map((policy, index) => (
        <div
          key={index}
          className='w-60 p-6 bg-white shadow-lg rounded-xl hover:cursor-pointer hover:shadow-2xl transform transition-all duration-300 hover:scale-105'
        >
          <Image src={policy.icon} width={56} height={56} className='w-14 mx-auto mb-4' alt={policy.title} />
          <p className='font-bold text-lg text-gray-900'>{policy.title}</p>
          <p className='text-gray-500 text-sm mt-2'>{policy.description}</p>
        </div>
      ))}
    </div>
  );
};

export default OurPolicy;