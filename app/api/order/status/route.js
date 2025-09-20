import orderModel from '@/lib/models/orderModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/configs/mongoDB.js';
import { adminAuth } from '@/lib/middlewares/adminAuth.js';

export async function POST(request) {
    await connectDB(); // Ensure DB connection is established

    // Admin authentication
    const authResult = await adminAuth(request);
    if (!authResult.success) {
        return NextResponse.json(authResult);
    }

    try {
        const { orderId, status } = await request.json();
        await orderModel.findByIdAndUpdate(orderId, { status });
        return NextResponse.json({ success: true, message: "STATUS UPDATED" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}