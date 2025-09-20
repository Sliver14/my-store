'use client'
import { useContext, useEffect, useState } from 'react';
import { ShopContext, Product } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const { products } = useContext(ShopContext)!;

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className='my-16 px-4 sm:px-8 lg:px-16'>
      <div className='text-center py-8'>
        <Title text1={'LATEST'} text2={'COLLECTION'} />
        <p className='w-full md:w-3/4 mx-auto text-sm sm:text-base text-gray-600 mt-2'>
          Explore the freshest styles handpicked just for you. Upgrade your wardrobe with the latest trends and must-have pieces!
        </p>
      </div>

      {/* Rendering Products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-fade-in'>
        {latestProducts.map((item: Product, index) => (
          <div className='transition-transform transform hover:scale-105' key={index}>
            <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;