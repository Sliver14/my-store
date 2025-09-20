import { v2 as cloudinary } from 'cloudinary';
import productModel from '@/lib/models/productModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/configs/mongoDB.js';
import { adminAuth } from '@/lib/middlewares/adminAuth.js';
import { parseMultipartForm, config } from '@/lib/utils/uploadHandler.js';
import fs from 'fs/promises'; // For deleting temporary files

export { config }; // Export config to disable body parser

export async function POST(request) {
    await connectDB(); // Ensure DB connection is established

    // Admin authentication
    const authResult = await adminAuth(request);
    if (!authResult.success) {
        return NextResponse.json(authResult);
    }

    try {
        const { fields, files } = await parseMultipartForm(request);

        const { name, description, price, category, subCategory, sizes, bestseller } = fields;

        const imageFiles = [files.image1?.[0], files.image2?.[0], files.image3?.[0], files.image4?.[0]].filter(Boolean);

        const imagesUrl = await Promise.all(
            imageFiles.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.filepath, { resource_type: 'image' });
                await fs.unlink(file.filepath); // Delete temporary file after upload
                return result.secure_url;
            })
        );

        const productData = {
            name,
            description,
            category,
            subCategory,
            price: Number(price),
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();

        return NextResponse.json({ success: true, message: "PRODUCT ADDED" });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}