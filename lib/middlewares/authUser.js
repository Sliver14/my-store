import jwt from 'jsonwebtoken';

export const authUser = async (request) => {
    const token = request.headers.get('authorization')?.split(' ')[1]; // Assuming Bearer token
    if (!token) {
        return { success: false, message: "NOT AUTHORIZED LOGIN AGAIN" };
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        return { success: true, userId: tokenDecode.id };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message };
    }
};