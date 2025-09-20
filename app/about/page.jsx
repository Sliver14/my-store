
'use client'
import React from 'react';
import Title from '@/components/Title';
import { assets } from '@/lib_src/assets';
import NewsletterBox from '@/components/NewsletterBox';

const About = () => {
  return (
    <div className='px-4 sm:px-8 lg:px-16'>
      <div className='text-3xl text-center pt-8 border-t font-semibold text-gray-800'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className='my-12 flex flex-col md:flex-row gap-12 items-center'>
        <img src={assets.about_img} className='w-full md:max-w-[450px] rounded-lg shadow-lg' alt='About Us' />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-700 text-lg'>
          <p>
            At our store, we are passionate about bringing you the latest fashion trends with quality and affordability. 
            Our journey started with a simple goal: to make stylish, high-quality clothing accessible to everyone.
          </p>
          <p>
            We carefully curate our collections, ensuring that each piece meets our high standards of style and comfort. 
            Whether you&apos;re looking for everyday essentials or statement pieces, we&apos;ve got something for everyone.
          </p>
          <b className='text-gray-900 text-xl'>OUR MISSION</b>
          <p>
            Our mission is to inspire confidence through fashion. We believe that what you wear should reflect your personality, 
            empower you, and make you feel your best every day.
          </p>
        </div>
      </div>
      <div className='text-3xl py-6 text-center font-semibold text-gray-800'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className='flex flex-col md:flex-row text-lg mb-20 gap-6'>
        <div className='border px-10 md:px-16 py-10 flex flex-col gap-5 rounded-lg shadow-md bg-white'>
          <b className='text-gray-900 text-xl'>QUALITY ASSURANCE</b>
          <p className='text-gray-700'>
            We prioritize quality in every product we offer. Our clothing is crafted with attention to detail, ensuring durability 
            and comfort without compromising on style.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-10 flex flex-col gap-5 rounded-lg shadow-md bg-white'>
          <b className='text-gray-900 text-xl'>CONVENIENCE</b>
          <p className='text-gray-700'>
            Shopping with us is hassle-free. With a seamless online experience, secure payment options, and fast delivery, 
            we make fashion accessible from the comfort of your home.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-10 flex flex-col gap-5 rounded-lg shadow-md bg-white'>
          <b className='text-gray-900 text-xl'>EXCEPTIONAL CUSTOMER SERVICE</b>
          <p className='text-gray-700'>
            Our customers are at the heart of everything we do. We are committed to providing outstanding support, 
            ensuring your shopping experience is smooth and enjoyable.
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default About;

