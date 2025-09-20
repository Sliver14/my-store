'use client'
import { useContext, useEffect, useState } from "react";
import Title from "@/components/Title";
import { assets } from "@/lib/assets";
import CartTotal from "@/components/CartTotal";
import { ShopContext, Product } from "@/context/ShopContext";



const Cart = () => {
  const context = useContext(ShopContext);
  const { products, currency, cartItems, updateQuantity, router } = context;
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products && cartItems && products.length > 0) {
      const tempData = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }

      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-14  min-h-screen w-full">
      <div className="text-2xl mb-6 text-center">
        <Title text1="YOUR" text2="CART" />
      </div>

      {/* Cart Items */}
      <div className="w-full bg-white shadow-lg rounded-lg py-6 px-4 sm:px-8">
        {cartData.length > 0 ? (
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);
            if (!productData) return null;

            return (
              <div
                key={index}
                className="py-4 border-t last:border-b flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 text-gray-700"
              >
                {/* Product Info */}
                <div className="flex items-start gap-6 w-full sm:w-2/3">
                  <img src={productData.image[0]} className="w-20 sm:w-24 rounded-md shadow-sm" alt={productData.name} />
                  <div>
                    <p className="text-sm sm:text-lg font-medium">{productData.name}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-gray-800 font-semibold">{currency} {productData.price}</p>
                      <p className="px-3 py-1 border bg-gray-100 rounded text-xs sm:text-sm">{item.size}</p>
                    </div>
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="flex items-center gap-4">
                  <input
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || value === "0") return;
                      updateQuantity(item._id, item.size, Number(value));
                    }}
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    className="border max-w-12 sm:max-w-20 px-2 py-1 text-center rounded-md shadow-sm outline-none focus:ring focus:ring-blue-300 transition"
                  />

                  {/* Delete Button */}
                  <img
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    src={assets.bin_icon}
                    className="w-5 cursor-pointer hover:scale-110 transition-transform"
                    alt="Delete"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 text-lg py-6">Your cart is empty.</p>
        )}
      </div>

      {/* Cart Summary & Checkout Button */}
      {cartData.length > 0 && (
        <div className="flex justify-end mt-12">
          <div className="w-full sm:w-[450px] bg-white shadow-lg rounded-lg p-6">
            <CartTotal />
            <div className="text-end mt-6">
              <button
                onClick={() => router.push("/place-order")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-3 rounded-lg shadow-md transition-all"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;