import productModel from '@/root_lib/models/productModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/root_lib/configs/mongoDB.js';

export async function POST(request) {
    await connectDB(); // Ensure DB connection is established

    try {
        const { productId } = await request.json();
        const product = await productModel.findById(productId);

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}