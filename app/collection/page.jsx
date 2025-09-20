
'use client'
import { useContext, useEffect, useState, useCallback } from 'react';
import { ShopContext } from '@/context/ShopContext';
import { assets } from '@/lib_src/assets';
import Title from '@/components/Title';
import ProductItem from '@/components/ProductItem';
import { Product } from '@/context/ShopContext';

const Collection = () => {
  const context = useContext(ShopContext);
  const { products, search, showSearch } = context;
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  const toggleCategory = (e) => {
    setCategory((prev) =>
      prev.includes(e.target.value)
        ? prev.filter((item) => item !== e.target.value)
        : [...prev, e.target.value]
    );
  };

  const toggleSubCategory = (e) => {
    setSubCategory((prev) =>
      prev.includes(e.target.value)
        ? prev.filter((item) => item !== e.target.value)
        : [...prev, e.target.value]
    );
  };

  const applyFilter = useCallback(() => {
    let productsCopy = [...products];

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
    }
    
    setFilterProducts(productsCopy);
  }, [products, showSearch, search, category, subCategory]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  useEffect(() => {
    setFilterProducts((prev) => {
      const sortedProducts = [...prev];
      switch (sortType) {
        case 'low-high':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'high-low':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        default:
          return prev;
      }
      return sortedProducts;
    });
  }, [sortType]);

  return (
    <div className='flex flex-col sm:flex-row gap-6 pt-10 border-t px-4 md:px-10 mb-10'>
      {/* Filter Section */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2 font-semibold'>
          FILTERS
          <img src={assets.dropdown_icon} className={`h-3 sm:hidden transform ${showFilter ? 'rotate-180' : ''}`} alt='' />
        </p>
        <div className={`transition-all duration-300 ${showFilter ? 'block' : 'hidden'} sm:block`}> 
          {/* Category Filter */}
          <div className='border border-gray-300 p-4 rounded-lg mb-4'>
            <p className='mb-2 text-sm font-medium'>CATEGORIES</p>
            {['MEN', 'WOMEN', 'KIDS'].map((cat) => (
              <label key={cat} className='flex gap-2 text-sm text-gray-700 cursor-pointer'>
                <input type='checkbox' value={cat} onChange={toggleCategory} className='accent-black' /> {cat}
              </label>
            ))}
          </div>
          {/* SubCategory Filter */}
          <div className='border border-gray-300 p-4 rounded-lg'>
            <p className='mb-2 text-sm font-medium'>TYPE</p>
            {['TOPWEAR', 'BOTTOMWEAR', 'WINTERWEAR'].map((subCat) => (
              <label key={subCat} className='flex gap-2 text-sm text-gray-700 cursor-pointer'>
                <input type='checkbox' value={subCat} onChange={toggleSubCategory} className='accent-black' /> {subCat}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className='flex-1'>
        <div className='flex justify-between items-center mb-6'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-3 py-1 rounded-md'>
            <option value='relevant'>Sort by: Relevant</option>
            <option value='low-high'>Sort by: Price Low-High</option>
            <option value='high-low'>Sort by: Price High-Low</option>
          </select>
        </div>
        {/* Product Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {filterProducts.length > 0 ? (
            filterProducts.map((item) => (
              <div key={item._id} className='transition-transform transform hover:scale-105'>
                <ProductItem id={item._id} name={item.name} price={item.price} image={item.image} />
              </div>
            ))
          ) : (
            <p className='text-gray-600 text-center w-full col-span-4'>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
