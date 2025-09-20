import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const adminAuth = async (request) => {
    try {
        const token = request.headers.get('authorization')?.split(' ')[1]; // Assuming Bearer token
        if (!token) {
            return { success: false, message: "NOT AUTHORISED LOGIN AGAIN" };
        }
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return { success: false, message: "NOT AUTHORISED LOGIN AGAIN" };
        }
        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message };
    }
};