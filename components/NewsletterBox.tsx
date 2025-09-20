'use client'
import React from 'react';

const NewsletterBox = () => {
  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className='text-center py-16 bg-gray-100 rounded-xl shadow-lg mx-4 sm:mx-auto max-w-3xl'>
      <p className='text-3xl font-bold text-gray-900'>Subscribe & Get 20% Off</p>
      <p className='text-gray-500 mt-3 text-sm sm:text-base'>
        Stay ahead of the trends! Sign up for exclusive deals and updates.
      </p>
      <form
        onSubmit={onSubmitHandler}
        className='w-full sm:w-3/4 flex items-center gap-3 mx-auto my-6 border-2 border-gray-300 rounded-full px-4 py-2 bg-white shadow-md'
      >
        <input
          type='email'
          className='w-full flex-1 outline-none text-gray-700 px-2 text-sm sm:text-base bg-transparent'
          required
          placeholder='Enter your email'
        />
        <button
          type='submit'
          className='bg-blue-600 text-white text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300'
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;