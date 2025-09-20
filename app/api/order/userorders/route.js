import orderModel from '@/lib/models/orderModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/configs/mongoDB.js';
import { authUser } from '@/lib/middlewares/authUser.js';

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