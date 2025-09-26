
'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'
import OurPolicy from '@/components/OurPolicy'
import NewsletterBox from '@/components/NewsletterBox'

const LatestCollection = dynamic(() => import('@/components/LatestCollection'), {
  ssr: false,
  loading: () => (
    <div className='my-16 px-4 sm:px-8 lg:px-16'>
      <div className='text-center py-8'>
        <div className='h-8 w-48 mx-auto bg-gray-200 rounded animate-pulse' />
        <div className='h-4 w-3/4 mx-auto bg-gray-200 rounded mt-2 animate-pulse' />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className='animate-pulse'>
            <div className='h-60 bg-gray-200 rounded' />
            <div className='h-4 bg-gray-200 rounded mt-3 w-3/4' />
            <div className='h-4 bg-gray-200 rounded mt-2 w-1/3' />
          </div>
        ))}
      </div>
    </div>
  ),
})

const BestSeller = dynamic(() => import('@/components/BestSeller'), {
  ssr: false,
  loading: () => (
    <div className='my-10 px-4 sm:px-8 lg:px-16'>
      <div className='text-center py-8'>
        <div className='h-8 w-48 mx-auto bg-gray-200 rounded animate-pulse' />
        <div className='h-4 w-3/4 mx-auto bg-gray-200 rounded mt-2 animate-pulse' />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='animate-pulse'>
            <div className='h-60 bg-gray-200 rounded' />
            <div className='h-4 bg-gray-200 rounded mt-3 w-3/4' />
            <div className='h-4 bg-gray-200 rounded mt-2 w-1/3' />
          </div>
        ))}
      </div>
    </div>
  ),
})

const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home
