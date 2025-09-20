
'use client'
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, deliveryFee, getCartAmount } = useContext(ShopContext)!;

  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + deliveryFee;

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-2xl mb-6">
        <Title text1="CART" text2="TOTALS" />
      </div>
      <div className="flex flex-col gap-4 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">
            {currency} {subtotal.toLocaleString()}.00
          </span>
        </div>
        <div className="border-t border-gray-300"></div>
        <div className="flex justify-between">
          <span>Shipping Fee</span>
          <span className="font-medium text-gray-900">
            {currency} {deliveryFee.toLocaleString()}.00
          </span>
        </div>
        <div className="border-t border-gray-300"></div>
        <div className="flex justify-between text-lg font-semibold mt-2 text-gray-900">
          <span>Total</span>
          <span>{currency} {total.toLocaleString()}.00</span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
