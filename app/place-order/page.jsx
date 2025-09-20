'use client'
import { useContext, useState } from "react"
import { assets } from "@/lib_src/assets"
import CartTotal from "@/components/CartTotal"
import Title from "@/components/Title"
import { toast } from "react-toastify"
import axios from "axios"
import { ShopContext, Product } from "@/context/ShopContext"



const PlaceOrder = () => {

  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  })

  const context = useContext(ShopContext);
  if(!context) return null;

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData(data => ({ ...data, [name]: value}))
  }

  const intiPay = (order) => {
    const options = {
      key: 'rzp_test_RyNlwgetRk6mxB',
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            response,
            { headers: { token } }
          );
          if (data.success) {
            router.push('/orders');
            setCartItems({});
          }
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.zipcode}, ${formData.country}`,
      },
      theme: {
        color: "#3399cc",
      },
      method: {
        netbanking: true,
        card: true,
        wallet: true,
        upi: true, // UPI is also supported
      },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  
  

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    try{
      const orderItems = [];
      for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item] > 0){
            const itemInfo = products.find(product => product._id == items)
            if(itemInfo){
                const orderItem = {
                    ...itemInfo,
                    size: item,
                    quantity: cartItems[items][item]
                };
                orderItems.push(orderItem)
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: Number(getCartAmount())+ deliveryFee,
      }

      switch(method){
        case "cod": {
          const response = await axios.post(backendUrl+ "/api/order/place", orderData, { headers:{token}});
          
          if(response.data.success){
            setCartItems({});
            router.push("/orders");
          } else{
            toast.error(response.data.message);
          }
          break;
        }
        case "stripe": {
          const responseStripe = await axios.post(backendUrl+"/api/order/stripe", orderData, {headers: {token}});
          if(responseStripe.data.success){
            const {session_url} = responseStripe.data
            window.location.replace(session_url);
          } else{
            toast.error(responseStripe.data.message);
          }
          break;
        }
        case "razorpay": {
          const responseRazorpay = await axios.post(backendUrl+'/api/order/razorpay', orderData, {headers: {token}});
          if(responseRazorpay.data.success){
            intiPay(responseRazorpay.data.order);
            
          }
          break;
        }
        default:
          break;  
      }

    } catch(error) {
        toast.error("Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* ----------------------------------LEFT SIDE --------------------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"}/>
        </div>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} type="text" placeholder="FIRST NAME" className="border border-gray-500 rounded py-1.5 px-3.5 w-full"/>
          <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} type="text" placeholder="LAST NAME" className="border border-gray-500 rounded py-1.5 px-3.5 w-full"/>
        </div>
        <input required onChange={onChangeHandler} name="email" value={formData.email} type="email" placeholder="YOUR EMAIL" className="border border-gray-500 rounded py-1.5 px-3.5 w-full"/>
        <input required onChange={onChangeHandler} name="street" value={formData.street} type="text" placeholder="STREET" className="border border-gray-500 rounded py-1.5 px-3.5 w-full"/>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="city" value={formData.city} type="text" placeholder="CITY" className="border border-gray-500 rounded py-1.5 px-3.5 w-full"/>
          <input required onChange={onChangeHandler} name="state" value={formData.state} type="text" placeholder="STATE" className="border border-gray-500 rounded py-1.5 px-3.5 w-full"/>
        </div>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} type="number" placeholder="ZIP-CODE" className="border border-gray-500 rounded py-1.5 px-3.5 w-full"/>
          <input required onChange={onChangeHandler} name="country" value={formData.country} type="text" placeholder="COUNTRY" className="border border-gray-500 rounded py-1.5 px-3.5 w-full"/>
        </div>
        <input required onChange={onChangeHandler} name="phone" value={formData.phone} type="number" placeholder="PHONE_NUMBER" className="border border-gray-500 rounded py-1.5 px-3.5 w-full"/>
      </div>
      {/* ----------------------------Right ISde------------------ */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal/>
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"}/>
          {/* ----------------------------------PAYMENT METHOD SELECTION--------------------------------------- */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div onClick={()=> setMethod("stripe")} className="flex items-center gap-3 border border-gray-600 p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-sm ${method === 'stripe' ? "bg-black" : ""}`}></p>
              <img src={assets.stripe_logo} className="h-5 mx-4" alt="" />
            </div>
            <div onClick={()=> setMethod("razorpay")} className="flex items-center gap-3 border border-gray-600 p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-sm ${method === 'razorpay' ? "bg-black" : ""}`}></p>
              <img src={assets.razorpay_logo} className="h-5 mx-4" alt="" />
            </div>
            <div onClick={()=> setMethod("cod")} className="flex items-center gap-3 border border-gray-600 p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-sm ${method === 'cod' ? "bg-black" : ""}`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>
          </div>
          <div className="w-full text-end mt-8 mb-8">
            <button type="submit" className="bg-blue-600 text-white px-16 py-3 text-sm">PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder