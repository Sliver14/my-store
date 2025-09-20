import orderModel from '@/lib/models/orderModel.js';
import userModel from '@/lib/models/userModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/configs/mongoDB.js';
import { authUser } from '@/lib/middlewares/authUser.js';

export async function POST(request) {
    await connectDB(); // Ensure DB connection is established

    // User authentication
    const authResult = await authUser(request);
    if (!authResult.success) {
        return NextResponse.json(authResult);
    }
    const userId = authResult.userId;

    try {
        const { orderId, success } = await request.json(); // userId is also passed in original, but not used here.

        if (success === true) {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} }); // Clear cart after successful payment
            return NextResponse.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            return NextResponse.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}