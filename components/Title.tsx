import React from 'react';

interface TitleProps {
    text1: string;
    text2: string;
}

const Title: React.FC<TitleProps> = ({ text1, text2 }) => {
  return (
    <div className='flex flex-col items-center justify-center gap-2 mb-5 mt-10'>
      <h2 className='text-3xl sm:text-4xl font-bold text-blue-700 tracking-wide uppercase'>
        {text1} <span className='text-gray-800'>{text2}</span>
      </h2>
      <div className='w-12 sm:w-16 h-[2px] bg-gray-800 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-125'></div>
    </div>
  );
};

export default Title;