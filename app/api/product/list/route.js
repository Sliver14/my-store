import productModel from '@/root_lib/models/productModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/root_lib/configs/mongoDB.js';

export async function GET(request) {
    await connectDB(); // Ensure DB connection is established

    try {
        const products = await productModel.find({});
        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}