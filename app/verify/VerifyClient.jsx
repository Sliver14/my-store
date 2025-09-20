'use client'
import { useContext, useEffect, Suspense } from 'react'
import { ShopContext } from '@/context/ShopContext'
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyClient = () => {

    const context = useContext(ShopContext);
    const {router, token, setCartItems, backendUrl } = context;

    const searchParams = useSearchParams();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async() => {
        try {
            if(!token){
                return null;
            }
            const response = await axios.post("/api/order/verifyStripe", {success, orderId},{headers: {token}});
            if(response.data.success){
                setCartItems({})
                router.push('/orders');
            } else{
                router.push('/cart');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Something went wrong");
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    useEffect(()=>{
        verifyPayment();
    },[token, verifyPayment]);

  return (
    <div>

    </div>
  )
}

export default VerifyClient