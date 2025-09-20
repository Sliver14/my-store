import orderModel from '@/lib/models/orderModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/configs/mongoDB.js';
import { authUser } from '@/lib/middlewares/authUser.js';
import Razorpay from 'razorpay';

// GLOBAL VARIABLES
const currency = "inr";

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function POST(request) {
    await connectDB(); // Ensure DB connection is established

    // User authentication
    const authResult = await authUser(request);
    if (!authResult.success) {
        return NextResponse.json(authResult);
    }
    const userId = authResult.userId;

    try {
        const { items, amount, address } = await request.json();
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "RAZORPAY",
            payment: false,
            date: Date.now()
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        };

        const order = await razorpayInstance.orders.create(options);
        return NextResponse.json({ success: true, order });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}