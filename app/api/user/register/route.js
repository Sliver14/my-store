import userModel from "@/root_lib/models/userModel.js";
import validator from 'validator';
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
        const { name, email, password } = await request.json();

        // CHECKING USER ALREADY EXISTS OR NOT
        const exist = await userModel.findOne({ email });
        if (exist) {
            return NextResponse.json({ success: false, message: "USER ALREADY EXISTS" });
        }

        //VALIDATING EMAIL FORMAT OR STRONG PASSWORD
        if (!validator.isEmail(email)) {
            return NextResponse.json({ success: false, message: "PLEASE ENTER A VALID EMAIL" });
        }
        if (password.length < 8) {
            return NextResponse.json({ success: false, message: "PLEASE ENTER STRONG PASSWORD" });
        }

        // HASHING USER PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        return NextResponse.json({ success: true, token });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}