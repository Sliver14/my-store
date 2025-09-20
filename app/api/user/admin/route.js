import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import connectDB from "@/root_lib/configs/mongoDB.js"; // Assuming this is needed for DB connection

export async function POST(request) {
    await connectDB(); // Ensure DB connection is established

    try {
        const { email, password } = await request.json();
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            return NextResponse.json({ success: true, token });
        } else {
            return NextResponse.json({ success: false, message: "INVALID CREDENTIALS" });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}