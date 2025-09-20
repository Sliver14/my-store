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
        const { itemId, size, quantity } = await request.json();
        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {};

        if (cartData[itemId] && cartData[itemId][size]) {
            cartData[itemId][size] = quantity;
        } else {
            // Handle case where item or size might not exist in cart
            return NextResponse.json({ success: false, message: "Item or size not found in cart" });
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        return NextResponse.json({ success: true, message: "CART UPDATED" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}