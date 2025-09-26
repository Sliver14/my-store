import productModel from '@/lib/models/productModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/configs/mongoDB.js';
import fs from 'fs/promises';
import path from 'path';

async function loadLocalProducts() {
    try {
        const filePath = path.join(process.cwd(), 'lib', 'data', 'products.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const json = JSON.parse(data);
        if (Array.isArray(json)) return json;
        return [];
    } catch (e) {
        return [];
    }
}

export async function POST(request) {
    try {
        const { productId } = await request.json();
        const useJsonProducts = process.env.USE_JSON_PRODUCTS === 'true';
        const hasMongo = !!process.env.MONGODB_URI && !useJsonProducts;

        if (!hasMongo || useJsonProducts) {
            // JSON fallback
            const products = await loadLocalProducts();
            const product = products.find(p => 
                (p._id && p._id === productId) || 
                (p.id && p.id === productId) ||
                (String(p.name || '') + String(p.date || '')) === productId
            );
            
            if (!product) {
                return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
            }

            return NextResponse.json({ success: true, product });
        }

        // MongoDB path with fallback
        try {
            await connectDB();
            const product = await productModel.findById(productId);
            return NextResponse.json({ success: true, product });
        } catch (dbError) {
            console.log('MongoDB connection failed for single product, falling back to JSON:', dbError.message);
            // Fall back to JSON products
            const products = await loadLocalProducts();
            const product = products.find(p => 
                (p._id && p._id === productId) || 
                (p.id && p.id === productId) ||
                (String(p.name || '') + String(p.date || '')) === productId
            );
            
            if (!product) {
                return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
            }

            return NextResponse.json({ success: true, product });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
