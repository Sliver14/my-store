"use client"
import React, { useContext, useEffect, useState } from "react"
import Image from "next/image"
import { ShopContext } from "@/context/ShopContext"
import Link from "next/link"
import { motion } from "framer-motion"

interface ProductItemProps {
  id: string
  image: string[]
  name: string
  price: number
}

const ProductItem: React.FC<ProductItemProps> = ({ id, image, name, price }) => {
  const context = useContext(ShopContext)
  const { currency } = context ?? {}

  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    if (!id) return
    try {
      const raw = localStorage.getItem("wishlist_ids")
      const setIds = new Set<string>(raw ? JSON.parse(raw) : [])
      setWishlisted(setIds.has(id))
    } catch {}
  }, [id])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const raw = localStorage.getItem("wishlist_ids")
      const setIds = new Set<string>(raw ? JSON.parse(raw) : [])
      if (setIds.has(id)) {
        setIds.delete(id)
        setWishlisted(false)
      } else {
        setIds.add(id)
        setWishlisted(true)
      }
      localStorage.setItem("wishlist_ids", JSON.stringify(Array.from(setIds)))
    } catch {}
  }

  const src =
    image && Array.isArray(image) && typeof image[0] === "string" && image[0].length > 0
      ? image[0]
      : null

  // 🚨 only check context here, after hooks
  if (!context) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={`/product/${id}`} className='text-gray-700 cursor-pointer block'>
          <motion.div className='overflow-hidden relative h-60 rounded-lg bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300'>
              {src ? (
                <Image src={src} alt={name} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw" style={{objectFit:"cover"}} className='group-hover:scale-105 transition-transform duration-500 ease-out rounded-lg' />
              ) : (
                <div className='h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-xs rounded-lg'>
                  No image
                </div>
              )}
              <motion.button 
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'} 
                onClick={toggleWishlist} 
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                  wishlisted 
                    ? 'bg-red-50/90 text-red-500 shadow-md' 
                    : 'bg-white/70 text-gray-600 hover:bg-white/90'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={false}
                animate={{ scale: wishlisted ? 1.1 : 1 }}
              >
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill={wishlisted ? "currentColor" : "none"}
                  stroke={wishlisted ? "currentColor" : "currentColor"}
                  className="w-5 h-5"
                  initial={false}
                  animate={{ 
                    fill: wishlisted ? "currentColor" : "none",
                    scale: wishlisted ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.462 2.25 9.348 2.25 6.708 4.331 4.5 6.75 4.5c1.676 0 3.134.99 3.9 2.382.766-1.392 2.224-2.382 3.9-2.382 2.419 0 4.5 2.208 4.5 4.848 0 3.114-2.438 6.012-4.739 8.16a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.003a.75.75 0 01-.67 0z" />
                </motion.svg>
              </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="pt-3 space-y-1"
          >
            <p className='text-sm font-medium line-clamp-2 group-hover:text-gray-900 transition-colors duration-200'>{name}</p>
            <p className='text-sm font-semibold text-blue-600'>{currency}{price}</p>
          </motion.div>
      </Link>
    </motion.div>
  )
}

export default ProductItem