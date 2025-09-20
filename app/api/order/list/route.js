import orderModel from '@/root_lib/models/orderModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/root_lib/configs/mongoDB.js';
import { adminAuth } from '@/root_lib/middlewares/adminAuth.js';

export async function POST(request) { // Original was POST
    await connectDB(); // Ensure DB connection is established

    // Admin authentication
    const authResult = await adminAuth(request);
    if (!authResult.success) {
        return NextResponse.json(authResult);
    }

    try {
        const orders = await orderModel.find({});
        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}