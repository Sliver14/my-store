import orderModel from '@/root_lib/models/orderModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/root_lib/configs/mongoDB.js';
import { authUser } from '@/root_lib/middlewares/authUser.js';
import Stripe from 'stripe';

// GLOBAL VARIABLES
const currency = "inr";
const deliveryCharge = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
        const origin = request.headers.get('origin'); // Get origin from request headers

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "STRIPE",
            payment: false,
            date: Date.now()
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "DELIVERY CHARGES"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });

        return NextResponse.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}