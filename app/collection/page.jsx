
'use client'
import { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '@/context/ShopContext';
import { assets } from '@/lib_src/assets';
import Title from '@/components/Title';
import ProductItem from '@/components/ProductItem';
import { motion, AnimatePresence } from 'framer-motion';

const PAGE_SIZE = 16;

const Collection = () => {
  const context = useContext(ShopContext);
  const search = context?.search || '';
  const showSearch = context?.showSearch || false;

  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const queryParams = useMemo(() => {
    const p = new URLSearchParams();
    p.set('page', String(page));
    p.set('limit', String(PAGE_SIZE));
    if (showSearch && search) p.set('search', search);
    if (category.length) p.set('category', category.join(','));
    if (subCategory.length) p.set('subCategory', subCategory.join(','));
    if (sortType) p.set('sort', sortType);
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) p.set('minPrice', String(min));
    if (!isNaN(max)) p.set('maxPrice', String(max));
    return p;
  }, [page, showSearch, search, category, subCategory, sortType, minPrice, maxPrice]);

  const fetchProducts = async (opts = { reset: false }) => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/api/product/list', { params: Object.fromEntries(queryParams.entries()) });
      if (res.data.success) {
        const incoming = res.data.products || [];
        setHasMore(!!res.data.hasMore);
        setProducts((prev) => (opts.reset ? incoming : [...prev, ...incoming]));
      } else {
        setError(res.data.message || 'Failed to load products');
      }
    } catch (e) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters/search/sort change
  useEffect(() => {
    setPage(1);
    fetchProducts({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSearch, search, category, subCategory, sortType, minPrice, maxPrice]);

  // Fetch on page change (load more)
  useEffect(() => {
    if (page === 1) return; // already fetched in reset
    fetchProducts({ reset: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  return (
    <div className='flex flex-col sm:flex-row gap-6 pt-10 border-t px-4 md:px-10 mb-10'>
      {/* Filter Section */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2 font-semibold'>
          FILTERS
          <img src={assets.dropdown_icon} className={`h-3 sm:hidden transform ${showFilter ? 'rotate-180' : ''}`} alt='' />
        </p>
        <motion.div 
          className={`overflow-hidden sm:!block sm:!opacity-100`}
          initial={false}
          animate={{
            height: showFilter ? 'auto' : 0,
            opacity: showFilter ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Category Filter */}
          <div className='border border-gray-300 p-4 rounded-lg mb-4'>
            <p className='mb-2 text-sm font-medium'>CATEGORIES</p>
            {['MEN', 'WOMEN', 'KIDS'].map((cat) => (
              <label key={cat} className='flex gap-2 text-sm text-gray-700 cursor-pointer'>
                <input type='checkbox' value={cat} onChange={toggleCategory} checked={category.includes(cat)} className='accent-black' /> {cat}
              </label>
            ))}
          </div>
          {/* SubCategory Filter */}
          <div className='border border-gray-300 p-4 rounded-lg mb-4'>
            <p className='mb-2 text-sm font-medium'>TYPE</p>
            {['TOPWEAR', 'BOTTOMWEAR', 'WINTERWEAR'].map((subCat) => (
              <label key={subCat} className='flex gap-2 text-sm text-gray-700 cursor-pointer'>
                <input type='checkbox' value={subCat} onChange={toggleSubCategory} checked={subCategory.includes(subCat)} className='accent-black' /> {subCat}
              </label>
            ))}
          </div>
          {/* Price Filter */}
          <div className='border border-gray-300 p-4 rounded-lg'>
            <p className='mb-2 text-sm font-medium'>PRICE</p>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                inputMode='numeric'
                min='0'
                placeholder='Min'
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className='w-24 border rounded px-2 py-1 text-sm'
              />
              <span className='text-gray-500'>-</span>
              <input
                type='number'
                inputMode='numeric'
                min='0'
                placeholder='Max'
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className='w-24 border rounded px-2 py-1 text-sm'
              />
            </div>
            <div className='mt-3 flex items-center gap-2'>
              <input type='range' min='0' max='500' step='5' value={isNaN(parseFloat(minPrice)) ? 0 : parseFloat(minPrice)} onChange={(e) => setMinPrice(e.target.value)} className='w-1/2' />
              <input type='range' min='0' max='500' step='5' value={isNaN(parseFloat(maxPrice)) ? 500 : parseFloat(maxPrice)} onChange={(e) => setMaxPrice(e.target.value)} className='w-1/2' />
            </div>
          </div>
        </motion.div>

        {/* Active Filter Chips */}
        {(category.length > 0 || subCategory.length > 0 || (showSearch && search)) && (
          <div className='mt-4 flex flex-wrap gap-2'>
            {showSearch && search && (
              <span className='text-xs bg-gray-200 px-2 py-1 rounded-full'>Search: {search}</span>
            )}
            {category.map((c) => (
              <button key={c} onClick={() => setCategory((prev) => prev.filter((v) => v !== c))} className='text-xs bg-black text-white px-2 py-1 rounded-full'>
                {c} ×
              </button>
            ))}
            {subCategory.map((s) => (
              <button key={s} onClick={() => setSubCategory((prev) => prev.filter((v) => v !== s))} className='text-xs bg-black text-white px-2 py-1 rounded-full'>
                {s} ×
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products Section */}
      <div className='flex-1'>
        <div className='flex justify-between items-center mb-6'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          <select value={sortType} onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-3 py-1 rounded-md'>
            <option value='relevant'>Sort by: Relevant</option>
            <option value='low-high'>Sort by: Price Low-High</option>
            <option value='high-low'>Sort by: Price High-Low</option>
            <option value='newest'>Sort by: Newest</option>
            <option value='bestseller'>Sort by: Best Sellers</option>
          </select>
        </div>

        {/* Product Grid */}
        <motion.div 
          className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          layout
        >
          <AnimatePresence mode='wait'>
            {loading && products.length === 0 ? (
              // Loading skeletons
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <motion.div 
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className='animate-pulse'
                >
                  <div className='h-60 bg-gray-200 rounded-lg' />
                  <div className='h-4 bg-gray-200 rounded mt-3 w-3/4' />
                  <div className='h-4 bg-gray-200 rounded mt-2 w-1/3' />
                </motion.div>
              ))
            ) : products.length > 0 ? (
              // Product items with staggered animation
              products.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3,
                    layout: { duration: 0.3 }
                  }}
                >
                  <ProductItem id={item._id} name={item.name} price={item.price} image={item.image} />
                </motion.div>
              ))
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-12"
              >
                <div className="text-6xl mb-4">😞</div>
                <p className='text-red-600 text-center text-lg'>{error}</p>
                <motion.button
                  onClick={() => fetchProducts({ reset: true })}
                  className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Again
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <p className='text-gray-600 text-center text-lg'>No products found.</p>
                <p className='text-gray-500 text-center text-sm mt-2'>Try adjusting your filters or search terms.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Load More */}
        <AnimatePresence>
          {hasMore && !loading && (
            <motion.div 
              className='flex justify-center mt-8'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.button 
                onClick={() => setPage((p) => p + 1)} 
                className='px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 font-medium transition-colors'
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Load More Products
              </motion.button>
            </motion.div>
          )}
          {loading && products.length > 0 && (
            <motion.div 
              className='flex justify-center mt-8'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className='flex items-center gap-2 px-6 py-3 border rounded-lg bg-gray-50 text-gray-500'>
                <motion.div
                  className="w-4 h-4 border-2 border-gray-400 border-t-blue-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Loading more products...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Collection;
