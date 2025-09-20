import orderModel from '@/root_lib/models/orderModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/root_lib/configs/mongoDB.js';
import { authUser } from '@/root_lib/middlewares/authUser.js';

export async function POST(request) { // Original was POST
    await connectDB(); // Ensure DB connection is established

    // User authentication
    const authResult = await authUser(request);
    if (!authResult.success) {
        return NextResponse.json(authResult);
    }
    const userId = authResult.userId;

    try {
        const orders = await orderModel.find({ userId });
        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}