import productModel from '@/root_lib/models/productModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/root_lib/configs/mongoDB.js';
import { adminAuth } from '@/root_lib/middlewares/adminAuth.js';

export async function POST(request) {
    await connectDB(); // Ensure DB connection is established

    // Admin authentication
    const authResult = await adminAuth(request);
    if (!authResult.success) {
        return NextResponse.json(authResult);
    }

    try {
        const { id } = await request.json();
        await productModel.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "PRODUCT REMOVED" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}