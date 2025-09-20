
'use client'
import React, { useContext, useEffect, useState } from 'react';
import { assets } from "@/lib_src/assets"
import { ShopContext } from "@/context/ShopContext"
import axios from "axios";
import { toast } from "react-toastify";
import Title from "@/components/Title";
import { motion } from "framer-motion";



const Orders = () => {
  const context = useContext(ShopContext);
  const { backendUrl, token, currency } = context;
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            const orderItem = {
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                date: order.date,
                paymentMethod: order.paymentMethod,
                status: order.status
            }
            allOrdersItem.push(orderItem);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token, loadOrderData]);

  return (
    <div className="border-t pt-16 px-6 md:px-12">
      <div className="text-2xl text-center">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div className="mt-6">
        {orderData.length > 0 ? (
          orderData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="py-6 px-6 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition-all duration-300"
            >
              {/* Product Info */}
              <div className="flex items-start gap-6 text-sm">
                <img src={item.image[0]} className="w-16 sm:w-20 rounded-md shadow-md" alt={item.name} />
                <div>
                  <p className="sm:text-base font-semibold">{item.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                    <p>{currency}{item.price}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Date: <span className="font-medium">{new Date(item.date).toDateString()}</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Payment: <span className="font-medium">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>

              {/* Status & Track Order */}
              <div className="md:w-1/2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.status === "DELIVERED"
                        ? "bg-green-500"
                        : item.status === "SHIPPED"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    
                  ></div>
                  <p className="text-sm md:text-base font-medium">{item.status}</p>
                </div>
                <button
                  onClick={loadOrderData}
                  className="border border-blue-600 px-5 py-2 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 shadow-md"
                >
                  TRACK ORDER
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
