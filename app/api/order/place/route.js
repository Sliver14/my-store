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
        const { items, amount, address } = await request.json();
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        return NextResponse.json({ success: true, message: "ORDER PLACED" });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}