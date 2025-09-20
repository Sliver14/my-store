import userModel from "@/root_lib/models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import connectDB from "@/root_lib/configs/mongoDB.js"; // Assuming this is needed for DB connection

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
};

export async function POST(request) {
    await connectDB(); // Ensure DB connection is established

    try {
        const { email, password } = await request.json();

        const user = await userModel.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: "USER DOES NOT EXISTS" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            return NextResponse.json({ success: true, token });
        } else {
            return NextResponse.json({ success: false, message: "INVALID CREDENTIALS" });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}