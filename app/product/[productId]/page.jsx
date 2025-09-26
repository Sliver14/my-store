'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Title from "@/components/Title";
import ProductItem from "@/components/ProductItem";
import React, { useContext } from 'react'
import { ShopContext } from "@/context/ShopContext";
import { assets } from "@/lib_src/assets";
import RelatedProducts from "@/components/RelatedProducts";


const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      // Handle empty image array
      if (product.image && product.image.length > 0) {
        setImage(product.image[0]);
      } else {
        setImage(""); // Set empty string for placeholder
      }
    }
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18%] w-full gap-3">
            {productData.image && productData.image.length > 0 ? (
              productData.image.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  onClick={() => setImage(item)}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border-2 rounded-lg transition-transform hover:scale-105 hover:border-orange-500"
                  alt={`Product-${index}`}
                />
              ))
            ) : (
              <div className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-400 text-xs py-8">
                No images
              </div>
            )}
          </div>
          <div className="w-full sm:w-[80%]">
            {image ? (
              <img
                src={image}
                className="w-full h-auto rounded-lg shadow-md"
                alt="Selected Product"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md flex items-center justify-center text-gray-400 text-lg">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-semibold text-3xl">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, index) => (
              <img key={index} src={assets.star_icon} className="w-4" alt="" />
            ))}
            <img src={assets.star_dull_icon} className="w-4" alt="" />
            <p className="pl-2 text-gray-600">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-semibold text-black-500">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5 leading-relaxed">
            {productData.description}
          </p>

          {/* Size Selection */}
          <div className="flex flex-col gap-4 my-8">
            <p className="font-medium text-lg">Select Size</p>
            <div className="flex gap-2">
              {productData.sizes && productData.sizes.length > 0 ? (
                productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`border py-2 px-4 rounded-md transition-all ${
                      item === size
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                    }`}
                  >
                    {item}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No sizes available</p>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-blue-500 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-600 active:bg-blue-700 transition-all"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5 border-gray-300" />

          {/* Additional Info */}
          <div className="text-sm text-gray-600 mt-5 flex flex-col gap-1">
            <p>✅ 100% Original Product</p>
            <p>🚀 Cash on delivery available</p>
            <p>🔄 Easy return & exchange within 7 days</p>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-20">
        <div className="flex">
          <p className="border-b-2 border-orange-500 px-5 py-3 text-lg font-medium">
            Description
          </p>
          <p className="border px-5 py-3 text-lg hover:text-orange-500 cursor-pointer">
            Reviews (122)
          </p>
        </div>
        <div className="flex flex-col gap-4 border p-6 text-gray-600 bg-gray-50 rounded-lg">
          <p className="leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas
            neque quia ut deserunt at mollitia fugiat...
          </p>
          <p className="leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
            recusandae quibusdam adipisci...
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;