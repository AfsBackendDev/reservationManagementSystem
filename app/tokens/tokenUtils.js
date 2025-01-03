import jwt from 'jsonwebtoken';

export function createToken(user) {
    try {
        const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '1d' });
        return token;
    } catch (err) {
        console.log(err);
        const error = new Error("Server error: error making the token");
        error.status = 500;
        throw error;
    }
};

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return decoded;
    } catch (err) {
        const error = new Error("Unauthorized: Invalid token");
        error.status = 401;
        throw error;    
    }
}