import orderModel from '@/root_lib/models/orderModel.js';
import userModel from '@/root_lib/models/userModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/root_lib/configs/mongoDB.js';
import { authUser } from '@/root_lib/middlewares/authUser.js';
import Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function POST(request) {
    await connectDB(); // Ensure DB connection is established

    // User authentication
    const authResult = await authUser(request);
    if (!authResult.success) {
        return NextResponse.json(authResult);
    }
    const userId = authResult.userId; // Although userId is passed, it's not directly used in the original verifyRazorpay logic for updating cart.

    try {
        const { razorpay_order_id } = await request.json();
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === "paid") {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} }); // Clear cart after successful payment
            return NextResponse.json({ success: true, message: "PAYMENT SUCCESSFUL" });
        } else {
            return NextResponse.json({ success: false, message: "PAYMENT FAILED" });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}