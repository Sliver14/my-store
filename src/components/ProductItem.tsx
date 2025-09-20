'use client'
import React,{useContext} from 'react'
import Image from "next/image";
import { ShopContext } from '../context/ShopContext';
import Link from 'next/link';

interface ProductItemProps {
    id: string;
    image: string[];
    name: string;
    price: number;
}

const ProductItem: React.FC<ProductItemProps> = ({id, image, name, price}) => {

  const context = useContext(ShopContext);
  if(!context) return null;
  const {currency} = context;

  return (
    <Link href={`/product/${id}`} className='text-gray-700 cursor-pointer'>
        <div className='overflow-hidden relative h-60'>
            <Image src={image[0]} alt={name} fill style={{objectFit:"cover"}} className='hover:scale-110 transition ease-in-out' />
        </div>
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem